const CONFIG_KEYS = new Set([
    "mode",
    "apiEndpoint",
    "socketUrl",
    "title",
    "position",
    "inputPlaceholder",
    "initiallyOpen",
    "allowRuntimeModeSwitch",
    "showRefreshButton",
    "theme",
    "teaser",
    "storage",
    "presence",
    "thinking",
    "i18n",
    "actionHandlers",
    "lifecycle",
    "landscapePanel",
    "resolveWelcomeMessage",
    "useShadowDom"
]);
const THEME_KEYS = new Set(["name", "tokens", "fontFamilies"]);
const TOKEN_KEYS = new Set([
    "colorSurface",
    "colorPanel",
    "colorPrimary",
    "colorText",
    "colorMutedText",
    "colorBorder",
    "borderRadius",
    "spacing"
]);
const LIFECYCLE_KEYS = new Set([
    "onInitialize",
    "onMessageSent",
    "onStreamUpdate",
    "onToggleLayout",
    "onOpenChange",
    "onTeaser",
    "onPresence",
    "onActionInvoked",
    "onAssistantActionInvoked"
]);
const TEASER_KEYS = new Set(["enabled", "delayMs", "title", "text"]);
const STORAGE_KEYS = new Set([
    "enabled",
    "key",
    "maxMessages",
    "persistOpenState"
]);
const PRESENCE_KEYS = new Set([
    "enabled",
    "intervalMs",
    "pauseWhenHidden",
    "pollWhenClosed"
]);
const THINKING_KEYS = new Set(["messages", "intervalMs"]);
const ACTION_HANDLER_KEYS = new Set([
    "sendMessage",
    "openUrl",
    "custom",
    "assistantAction"
]);
const LANDSCAPE_PANEL_KEYS = new Set(["render", "bind"]);
const I18N_KEYS = new Set([
    "locale",
    "fallbackLocale",
    "customTranslations",
    "messages"
]);
const I18N_MESSAGE_KEYS = new Set([
    "layoutModeSelectorAriaLabel",
    "layoutModeNormalLabel",
    "layoutModeLandscapeLabel",
    "messageActionsAriaLabel",
    "assistantActionsAriaLabel",
    "assistantFeedbackUpAriaLabel",
    "assistantFeedbackDownAriaLabel",
    "assistantCopyAriaLabel",
    "assistantCopiedAriaLabel",
    "assistantSpeakAriaLabel",
    "assistantStopSpeakAriaLabel",
    "emptyMessageListText",
    "landscapeSidebarTitle",
    "landscapeSidebarLine1",
    "landscapeSidebarLine2",
    "teaserDismissAriaLabel",
    "openChatAriaLabel",
    "clearConversationTitle",
    "closeChatTitle",
    "inputAriaLabel",
    "sendMessageAriaLabel",
    "sendMessageLabel"
]);
const POSITION_VALUES = new Set([
    "bottom-right",
    "bottom-left",
    "bottom-center",
    "top-right",
    "top-left",
    "top-center",
    "middle-right",
    "middle-left"
]);
function assertRecord(value, path) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error(`${path} must be an object.`);
    }
}
function assertUnknownKeys(record, allowed, path) {
    for (const key of Object.keys(record)) {
        if (!allowed.has(key)) {
            throw new Error(`Unknown key \"${path}.${key}\".`);
        }
    }
}
function assertMode(value, path) {
    if (value !== "normal" && value !== "landscape") {
        throw new Error(`${path} must be either \"normal\" or \"landscape\".`);
    }
}
function assertPosition(value, path) {
    if (typeof value !== "string" || !POSITION_VALUES.has(value)) {
        throw new Error(`${path} must be a supported widget position.`);
    }
}
function assertString(value, path) {
    if (typeof value !== "string") {
        throw new Error(`${path} must be a string.`);
    }
}
function assertBoolean(value, path) {
    if (typeof value !== "boolean") {
        throw new Error(`${path} must be a boolean.`);
    }
}
function assertNumber(value, path) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(`${path} must be a finite number.`);
    }
}
function assertStringArray(value, path) {
    if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
        throw new Error(`${path} must be a string array.`);
    }
}
function validatePartialTokens(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, TOKEN_KEYS, path);
    for (const [key, tokenValue] of Object.entries(value)) {
        assertString(tokenValue, `${path}.${key}`);
    }
}
function validateTeaserInput(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, TEASER_KEYS, path);
    if ("enabled" in value) {
        assertBoolean(value.enabled, `${path}.enabled`);
    }
    if ("delayMs" in value) {
        assertNumber(value.delayMs, `${path}.delayMs`);
    }
    if ("title" in value) {
        assertString(value.title, `${path}.title`);
    }
    if ("text" in value) {
        assertString(value.text, `${path}.text`);
    }
}
function validateStorageInput(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, STORAGE_KEYS, path);
    if ("enabled" in value) {
        assertBoolean(value.enabled, `${path}.enabled`);
    }
    if ("key" in value) {
        assertString(value.key, `${path}.key`);
    }
    if ("maxMessages" in value) {
        assertNumber(value.maxMessages, `${path}.maxMessages`);
    }
    if ("persistOpenState" in value) {
        assertBoolean(value.persistOpenState, `${path}.persistOpenState`);
    }
}
function validatePresenceInput(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, PRESENCE_KEYS, path);
    if ("enabled" in value) {
        assertBoolean(value.enabled, `${path}.enabled`);
    }
    if ("intervalMs" in value) {
        assertNumber(value.intervalMs, `${path}.intervalMs`);
    }
    if ("pauseWhenHidden" in value) {
        assertBoolean(value.pauseWhenHidden, `${path}.pauseWhenHidden`);
    }
    if ("pollWhenClosed" in value) {
        assertBoolean(value.pollWhenClosed, `${path}.pollWhenClosed`);
    }
}
function validateThinkingInput(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, THINKING_KEYS, path);
    if ("messages" in value) {
        assertStringArray(value.messages, `${path}.messages`);
    }
    if ("intervalMs" in value) {
        assertNumber(value.intervalMs, `${path}.intervalMs`);
    }
}
function validateActionHandlersMap(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, ACTION_HANDLER_KEYS, path);
    for (const [key, handler] of Object.entries(value)) {
        if (handler !== undefined && typeof handler !== "function") {
            throw new Error(`${path}.${key} must be a function when provided.`);
        }
    }
}
function validateLandscapePanelInput(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, LANDSCAPE_PANEL_KEYS, path);
    if ("render" in value && value.render !== undefined && typeof value.render !== "function") {
        throw new Error(`${path}.render must be a function when provided.`);
    }
    if ("bind" in value && value.bind !== undefined && typeof value.bind !== "function") {
        throw new Error(`${path}.bind must be a function when provided.`);
    }
}
function validateI18nMessages(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, I18N_MESSAGE_KEYS, path);
    for (const [key, message] of Object.entries(value)) {
        assertString(message, `${path}.${key}`);
    }
}
function validateI18nInput(value, path) {
    assertRecord(value, path);
    assertUnknownKeys(value, I18N_KEYS, path);
    if ("locale" in value) {
        assertString(value.locale, `${path}.locale`);
    }
    if ("fallbackLocale" in value) {
        assertString(value.fallbackLocale, `${path}.fallbackLocale`);
    }
    if ("customTranslations" in value) {
        assertRecord(value.customTranslations, `${path}.customTranslations`);
        for (const [locale, messages] of Object.entries(value.customTranslations)) {
            if (!locale.trim()) {
                throw new Error(`${path}.customTranslations locale keys must not be empty.`);
            }
            validateI18nMessages(messages, `${path}.customTranslations.${locale}`);
        }
    }
    if ("messages" in value) {
        validateI18nMessages(value.messages, `${path}.messages`);
    }
}
export function validatePartialTheme(value, path = "theme") {
    assertRecord(value, path);
    assertUnknownKeys(value, THEME_KEYS, path);
    if ("name" in value) {
        assertString(value.name, `${path}.name`);
    }
    if ("fontFamilies" in value) {
        assertStringArray(value.fontFamilies, `${path}.fontFamilies`);
    }
    if ("tokens" in value) {
        validatePartialTokens(value.tokens, `${path}.tokens`);
    }
}
export function validateLifecycleMap(value, path = "lifecycle") {
    assertRecord(value, path);
    assertUnknownKeys(value, LIFECYCLE_KEYS, path);
    for (const [key, hook] of Object.entries(value)) {
        if (hook !== undefined && typeof hook !== "function") {
            throw new Error(`${path}.${key} must be a function when provided.`);
        }
    }
}
export function validateConfigInput(value, path = "config") {
    assertRecord(value, path);
    assertUnknownKeys(value, CONFIG_KEYS, path);
    if ("mode" in value) {
        assertMode(value.mode, `${path}.mode`);
    }
    if ("apiEndpoint" in value) {
        assertString(value.apiEndpoint, `${path}.apiEndpoint`);
    }
    if ("socketUrl" in value) {
        assertString(value.socketUrl, `${path}.socketUrl`);
    }
    if ("title" in value) {
        assertString(value.title, `${path}.title`);
    }
    if ("position" in value) {
        assertPosition(value.position, `${path}.position`);
    }
    if ("inputPlaceholder" in value) {
        assertString(value.inputPlaceholder, `${path}.inputPlaceholder`);
    }
    if ("initiallyOpen" in value) {
        assertBoolean(value.initiallyOpen, `${path}.initiallyOpen`);
    }
    if ("allowRuntimeModeSwitch" in value) {
        assertBoolean(value.allowRuntimeModeSwitch, `${path}.allowRuntimeModeSwitch`);
    }
    if ("showRefreshButton" in value) {
        assertBoolean(value.showRefreshButton, `${path}.showRefreshButton`);
    }
    if ("theme" in value) {
        validatePartialTheme(value.theme, `${path}.theme`);
    }
    if ("teaser" in value) {
        validateTeaserInput(value.teaser, `${path}.teaser`);
    }
    if ("storage" in value) {
        validateStorageInput(value.storage, `${path}.storage`);
    }
    if ("presence" in value) {
        validatePresenceInput(value.presence, `${path}.presence`);
    }
    if ("thinking" in value) {
        validateThinkingInput(value.thinking, `${path}.thinking`);
    }
    if ("i18n" in value) {
        validateI18nInput(value.i18n, `${path}.i18n`);
    }
    if ("actionHandlers" in value) {
        validateActionHandlersMap(value.actionHandlers, `${path}.actionHandlers`);
    }
    if ("lifecycle" in value) {
        validateLifecycleMap(value.lifecycle, `${path}.lifecycle`);
    }
    if ("landscapePanel" in value && value.landscapePanel !== undefined) {
        validateLandscapePanelInput(value.landscapePanel, `${path}.landscapePanel`);
    }
    if ("resolveWelcomeMessage" in value) {
        if (typeof value.resolveWelcomeMessage !== "function") {
            throw new Error(`${path}.resolveWelcomeMessage must be a function when provided.`);
        }
    }
    if ("useShadowDom" in value) {
        assertBoolean(value.useShadowDom, `${path}.useShadowDom`);
    }
}
export function validateResolvedConfig(config) {
    validateConfigInput(config, "resolvedConfig");
    if (!config.apiEndpoint.trim()) {
        throw new Error("resolvedConfig.apiEndpoint cannot be empty.");
    }
    if (!config.socketUrl.trim()) {
        throw new Error("resolvedConfig.socketUrl cannot be empty.");
    }
    if (!config.title.trim()) {
        throw new Error("resolvedConfig.title cannot be empty.");
    }
    if (!config.inputPlaceholder.trim()) {
        throw new Error("resolvedConfig.inputPlaceholder cannot be empty.");
    }
    if (!config.storage.key.trim()) {
        throw new Error("resolvedConfig.storage.key cannot be empty.");
    }
    if (!config.i18n.locale.trim()) {
        throw new Error("resolvedConfig.i18n.locale cannot be empty.");
    }
    if (!config.i18n.fallbackLocale.trim()) {
        throw new Error("resolvedConfig.i18n.fallbackLocale cannot be empty.");
    }
    if (!Number.isFinite(config.storage.maxMessages) || config.storage.maxMessages < 1) {
        throw new Error("resolvedConfig.storage.maxMessages must be >= 1.");
    }
    if (!Number.isFinite(config.presence.intervalMs) || config.presence.intervalMs < 1000) {
        throw new Error("resolvedConfig.presence.intervalMs must be >= 1000.");
    }
    if (!Number.isFinite(config.teaser.delayMs) || config.teaser.delayMs < 0) {
        throw new Error("resolvedConfig.teaser.delayMs must be >= 0.");
    }
    if (!Number.isFinite(config.thinking.intervalMs) || config.thinking.intervalMs < 200) {
        throw new Error("resolvedConfig.thinking.intervalMs must be >= 200.");
    }
    if (!Array.isArray(config.thinking.messages) || config.thinking.messages.length === 0) {
        throw new Error("resolvedConfig.thinking.messages must contain at least one entry.");
    }
    for (const message of config.thinking.messages) {
        if (typeof message !== "string" || !message.trim()) {
            throw new Error("resolvedConfig.thinking.messages entries must be non-empty strings.");
        }
    }
    for (const token of TOKEN_KEYS) {
        const tokenValue = config.theme.tokens[token];
        if (typeof tokenValue !== "string" || !tokenValue.trim()) {
            throw new Error(`resolvedConfig.theme.tokens.${token} must be a non-empty string.`);
        }
    }
}
//# sourceMappingURL=validateConfig.js.map