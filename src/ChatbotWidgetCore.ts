import { DEFAULT_WELCOME_MESSAGE } from "./defaults.js";
import { renderLandscapeLayout } from "./layouts/landscapeLayout.js";
import { renderNormalLayout } from "./layouts/normalLayout.js";
import { MockChatTransport } from "./mock/mockTransport.js";
import { createLocalStorageConversationStore } from "./storage/localStorageConversationStore.js";
import { applyThemeTokens, createWidgetStyles } from "./styles.js";
import type {
  ActionExecutionContext,
  ChatTransport,
  Config,
  ConfigInput,
  ConversationSnapshot,
  ConversationStore,
  Message,
  MessageAction,
  MessageRole,
  PresenceAdapter,
  PresenceMessageInput,
  ThemeInput,
  WidgetActionApi,
  WidgetMode
} from "./types.js";
import { deepFreeze } from "./utils/deepFreeze.js";
import { mergeConfig } from "./utils/mergeConfig.js";
import { loadConfigFromScript } from "./utils/scriptConfig.js";

export interface ChatbotWidgetCoreOptions {
  transport?: ChatTransport;
  presenceAdapter?: PresenceAdapter;
  conversationStore?: ConversationStore;
  implementationThemeDefaults?: ThemeInput;
  idFactory?: () => string;
  now?: () => number;
}

