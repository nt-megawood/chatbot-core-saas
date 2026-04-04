import type { Config, Theme, WidgetMode } from "./types.js";
import { resolveI18nConfig } from "./i18n.js";

export const DEFAULT_WELCOME_MESSAGE = "Welcome. How can I help you today?";

export const DEFAULT_THINKING_MESSAGES = [
  "Thinking...",
  "Looking up the best answer...",
  "Still with you..."
];

export const CORE_DEFAULT_THEME: Theme = {
  name: "core-default",
  tokens: {
    colorSurface: "#ffffff",
    colorPanel: "#f7f8fb",
    colorPrimary: "#1c63d5",
    colorText: "#162033",
    colorMutedText: "#566176",
    colorBorder: "#d8dfec",
    borderRadius: "16px",
    spacing: "12px"
  },
  fontFamilies: ["'Segoe UI'", "Tahoma", "Geneva", "Verdana", "sans-serif"]
};

export const CORE_DEFAULT_CONFIG: Config = {
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

export const MODE_DEFAULTS: Record<
  WidgetMode,
  Pick<Config, "mode" | "theme" | "lifecycle" | "title" | "position">
> = {
  normal: {
    mode: "normal",
    title: "Assistant",
    position: "bottom-right",
    theme: {
      name: "normal-default",
      tokens: {
        colorSurface: "#ffffff",
        colorPanel: "#f7f8fb",
        colorPrimary: "#1c63d5",
        colorText: "#162033",
        colorMutedText: "#566176",
        colorBorder: "#d8dfec",
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
        colorPanel: "#f1f5fc",
        colorPrimary: "#0d5ac7",
        colorText: "#132038",
        colorMutedText: "#48566f",
        colorBorder: "#c7d2e6",
        borderRadius: "14px",
        spacing: "12px"
      },
      fontFamilies: ["'Segoe UI'", "Tahoma", "Geneva", "Verdana", "sans-serif"]
    },
    lifecycle: {}
  }
};
