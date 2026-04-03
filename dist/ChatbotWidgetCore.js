import { DEFAULT_WELCOME_MESSAGE } from "./defaults.js";
import { renderLandscapeLayout } from "./layouts/landscapeLayout.js";
import { renderNormalLayout } from "./layouts/normalLayout.js";
import { MockChatTransport } from "./mock/mockTransport.js";
import { createLocalStorageConversationStore } from "./storage/localStorageConversationStore.js";
import { applyThemeTokens, createWidgetStyles } from "./styles.js";
import { deepFreeze } from "./utils/deepFreeze.js";
import { mergeConfig } from "./utils/mergeConfig.js";
import { loadConfigFromScript } from "./utils/scriptConfig.js";
function defaultIdFactory() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function randomScopeClass() {
    return `ccs-scope-${Math.random().toString(16).slice(2, 10)}`;
}
function toPositionClass(position) {
    return `ccs-pos-${position}`;
}
export class ChatbotWidgetCore {
    config;
    transport;
    presenceAdapter;
    idFactory;
    now;
    scopeClass;
    conversationStore;
    actionApi;
    currentMode;
    conversationId = null;
    messages = [];
    host = null;
    renderRoot = null;
    usingShadowDom = false;
    isOpen;
    teaserVisible = false;
    teaserDismissed = false;
    isThinking = false;
    thinkingText;
    teaserTimeoutId = null;
    thinkingIntervalId = null;
    presenceIntervalId = null;
    presenceInFlight = false;
    visibilityListener = null;
    focusListener = null;
    static fromScript(scriptElement, options = {}) {
        const scriptConfig = loadConfigFromScript(scriptElement);
        return new ChatbotWidgetCore(scriptConfig, options);
    }
    constructor(initConfig, options = {}) {
        const merged = mergeConfig(initConfig, {
            implementationThemeDefaults: options.implementationThemeDefaults
        });
        this.config = deepFreeze(merged);
        this.currentMode = this.config.mode;
        this.transport = options.transport ?? new MockChatTransport();
        this.presenceAdapter = options.presenceAdapter ?? null;
        this.idFactory = options.idFactory ?? defaultIdFactory;
        this.now = options.now ?? (() => Date.now());
        this.scopeClass = randomScopeClass();
        this.isOpen = this.config.initiallyOpen;
        this.thinkingText = this.config.thinking.messages[0] ?? "Thinking...";
        this.actionApi = {
            sendMessage: (text) => this.sendMessage(text),
            open: () => this.open(),
            close: () => this.close(),
            toggle: () => this.toggle(),
            clearConversation: () => this.clearConversation()
        };
        this.conversationStore =
            options.conversationStore ??
                (this.config.storage.enabled
                    ? createLocalStorageConversationStore(this.config.storage.key)
                    : null);
        this.hydrateFromStore();
    }
    getConfig() {
        return this.config;
    }
    getMode() {
        return this.currentMode;
    }
    getMessages() {
        return this.messages;
    }
    getConversationId() {
        return this.conversationId;
    }
    isWidgetOpen() {
        return this.isOpen;
    }
    open(source = "api") {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.teaserVisible = false;
        this.teaserDismissed = true;
        this.clearTeaserTimer();
        this.stopThinking();
        this.render();
        this.persistSnapshot();
        this.startPresencePollingIfNeeded();
        this.config.lifecycle.onOpenChange?.({
            isOpen: true,
            source,
            timestamp: this.now()
        });
        this.config.lifecycle.onTeaser?.({
            visible: false,
            reason: "open",
            timestamp: this.now()
        });
    }
    close(source = "api") {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.stopThinking();
        if (!this.config.presence.pollWhenClosed) {
            this.stopPresencePolling();
        }
        this.scheduleTeaserIfNeeded();
        this.render();
        this.persistSnapshot();
        this.config.lifecycle.onOpenChange?.({
            isOpen: false,
            source,
            timestamp: this.now()
        });
    }
    toggle() {
        if (this.isOpen) {
            this.close("toggle");
            return;
        }
        this.open("toggle");
    }
    clearConversation() {
        this.stopThinking();
        this.messages = [];
        this.conversationId = null;
        this.presenceInFlight = false;
        if (this.conversationStore) {
            this.conversationStore.clear();
        }
        const welcomeMessage = this.createMessage("assistant", this.resolveWelcomeMessage());
        this.messages.push(welcomeMessage);
        this.render();
        this.persistSnapshot();
    }
    dismissTeaser() {
        if (!this.teaserVisible && this.teaserDismissed) {
            return;
        }
        this.teaserVisible = false;
        this.teaserDismissed = true;
        this.clearTeaserTimer();
        this.render();
        this.persistSnapshot();
        this.config.lifecycle.onTeaser?.({
            visible: false,
            reason: "dismiss",
            timestamp: this.now()
        });
    }
    mount(host) {
        if (!(host instanceof HTMLElement)) {
            throw new Error("A valid host element is required to mount the widget.");
        }
        this.host = host;
        this.renderRoot = this.resolveRenderRoot(host);
        if (this.messages.length === 0) {
            const welcomeMessage = this.createMessage("assistant", this.resolveWelcomeMessage());
            this.messages.push(welcomeMessage);
        }
        this.attachPresenceVisibilityHandlers();
        this.scheduleTeaserIfNeeded();
        this.render();
        this.startPresencePollingIfNeeded();
        this.persistSnapshot();
        const welcomeMessage = this.messages[0];
        if (welcomeMessage) {
            this.config.lifecycle.onInitialize?.({
                mode: this.currentMode,
                isOpen: this.isOpen,
                config: this.config,
                welcomeMessage,
                timestamp: this.now()
            });
        }
    }
    unmount() {
        if (!this.host || !this.renderRoot) {
            return;
        }
        this.clearTeaserTimer();
        this.stopThinking();
        this.detachPresenceVisibilityHandlers();
        this.stopPresencePolling();
        if (this.usingShadowDom) {
            this.renderRoot.innerHTML = "";
        }
        else {
            this.host.innerHTML = "";
            this.host.classList.remove(this.scopeClass);
        }
        this.host = null;
        this.renderRoot = null;
    }
    setMode(nextMode) {
        if (!this.config.allowRuntimeModeSwitch) {
            return;
        }
        if (nextMode === this.currentMode) {
            return;
        }
        const previousMode = this.currentMode;
        this.currentMode = nextMode;
        if (this.renderRoot) {
            this.render();
        }
        this.config.lifecycle.onToggleLayout?.({
            previousMode,
            nextMode,
            timestamp: this.now()
        });
        this.persistSnapshot();
    }
    async sendMessage(rawText) {
        if (!this.renderRoot) {
            throw new Error("Widget must be mounted before sending messages.");
        }
        const text = rawText.trim();
        if (!text) {
            throw new Error("Message text cannot be empty.");
        }
        const userMessage = this.createMessage("user", text);
        this.messages.push(userMessage);
        this.config.lifecycle.onMessageSent?.({
            mode: this.currentMode,
            message: userMessage,
            timestamp: this.now()
        });
        const assistantMessage = this.createMessage("assistant", "", "pending");
        this.messages.push(assistantMessage);
        this.startThinking();
        this.render();
        this.persistSnapshot();
        const streamState = { error: null };
        await this.transport.sendMessage({
            message: userMessage,
            history: [...this.messages],
            config: this.config,
            conversationId: this.conversationId
        }, {
            onChunk: (chunk) => {
                assistantMessage.text = `${assistantMessage.text}${chunk}`;
                assistantMessage.state = "streaming";
                this.startThinking();
                this.config.lifecycle.onStreamUpdate?.({
                    messageId: assistantMessage.id,
                    chunk,
                    accumulatedText: assistantMessage.text,
                    isFinal: false,
                    timestamp: this.now()
                });
                this.render();
            },
            onComplete: (meta) => {
                assistantMessage.state = "complete";
                if (meta?.actions) {
                    assistantMessage.actions = meta.actions;
                }
                if (meta?.conversationId) {
                    this.conversationId = meta.conversationId;
                }
                this.stopThinking();
                this.config.lifecycle.onStreamUpdate?.({
                    messageId: assistantMessage.id,
                    chunk: "",
                    accumulatedText: assistantMessage.text,
                    isFinal: true,
                    timestamp: this.now()
                });
                this.render();
                this.persistSnapshot();
            },
            onError: (error) => {
                streamState.error = error;
                assistantMessage.state = "error";
                this.stopThinking();
            }
        });
        if (streamState.error) {
            assistantMessage.text = `Unable to stream response: ${streamState.error.message}`;
            this.render();
            throw streamState.error;
        }
        return userMessage;
    }
    resolveRenderRoot(host) {
        const canUseShadowDom = this.config.useShadowDom !== false && typeof host.attachShadow === "function";
        if (canUseShadowDom) {
            this.usingShadowDom = true;
            return host.shadowRoot ?? host.attachShadow({ mode: "open" });
        }
        this.usingShadowDom = false;
        host.classList.add(this.scopeClass);
        return host;
    }
    resolveWelcomeMessage() {
        const resolved = this.config.resolveWelcomeMessage?.({
            mode: this.currentMode,
            apiEndpoint: this.config.apiEndpoint,
            socketUrl: this.config.socketUrl
        });
        if (typeof resolved === "string" && resolved.trim()) {
            return resolved;
        }
        return DEFAULT_WELCOME_MESSAGE;
    }
    createMessage(role, text, state = "complete") {
        return {
            id: this.idFactory(),
            role,
            text,
            state,
            createdAt: this.now()
        };
    }
    // ... (rest of file omitted for brevity in this tool upload request)
