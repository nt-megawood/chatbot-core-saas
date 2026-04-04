import { resolveI18nConfig } from "./i18n.js";
export const DEFAULT_WELCOME_MESSAGE = "Welcome. How can I help you today?";
export const DEFAULT_THINKING_MESSAGES = [
    "Thinking...",
    "Looking up the best answer...",
    "Still with you..."
];
export const CORE_DEFAULT_THEME = {
    name: "core-default",
    tokens: {
        colorSurface: "#ffffff",
        colorPanel: "#fafafa",
        colorPrimary: "#4b5563",
        colorText: "#333333",
        colorMutedText: "#666666",
        colorBorder: "#dddddd",
        borderRadius: "16px",
        spacing: "12px"
    },
    fontFamilies: ["'Segoe UI'", "Tahoma", "Geneva", "Verdana", "sans-serif"]
};
export const CORE_DEFAULT_CONFIG = {
    mode: "normal",
    apiEndpoint: "",
    socketUrl: "",
    title: "Assistant",
    position: "bottom-right",
    inputPlaceholder: "Type your message...",
    initiallyOpen: false,
    allowRuntimeModeSwitch: false,
    showRefreshButton: true,
    theme: CORE_DEFAULT_THEME,
    teaser: {
        enabled: true,
        delayMs: 10_000,
        title: "Need a hand?",
        text: "Ask a question and get an instant answer."
    },
    storage: {
        enabled: true,
        key: "chatbot-core-saas:conversation",
        maxMessages: 80,
        persistOpenState: true
    },
    presence: {
        enabled: false,
        intervalMs: 60_000,
        pauseWhenHidden: true,
        pollWhenClosed: false
    },
    thinking: {
        messages: DEFAULT_THINKING_MESSAGES,
        intervalMs: 2_000
    },
    i18n: resolveI18nConfig(undefined),
    actionHandlers: {},
    lifecycle: {},
    useShadowDom: true
};
export const MODE_DEFAULTS = {
    normal: {
        mode: "normal",
        title: "Assistant",
        position: "bottom-right",
        theme: {
            name: "normal-default",
            tokens: {
                colorSurface: "#ffffff",
                colorPanel: "#fafafa",
                colorPrimary: "#4b5563",
                colorText: "#333333",
                colorMutedText: "#666666",
                colorBorder: "#dddddd",
                borderRadius: "16px",
                spacing: "12px"
            },
            fontFamilies: ["'Segoe UI'", "Tahoma", "Geneva", "Verdana", "sans-serif"]
        },
        lifecycle: {}
    },
    landscape: {
        mode: "landscape",
        title: "Assistant",
        position: "bottom-right",
        theme: {
            name: "landscape-default",
            tokens: {
                colorSurface: "#ffffff",
                colorPanel: "#f5f5f5",
                colorPrimary: "#4b5563",
                colorText: "#333333",
                colorMutedText: "#666666",
                colorBorder: "#dddddd",
                borderRadius: "14px",
                spacing: "12px"
            },
            fontFamilies: ["'Segoe UI'", "Tahoma", "Geneva", "Verdana", "sans-serif"]
        },
        lifecycle: {}
    }
};
//# sourceMappingURL=defaults.js.map