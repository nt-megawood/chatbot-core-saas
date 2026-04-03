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
    "actionHandlers",
    "lifecycle",
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
    "onActionInvoked"
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
const ACTION_HANDLER_KEYS = new Set(["sendMessage", "openUrl", "custom"]);
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
            throw new Error(`Unknown key "${path}.${key}".`);
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
    if ("actionHandlers" in value) {
        validateActionHandlersMap(value.actionHandlers, `${path}.actionHandlers`);
    }
    if ("lifecycle" in value) {
        validateLifecycleMap(value.lifecycle, `${path}.lifecycle`);
    }
    if ("resolveWelcomeMessage" in value) {
        if (typeof value.resolveWelcomeMessage !== "function") {
            throw new Error(`${path}.resolveWelcomeMessage must be a function when provided.`);
        }
    }
    if ("useShadowDom" in value && typeof value.useShadowDom !== "boolean") {
        throw new Error(`${path}.useShadowDom must be a boolean when provided.`);
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
    for (const token of TOKEN_KEYS) {
        const value = config.theme.tokens[token];
        if (typeof value !== "string" || !value.trim()) {
            throw new Error(`resolvedConfig.theme.tokens.${token} must be a non-empty string.`);
        }
    }
    if (config.title.trim().length === 0) {
        throw new Error("resolvedConfig.title cannot be empty.");
    }
    if (!POSITION_VALUES.has(config.position)) {
        throw new Error("resolvedConfig.position must be valid.");
    }
    if (!Array.isArray(config.thinking.messages) || config.thinking.messages.length === 0) {
        throw new Error("resolvedConfig.thinking.messages must contain at least one entry.");
    }
}
//# sourceMappingURL=validateConfig.js.map