function defaultIdFactory(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function randomScopeClass(): string {
  return `ccs-scope-${Math.random().toString(16).slice(2, 10)}`;
}

function toPositionClass(position: Config["position"]): string {
  return `ccs-pos-${position}`;
}

export class ChatbotWidgetCore {
  private readonly config: Readonly<Config>;
  private readonly transport: ChatTransport;
  private readonly presenceAdapter: PresenceAdapter | null;
  private readonly idFactory: () => string;
  private readonly now: () => number;
  private readonly scopeClass: string;
  private readonly conversationStore: ConversationStore | null;
  private readonly actionApi: WidgetActionApi;

  private currentMode: WidgetMode;
  private conversationId: string | null = null;
  private messages: Message[] = [];
  private host: HTMLElement | null = null;
  private renderRoot: ShadowRoot | HTMLElement | null = null;
  private usingShadowDom = false;
  private isOpen: boolean;
  private teaserVisible = false;
  private teaserDismissed = false;
  private isThinking = false;
  private thinkingText: string;

  private teaserTimeoutId: number | null = null;
  private thinkingIntervalId: number | null = null;
  private presenceIntervalId: number | null = null;
  private presenceInFlight = false;
  private visibilityListener: (() => void) | null = null;
  private focusListener: (() => void) | null = null;

  public static fromScript(
    scriptElement: HTMLScriptElement,
    options: ChatbotWidgetCoreOptions = {}
  ): ChatbotWidgetCore {
    const scriptConfig = loadConfigFromScript(scriptElement);
    return new ChatbotWidgetCore(scriptConfig, options);
  }

  public constructor(initConfig: ConfigInput, options: ChatbotWidgetCoreOptions = {}) {
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

  public getConfig(): Readonly<Config> {
    return this.config;
  }

  public getMode(): WidgetMode {
    return this.currentMode;
  }

  public getMessages(): readonly Message[] {
    return this.messages;
  }

  public getConversationId(): string | null {
    return this.conversationId;
  }

  public isWidgetOpen(): boolean {
    return this.isOpen;
  }

  public open(source: "api" | "toggle" | "teaser-open" = "api"): void {
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

  public close(source: "api" | "header-close" | "toggle" = "api"): void {
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

  public toggle(): void {
    if (this.isOpen) {
      this.close("toggle");
      return;
    }

    this.open("toggle");
  }

  public clearConversation(): void {
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

  public dismissTeaser(): void {
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

  public mount(host: HTMLElement): void {
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

  public unmount(): void {
    if (!this.host || !this.renderRoot) {
      return;
    }

    this.clearTeaserTimer();
    this.stopThinking();
    this.detachPresenceVisibilityHandlers();
    this.stopPresencePolling();

    if (this.usingShadowDom) {
      this.renderRoot.innerHTML = "";
    } else {
      this.host.innerHTML = "";
      this.host.classList.remove(this.scopeClass);
    }

    this.host = null;
    this.renderRoot = null;
  }

  public setMode(nextMode: WidgetMode): void {
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

  public async sendMessage(rawText: string): Promise<Message> {
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

    const streamState: {
      error: Error | null;
      actions?: MessageAction[];
      conversationId?: string | null;
      metadata?: Record<string, unknown>;
    } = { error: null };

    await this.transport.sendMessage(
      {
        message: userMessage,
        history: [...this.messages],
        config: this.config,
        conversationId: this.conversationId
      },
      {
        onChunk: (chunk) => {
          if (chunk) {
            this.stopThinking();
          }

          assistantMessage.state = "streaming";
          assistantMessage.text = `${assistantMessage.text}${chunk}`;
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
          streamState.actions = meta?.actions;
          streamState.conversationId = meta?.conversationId;
          streamState.metadata = meta?.metadata;
        },
        onError: (error) => {
          streamState.error = error;
        }
      }
    );

    if (streamState.error) {
      this.stopThinking();
      assistantMessage.state = "error";
      assistantMessage.text = `Unable to stream response: ${streamState.error.message}`;
      this.render();
      this.persistSnapshot();
      throw streamState.error;
    }

    this.stopThinking();
    assistantMessage.state = "complete";
    assistantMessage.actions = this.normalizeActions(streamState.actions);
    assistantMessage.metadata = streamState.metadata;

    if (typeof streamState.conversationId === "string") {
      this.conversationId = streamState.conversationId;
    }

    this.config.lifecycle.onStreamUpdate?.({
      messageId: assistantMessage.id,
      chunk: "",
      accumulatedText: assistantMessage.text,
      isFinal: true,
      timestamp: this.now()
    });

    this.render();
    this.persistSnapshot();
    this.startPresencePollingIfNeeded();

    return userMessage;
  }

  private resolveRenderRoot(host: HTMLElement): ShadowRoot | HTMLElement {
    const canUseShadowDom = this.config.useShadowDom !== false && typeof host.attachShadow === "function";

    if (canUseShadowDom) {
      this.usingShadowDom = true;
      return host.shadowRoot ?? host.attachShadow({ mode: "open" });
    }

    this.usingShadowDom = false;
    host.classList.add(this.scopeClass);
    return host;
  }

  private resolveWelcomeMessage(): string {
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

  private createMessage(
    role: MessageRole,
    text: string,
    state: Message["state"] = "complete",
    actions?: MessageAction[]
  ): Message {
    return {
      id: this.idFactory(),
      role,
      text,
      state,
      actions,
      createdAt: this.now()
    };
  }

  private createMessageFromPresence(input: PresenceMessageInput): Message {
    return {
      id: typeof input.id === "string" && input.id ? input.id : this.idFactory(),
      role: input.role,
      text: input.text,
      state: "complete",
      actions: this.normalizeActions(input.actions),
      metadata: input.metadata,
      createdAt: typeof input.createdAt === "number" ? input.createdAt : this.now()
    };
  }

  private normalizeActions(actions: MessageAction[] | undefined): MessageAction[] | undefined {
    if (!Array.isArray(actions) || actions.length === 0) {
      return undefined;
    }

    const normalized: MessageAction[] = [];

    for (const action of actions) {
      if (!action || typeof action.label !== "string" || !action.label.trim()) {
        continue;
      }

      if (action.type !== "send_message" && action.type !== "open_url" && action.type !== "custom") {
        continue;
      }

      const normalizedAction: MessageAction = {
        label: action.label,
        type: action.type
      };

      if (action.id) {
        normalizedAction.id = action.id;
      }

      if (typeof action.message === "string") {
        normalizedAction.message = action.message;
      }

      if (typeof action.url === "string") {
        normalizedAction.url = action.url;
      }

      if (action.payload && typeof action.payload === "object" && !Array.isArray(action.payload)) {
        normalizedAction.payload = action.payload;
      }

      normalized.push(normalizedAction);
    }

    return normalized.length > 0 ? normalized : undefined;
  }

  private hydrateFromStore(): void {
    if (!this.conversationStore) {
      return;
    }

    const snapshot = this.conversationStore.load();
    if (!snapshot) {
      return;
    }

    this.conversationId = snapshot.conversationId;
    this.messages = snapshot.messages;
    this.currentMode = snapshot.mode;
    this.teaserDismissed = snapshot.teaserDismissed;
    if (this.config.storage.persistOpenState) {
      this.isOpen = snapshot.isOpen;
    }
  }

  private persistSnapshot(): void {
    if (!this.conversationStore || !this.config.storage.enabled) {
      return;
    }

    const maxMessages = Math.max(1, this.config.storage.maxMessages);
    const persistedMessages = this.messages.slice(-maxMessages).map((message) => ({
      ...message,
      actions: message.actions ? [...message.actions] : undefined,
      metadata: message.metadata ? { ...message.metadata } : undefined
    }));

    const snapshot: ConversationSnapshot = {
      conversationId: this.conversationId,
      mode: this.currentMode,
      isOpen: this.config.storage.persistOpenState ? this.isOpen : this.config.initiallyOpen,
      teaserDismissed: this.teaserDismissed,
      messages: persistedMessages,
      updatedAt: this.now()
    };

    this.conversationStore.save(snapshot);
  }

  private clearTeaserTimer(): void {
    if (this.teaserTimeoutId === null) {
      return;
    }

    window.clearTimeout(this.teaserTimeoutId);
    this.teaserTimeoutId = null;
  }

  private scheduleTeaserIfNeeded(): void {
    this.clearTeaserTimer();

    if (!this.renderRoot) {
      return;
    }

    if (!this.config.teaser.enabled || this.isOpen || this.teaserDismissed) {
      this.teaserVisible = false;
      return;
    }

    this.teaserTimeoutId = window.setTimeout(() => {
      if (!this.isOpen) {
        this.teaserVisible = true;
        this.render();
        this.persistSnapshot();
        this.config.lifecycle.onTeaser?.({
          visible: true,
          reason: "timer",
          timestamp: this.now()
        });
      }
    }, this.config.teaser.delayMs);
  }

  private startThinking(): void {
    this.stopThinking();
    this.isThinking = true;
    this.thinkingText = this.config.thinking.messages[0] ?? "Thinking...";

    let index = 0;
    this.thinkingIntervalId = window.setInterval(() => {
      index = (index + 1) % this.config.thinking.messages.length;
      this.thinkingText = this.config.thinking.messages[index] ?? this.thinkingText;
      this.render();
    }, this.config.thinking.intervalMs);
  }

  private stopThinking(): void {
    this.isThinking = false;

    if (this.thinkingIntervalId !== null) {
      window.clearInterval(this.thinkingIntervalId);
      this.thinkingIntervalId = null;
    }
  }

  private attachPresenceVisibilityHandlers(): void {
    if (!this.config.presence.pauseWhenHidden || this.visibilityListener || this.focusListener) {
      return;
    }

    this.visibilityListener = () => {
      if (document.visibilityState === "visible") {
        void this.pollPresence();
        this.startPresencePollingIfNeeded();
        return;
      }

      this.stopPresencePolling();
    };

    this.focusListener = () => {
      void this.pollPresence();
      this.startPresencePollingIfNeeded();
    };

    document.addEventListener("visibilitychange", this.visibilityListener);
    window.addEventListener("focus", this.focusListener);
  }

  private detachPresenceVisibilityHandlers(): void {
    if (this.visibilityListener) {
      document.removeEventListener("visibilitychange", this.visibilityListener);
      this.visibilityListener = null;
    }

    if (this.focusListener) {
      window.removeEventListener("focus", this.focusListener);
      this.focusListener = null;
    }
  }

  private startPresencePollingIfNeeded(): void {
    if (!this.renderRoot) {
      return;
    }

    if (!this.config.presence.enabled || !this.presenceAdapter || !this.conversationId) {
      return;
    }

    if (!this.config.presence.pollWhenClosed && !this.isOpen) {
      return;
    }

    if (this.presenceIntervalId !== null) {
      return;
    }

    this.presenceIntervalId = window.setInterval(() => {
      void this.pollPresence();
    }, this.config.presence.intervalMs);

    void this.pollPresence();
  }

  private stopPresencePolling(): void {
    if (this.presenceIntervalId === null) {
      return;
    }

    window.clearInterval(this.presenceIntervalId);
    this.presenceIntervalId = null;
  }

  private async pollPresence(): Promise<void> {
    if (this.presenceInFlight || !this.presenceAdapter || !this.conversationId) {
      return;
    }

    if (!this.config.presence.pollWhenClosed && !this.isOpen) {
      return;
    }

    this.presenceInFlight = true;

    try {
      const result = await this.presenceAdapter.poll({
        conversationId: this.conversationId,
        knownMessageCount: this.messages.length
      });

      if (typeof result.conversationId === "string") {
        this.conversationId = result.conversationId;
      }

      if (!Array.isArray(result.newMessages) || result.newMessages.length === 0) {
        return;
      }

      const existingIds = new Set(this.messages.map((message) => message.id));
      const appended: Message[] = [];

      for (const item of result.newMessages) {
        const message = this.createMessageFromPresence(item);
        if (existingIds.has(message.id)) {
          continue;
        }

        existingIds.add(message.id);
        this.messages.push(message);
        appended.push(message);
      }

      if (appended.length === 0) {
        return;
      }

      this.config.lifecycle.onPresence?.({
        newMessages: appended,
        timestamp: this.now()
      });

      this.render();
      this.persistSnapshot();
    } catch {
      // Presence failures should not break the widget interaction flow.
    } finally {
      this.presenceInFlight = false;
    }
  }

  private async handleAction(action: MessageAction, sourceMessage: Message): Promise<void> {
    const context: ActionExecutionContext = {
      action,
      sourceMessage,
      widget: this.actionApi,
      timestamp: this.now()
    };

    this.config.lifecycle.onActionInvoked?.({
      action,
      sourceMessage,
      timestamp: context.timestamp
    });

    if (action.type === "send_message") {
      if (this.config.actionHandlers.sendMessage) {
        await this.config.actionHandlers.sendMessage(context);
        return;
      }

      if (action.message && action.message.trim()) {
        await this.sendMessage(action.message);
      }
      return;
    }

    if (action.type === "open_url") {
      if (this.config.actionHandlers.openUrl) {
        await this.config.actionHandlers.openUrl(context);
        return;
      }

      if (action.url) {
        window.open(action.url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    if (this.config.actionHandlers.custom) {
      await this.config.actionHandlers.custom(context);
    }
  }

  private render(): void {
    if (!this.renderRoot) {
      return;
    }

    const sharedLayoutState = {
      title: this.config.title,
      inputPlaceholder: this.config.inputPlaceholder,
      positionClass: toPositionClass(this.config.position),
      allowRuntimeModeSwitch: this.config.allowRuntimeModeSwitch,
      showRefreshButton: this.config.showRefreshButton,
      isOpen: this.isOpen,
      showTeaser: this.teaserVisible,
      teaserTitle: this.config.teaser.title,
      teaserText: this.config.teaser.text,
      messages: this.messages,
      isThinking: this.isThinking,
      thinkingText: this.thinkingText,
      labels: this.config.i18n.messages
    };

    const layout =
      this.currentMode === "landscape"
        ? renderLandscapeLayout(sharedLayoutState)
        : renderNormalLayout(sharedLayoutState);

    const styleTag = `<style>${createWidgetStyles(this.usingShadowDom ? null : this.scopeClass)}</style>`;
    this.renderRoot.innerHTML = `${styleTag}${layout}`;

    const rootElement = this.renderRoot.querySelector(".ccs-root");
    if (!(rootElement instanceof HTMLElement)) {
      throw new Error("Widget root failed to render.");
    }

    applyThemeTokens(rootElement, this.config.theme.tokens, this.config.theme.fontFamilies);
    this.bindUi(rootElement);

    const messageContainer = rootElement.querySelector<HTMLElement>("[data-chat-messages]");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  private bindUi(rootElement: HTMLElement): void {
    const openButton = rootElement.querySelector<HTMLButtonElement>("[data-toggle-open]");
    openButton?.addEventListener("click", () => this.open("toggle"));

    const closeButton = rootElement.querySelector<HTMLButtonElement>("[data-close-chat]");
    closeButton?.addEventListener("click", () => this.close("header-close"));

    const refreshButton = rootElement.querySelector<HTMLButtonElement>("[data-refresh-chat]");
    refreshButton?.addEventListener("click", () => this.clearConversation());

    const openFromTeaserButton = rootElement.querySelector<HTMLButtonElement>("[data-open-from-teaser]");
    openFromTeaserButton?.addEventListener("click", () => this.open("teaser-open"));

    const dismissTeaserButton = rootElement.querySelector<HTMLButtonElement>("[data-dismiss-teaser]");
    dismissTeaserButton?.addEventListener("click", () => this.dismissTeaser());

    const modeButtons = rootElement.querySelectorAll<HTMLButtonElement>("[data-set-mode]");
    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextMode = button.dataset.setMode;
        if (nextMode === "normal" || nextMode === "landscape") {
          this.setMode(nextMode);
        }
      });
    });

    const actionButtons = rootElement.querySelectorAll<HTMLButtonElement>(
      "[data-action-message-id][data-action-index]"
    );
    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const messageId = button.dataset.actionMessageId;
        const actionIndex = Number(button.dataset.actionIndex);
        if (!messageId || !Number.isFinite(actionIndex)) {
          return;
        }

        const sourceMessage = this.messages.find((message) => message.id === messageId);
        const action = sourceMessage?.actions?.[actionIndex];
        if (!sourceMessage || !action) {
          return;
        }

        void this.handleAction(action, sourceMessage).catch(() => undefined);
      });
    });

    const form = rootElement.querySelector<HTMLFormElement>("[data-chat-form]");
    const input = rootElement.querySelector<HTMLTextAreaElement>("[data-chat-input]");

    if (!form || !input) {
      return;
    }

    const autoResize = () => {
      input.style.height = "auto";
      input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
    };

    input.addEventListener("input", autoResize);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value;
      input.value = "";
      input.style.height = "auto";
      void this.sendMessage(value).catch(() => undefined);
    });

    autoResize();
  }
}
