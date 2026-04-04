export type WidgetMode = "normal" | "landscape";

export type WidgetPosition =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center"
  | "middle-right"
  | "middle-left";

export type MessageRole = "user" | "assistant";

export type MessageState = "pending" | "streaming" | "complete" | "error";

export type MessageActionType = "send_message" | "open_url" | "custom";

export interface MessageAction {
  id?: string;
  label: string;
  type: MessageActionType;
  message?: string;
  url?: string;
  payload?: Record<string, unknown>;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: number;
  state: MessageState;
  actions?: MessageAction[];
  metadata?: Record<string, unknown>;
}

export interface ThemeTokens {
  colorSurface: string;
  colorPanel: string;
  colorPrimary: string;
  colorText: string;
  colorMutedText: string;
  colorBorder: string;
  borderRadius: string;
  spacing: string;
}

export interface Theme {
  name: string;
  tokens: ThemeTokens;
  fontFamilies: string[];
}

export interface ThemeInput {
  name?: string;
  tokens?: Partial<ThemeTokens>;
  fontFamilies?: string[];
}

export interface TeaserConfig {
  enabled: boolean;
  delayMs: number;
  title: string;
  text: string;
}

export interface StorageConfig {
  enabled: boolean;
  key: string;
  maxMessages: number;
  persistOpenState: boolean;
}

export interface PresenceConfig {
  enabled: boolean;
  intervalMs: number;
  pauseWhenHidden: boolean;
  pollWhenClosed: boolean;
}

export interface ThinkingConfig {
  messages: string[];
  intervalMs: number;
}

export interface I18nMessages {
  layoutModeSelectorAriaLabel: string;
  layoutModeNormalLabel: string;
  layoutModeLandscapeLabel: string;
  messageActionsAriaLabel: string;
  emptyMessageListText: string;
  landscapeSidebarTitle: string;
  landscapeSidebarLine1: string;
  landscapeSidebarLine2: string;
  teaserDismissAriaLabel: string;
  openChatAriaLabel: string;
  clearConversationTitle: string;
  closeChatTitle: string;
  inputAriaLabel: string;
  sendMessageAriaLabel: string;
  sendMessageLabel: string;
}

export interface I18nConfigInput {
  locale?: string;
  fallbackLocale?: string;
  customTranslations?: Record<string, Partial<I18nMessages>>;
}

export interface I18nConfig {
  locale: string;
  fallbackLocale: string;
  customTranslations: Record<string, Partial<I18nMessages>>;
  messages: I18nMessages;
}

export interface WidgetActionApi {
  sendMessage: (text: string) => Promise<Message>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  clearConversation: () => void;
}

export interface ActionExecutionContext {
  action: MessageAction;
  sourceMessage: Message;
  widget: WidgetActionApi;
  timestamp: number;
}

export interface ActionHandlers {
  sendMessage?: (context: ActionExecutionContext) => void | Promise<void>;
  openUrl?: (context: ActionExecutionContext) => void | Promise<void>;
  custom?: (context: ActionExecutionContext) => void | Promise<void>;
}

export interface InitializeEvent {
  mode: WidgetMode;
  isOpen: boolean;
  config: Readonly<Config>;
  welcomeMessage: Message;
  timestamp: number;
}

export interface MessageSentEvent {
  mode: WidgetMode;
  message: Message;
  timestamp: number;
}

export interface StreamUpdateEvent {
  messageId: string;
  chunk: string;
  accumulatedText: string;
  isFinal: boolean;
  timestamp: number;
}

export interface ToggleLayoutEvent {
  previousMode: WidgetMode;
  nextMode: WidgetMode;
  timestamp: number;
}

export interface OpenChangeEvent {
  isOpen: boolean;
  source: "api" | "toggle" | "header-close" | "teaser-open";
  timestamp: number;
}

export interface TeaserEvent {
  visible: boolean;
  reason: "timer" | "dismiss" | "open";
  timestamp: number;
}

export interface PresenceEvent {
  newMessages: readonly Message[];
  timestamp: number;
}

export interface ActionInvokedEvent {
  action: MessageAction;
  sourceMessage: Message;
  timestamp: number;
}

export interface LifecycleHooks {
  onInitialize?: (event: InitializeEvent) => void;
  onMessageSent?: (event: MessageSentEvent) => void;
  onStreamUpdate?: (event: StreamUpdateEvent) => void;
  onToggleLayout?: (event: ToggleLayoutEvent) => void;
  onOpenChange?: (event: OpenChangeEvent) => void;
  onTeaser?: (event: TeaserEvent) => void;
  onPresence?: (event: PresenceEvent) => void;
  onActionInvoked?: (event: ActionInvokedEvent) => void;
}

export interface WelcomeMessageContext {
  mode: WidgetMode;
  apiEndpoint: string;
  socketUrl: string;
}

export interface Config {
  mode: WidgetMode;
  apiEndpoint: string;
  socketUrl: string;
  title: string;
  position: WidgetPosition;
  inputPlaceholder: string;
  initiallyOpen: boolean;
  allowRuntimeModeSwitch: boolean;
  showRefreshButton: boolean;
  theme: Theme;
  teaser: TeaserConfig;
  storage: StorageConfig;
  presence: PresenceConfig;
  thinking: ThinkingConfig;
  i18n: I18nConfig;
  actionHandlers: ActionHandlers;
  lifecycle: LifecycleHooks;
  resolveWelcomeMessage?: (context: WelcomeMessageContext) => string;
  useShadowDom?: boolean;
}

export interface ConfigInput
  extends Partial<
    Omit<
      Config,
      | "theme"
      | "teaser"
      | "storage"
      | "presence"
      | "thinking"
      | "i18n"
      | "actionHandlers"
      | "lifecycle"
    >
  > {
  theme?: ThemeInput;
  teaser?: Partial<TeaserConfig>;
  storage?: Partial<StorageConfig>;
  presence?: Partial<PresenceConfig>;
  thinking?: Partial<ThinkingConfig>;
  i18n?: I18nConfigInput;
  actionHandlers?: Partial<ActionHandlers>;
  lifecycle?: Partial<LifecycleHooks>;
}

export interface TransportRequest {
  message: Message;
  history: readonly Message[];
  config: Readonly<Config>;
  conversationId: string | null;
}

export interface TransportCompleteMeta {
  actions?: MessageAction[];
  conversationId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface TransportStreamHandlers {
  onChunk: (chunk: string) => void;
  onComplete: (meta?: TransportCompleteMeta) => void;
  onError: (error: Error) => void;
}

export interface ChatTransport {
  sendMessage(
    request: TransportRequest,
    handlers: TransportStreamHandlers
  ): Promise<void>;
}

export interface PresenceRequest {
  conversationId: string;
  knownMessageCount: number;
}

export interface PresenceMessageInput {
  id?: string;
  role: MessageRole;
  text: string;
  createdAt?: number;
  actions?: MessageAction[];
  metadata?: Record<string, unknown>;
}

export interface PresenceResult {
  conversationId?: string | null;
  newMessages: PresenceMessageInput[];
}

export interface PresenceAdapter {
  poll(request: PresenceRequest): Promise<PresenceResult>;
}

export interface ConversationSnapshot {
  conversationId: string | null;
  mode: WidgetMode;
  isOpen: boolean;
  teaserDismissed: boolean;
  messages: Message[];
  updatedAt: number;
}

export interface ConversationStore {
  load(): ConversationSnapshot | null;
  save(snapshot: ConversationSnapshot): void;
  clear(): void;
}
