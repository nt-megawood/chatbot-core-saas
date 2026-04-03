const CONFIG_KEYS = new Set([
    "mode",
    "apiEndpoint",
    "socketUrl",
    "theme",
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
    "onToggleLayout"
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
function assertString(value, path) {
    if (typeof value !== "string") {
        throw new Error(`${path} must be a string.`);
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
    if ("theme" in value) {
        validatePartialTheme(value.theme, `${path}.theme`);
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
}
//# sourceMappingURL=validateConfig.js.map