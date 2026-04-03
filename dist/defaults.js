export const DEFAULT_WELCOME_MESSAGE = "Welcome. How can I help you today?";
export const CORE_DEFAULT_THEME = {
    name: "core-default",
    tokens: {
        colorSurface: "#ffffff",
        colorPanel: "#f6f8fb",
        colorPrimary: "#1f6feb",
        colorText: "#101828",
        colorMutedText: "#475467",
        colorBorder: "#d0d5dd",
        borderRadius: "12px",
        spacing: "12px"
    },
    fontFamilies: ["system-ui", "Segoe UI", "sans-serif"]
};
export const CORE_DEFAULT_CONFIG = {
    mode: "normal",
    apiEndpoint: "",
    socketUrl: "",
    theme: CORE_DEFAULT_THEME,
    lifecycle: {},
    useShadowDom: true
};
export const MODE_DEFAULTS = {
    normal: {
        mode: "normal",
        theme: {
            name: "normal-default",
            tokens: {
                colorSurface: "#ffffff",
                colorPanel: "#f6f8fb",
                colorPrimary: "#1f6feb",
                colorText: "#101828",
                colorMutedText: "#475467",
                colorBorder: "#d0d5dd",
                borderRadius: "12px",
                spacing: "12px"
            },
            fontFamilies: ["system-ui", "Segoe UI", "sans-serif"]
        },
        lifecycle: {}
    },
    landscape: {
        mode: "landscape",
        theme: {
            name: "landscape-default",
            tokens: {
                colorSurface: "#ffffff",
                colorPanel: "#eef4ff",
                colorPrimary: "#1252c7",
                colorText: "#0f172a",
                colorMutedText: "#334155",
                colorBorder: "#cbd5e1",
                borderRadius: "14px",
                spacing: "14px"
            },
            fontFamilies: ["system-ui", "Segoe UI", "sans-serif"]
        },
        lifecycle: {}
    }
};
//# sourceMappingURL=defaults.js.map