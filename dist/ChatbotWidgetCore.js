import { DEFAULT_WELCOME_MESSAGE } from "./defaults.js";
import { renderLandscapeLayout } from "./layouts/landscapeLayout.js";
import { renderNormalLayout } from "./layouts/normalLayout.js";
import { MockChatTransport } from "./mock/mockTransport.js";
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
export class ChatbotWidgetCore {
    config;
    transport;
    idFactory;
    scopeClass;
    currentMode;
    messages = [];
    host = null;
    renderRoot = null;
    usingShadowDom = false;
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
        this.idFactory = options.idFactory ?? defaultIdFactory;
        this.scopeClass = randomScopeClass();
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
        this.render();
        const welcomeMessage = this.messages[0];
        if (welcomeMessage) {
            this.config.lifecycle.onInitialize?.({
                mode: this.currentMode,
                config: this.config,
                welcomeMessage,
                timestamp: Date.now()
            });
        }
    }
    unmount() {
        if (!this.host || !this.renderRoot) {
            return;
        }
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
            timestamp: Date.now()
        });
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
            timestamp: Date.now()
        });
        const assistantMessage = this.createMessage("assistant", "");
        this.messages.push(assistantMessage);
        const streamState = { error: null };
        await this.transport.sendMessage({
            message: userMessage,
            history: [...this.messages],
            config: this.config
        }, {
            onChunk: (chunk) => {
                assistantMessage.text = `${assistantMessage.text}${chunk}`;
                this.config.lifecycle.onStreamUpdate?.({
                    messageId: assistantMessage.id,
                    chunk,
                    accumulatedText: assistantMessage.text,
                    isFinal: false,
                    timestamp: Date.now()
                });
                this.render();
            },
            onComplete: () => {
                this.config.lifecycle.onStreamUpdate?.({
                    messageId: assistantMessage.id,
                    chunk: "",
                    accumulatedText: assistantMessage.text,
                    isFinal: true,
                    timestamp: Date.now()
                });
                this.render();
            },
            onError: (error) => {
                streamState.error = error;
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
    createMessage(role, text) {
        return {
            id: this.idFactory(),
            role,
            text,
            createdAt: Date.now()
        };
    }
    render() {
        if (!this.renderRoot) {
            return;
        }
        const layout = this.currentMode === "landscape"
            ? renderLandscapeLayout(this.messages, this.currentMode)
            : renderNormalLayout(this.messages, this.currentMode);
        const styleTag = `<style>${createWidgetStyles(this.usingShadowDom ? null : this.scopeClass)}</style>`;
        this.renderRoot.innerHTML = `${styleTag}${layout}`;
        const rootElement = this.renderRoot.querySelector(".ccs-root");
        if (!(rootElement instanceof HTMLElement)) {
            throw new Error("Widget root failed to render.");
        }
        applyThemeTokens(rootElement, this.config.theme.tokens, this.config.theme.fontFamilies);
        this.bindUi(rootElement);
    }
    bindUi(rootElement) {
        const modeButtons = rootElement.querySelectorAll("[data-set-mode]");
        modeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const nextMode = button.dataset.setMode;
                if (nextMode === "normal" || nextMode === "landscape") {
                    this.setMode(nextMode);
                }
            });
        });
        const form = rootElement.querySelector("[data-chat-form]");
        const input = rootElement.querySelector("[data-chat-input]");
        if (!form || !input) {
            return;
        }
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const value = input.value;
            input.value = "";
            void this.sendMessage(value).catch(() => undefined);
        });
    }
}
//# sourceMappingURL=ChatbotWidgetCore.js.map