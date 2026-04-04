# chatbot-core-saas

`chatbot-core-saas` is the reusable, company-agnostic runtime for the chatbot widget.

It provides the widget shell, conversation lifecycle, layout handling, message rendering, storage, presence polling, teaser/open-close behavior, and a generic action system. Company-specific branding, endpoints, prompt copy, and business rules belong in `chatbot-company-impl`.

## What this package gives you

- Open/close widget shell with teaser support.
- Normal and landscape layouts.
- Runtime layout switching when enabled.
- Conversation storage and restore.
- Presence polling hooks.
- Message actions, markdown rendering, and thinking state.
- Lifecycle hooks for app-level instrumentation.
- Shadow DOM isolation with a scoped CSS fallback.
- Script-tag config loading for browser embeds.

## Install

```bash
npm install chatbot-core-saas
```

Or use the package locally during development:

```ts
import { ChatbotWidgetCore } from "chatbot-core-saas";
```

## Quick Start

```ts
import { ChatbotWidgetCore } from "chatbot-core-saas";

const widget = new ChatbotWidgetCore({
  mode: "normal",
  apiEndpoint: "https://example.com/api/chat",
  socketUrl: "wss://example.com/socket",
  title: "Support",
  position: "bottom-right"
});

widget.mount(document.getElementById("chat-root") as HTMLElement);
```

## Browser / GitHub Pages Usage

If you publish the built `dist/` folder to GitHub Pages, the entrypoint is served from the site root:

```html
<script type="module" src="https://nt-megawood.github.io/chatbot-core-saas/index.js"></script>
```

Then import the core directly in your page:

```html
<script type="module">
  import { ChatbotWidgetCore } from "https://nt-megawood.github.io/chatbot-core-saas/index.js";

  const widget = new ChatbotWidgetCore({
    mode: "normal",
    apiEndpoint: "https://example.com/api/chat",
    socketUrl: "wss://example.com/socket"
  });

  widget.mount(document.getElementById("chat-root"));
</script>
```

## Full Widget Configuration

`ChatbotWidgetCore` accepts a single config object. Every option below is supported.

### Top-level options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `"normal" | "landscape"` | `"normal"` | Base layout mode.
| `apiEndpoint` | `string` | required | Backend chat endpoint.
| `socketUrl` | `string` | required | Backend socket/stream URL.
| `title` | `string` | `"Assistant"` | Header title shown in the shell.
| `position` | `WidgetPosition` | `"bottom-right"` | Floating widget anchor.
| `inputPlaceholder` | `string` | `"Type your message..."` | Placeholder text in the message box.
| `initiallyOpen` | `boolean` | `false` | Starts the widget open.
| `allowRuntimeModeSwitch` | `boolean` | `false` | Shows the Normal/Landscape mode controls and enables runtime switching.
| `showRefreshButton` | `boolean` | `true` | Shows the clear-conversation button.
| `theme` | `ThemeInput` | core theme | Theme tokens and font families.
| `teaser` | `TeaserConfig` | core teaser | Teaser banner content and timing.
| `storage` | `StorageConfig` | core storage | Local conversation persistence.
| `presence` | `PresenceConfig` | core presence | Presence polling configuration.
| `thinking` | `ThinkingConfig` | core thinking | Thinking text rotation and interval.
| `i18n` | `I18nConfigInput` | core i18n | Locale and custom translation overrides for shell labels.
| `actionHandlers` | `ActionHandlers` | `{}` | Custom action handlers for assistant actions.
| `lifecycle` | `LifecycleHooks` | `{}` | Widget lifecycle callbacks.
| `resolveWelcomeMessage` | `(context) => string` | fallback welcome text | Override the welcome message.
| `useShadowDom` | `boolean` | `true` | Enables Shadow DOM when available.

### Theme options

```ts
theme: {
  name: "demo",
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
}
```

Theme tokens:

- `colorSurface`
- `colorPanel`
- `colorPrimary`
- `colorText`
- `colorMutedText`
- `colorBorder`
- `borderRadius`
- `spacing`

### Teaser options

```ts
teaser: {
  enabled: true,
  delayMs: 10000,
  title: "Need a hand?",
  text: "Ask a question and get an instant answer."
}
```

### Storage options

```ts
storage: {
  enabled: true,
  key: "chatbot-core-saas:conversation",
  maxMessages: 80,
  persistOpenState: true
}
```

### Presence options

```ts
presence: {
  enabled: false,
  intervalMs: 60000,
  pauseWhenHidden: true,
  pollWhenClosed: false
}
```

### Thinking options

```ts
thinking: {
  messages: ["Thinking...", "Looking up the best answer...", "Still with you..."],
  intervalMs: 2000
}
```

### i18n options

Built-in locales: `en`, `de`.

```ts
i18n: {
  locale: "de",
  fallbackLocale: "en",
  customTranslations: {
    de: {
      openChatAriaLabel: "Chat oeffnen",
      closeChatTitle: "Chat schliessen",
      clearConversationTitle: "Gespraech neu starten",
      inputAriaLabel: "Nachricht eingeben",
      sendMessageAriaLabel: "Senden",
      sendMessageLabel: "Senden"
    },
    fr: {
      sendMessageLabel: "Envoyer"
    }
  }
}
```

Available translation keys:

- `layoutModeSelectorAriaLabel`
- `layoutModeNormalLabel`
- `layoutModeLandscapeLabel`
- `messageActionsAriaLabel`
- `emptyMessageListText`
- `landscapeSidebarTitle`
- `landscapeSidebarLine1`
- `landscapeSidebarLine2`
- `teaserDismissAriaLabel`
- `openChatAriaLabel`
- `clearConversationTitle`
- `closeChatTitle`
- `inputAriaLabel`
- `sendMessageAriaLabel`
- `sendMessageLabel`

### Action handlers

Use action handlers to intercept assistant actions:

```ts
actionHandlers: {
  sendMessage: async ({ action, widget }) => {
    await widget.sendMessage(action.message ?? "");
  },
  openUrl: ({ action }) => {
    window.open(action.url ?? "", "_blank", "noopener,noreferrer");
  },
  custom: ({ action }) => {
    console.log("Custom action", action);
  }
}
```

Supported action types:

- `send_message`
- `open_url`
- `custom`

### Lifecycle hooks

```ts
lifecycle: {
  onInitialize: (event) => {},
  onMessageSent: (event) => {},
  onStreamUpdate: (event) => {},
  onToggleLayout: (event) => {},
  onOpenChange: (event) => {},
  onTeaser: (event) => {},
  onPresence: (event) => {},
  onActionInvoked: (event) => {}
}
```

Hook summaries:

- `onInitialize` fires after mount.
- `onMessageSent` fires when the user sends a message.
- `onStreamUpdate` fires for streaming chunks and final completion.
- `onToggleLayout` fires when normal/landscape mode changes.
- `onOpenChange` fires on open/close.
- `onTeaser` fires when teaser visibility changes.
- `onPresence` fires when presence polling appends messages.
- `onActionInvoked` fires when an assistant action is triggered.

### Welcome message override

```ts
resolveWelcomeMessage: ({ mode, apiEndpoint, socketUrl }) => {
  return mode === "landscape"
    ? "Welcome to the wide chat layout"
    : "Welcome back";
}
```

## Runtime API

`ChatbotWidgetCore` exposes these instance methods:

- `mount(hostElement)`
- `unmount()`
- `open(source?)`
- `close(source?)`
- `toggle()`
- `setMode(nextMode)`
- `sendMessage(text)`
- `clearConversation()`
- `dismissTeaser()`
- `isWidgetOpen()`
- `getMode()`
- `getMessages()`
- `getConversationId()`
- `getConfig()`

## Script Tag Embedding

You can also load config from a script element:

```html
<script
  src="https://nt-megawood.github.io/chatbot-core-saas/index.js"
  type="module"
  data-chatbot-config='{
    "mode": "normal",
    "apiEndpoint": "https://example.com/api/chat",
    "socketUrl": "wss://example.com/socket",
    "title": "Support",
    "position": "bottom-right"
  }'
></script>
```

Or initialize from a script element via `ChatbotWidgetCore.fromScript(scriptElement)`.

## Constructor Options

The second argument to `new ChatbotWidgetCore(config, options)` is for runtime integration wiring, not customer-facing widget config.

| Option | Type | Description |
| --- | --- | --- |
| `transport` | `ChatTransport` | Custom transport implementation.
| `presenceAdapter` | `PresenceAdapter` | Custom presence polling adapter.
| `conversationStore` | `ConversationStore` | Custom storage adapter.
| `implementationThemeDefaults` | `ThemeInput` | Company-specific base theme overrides.
| `idFactory` | `() => string` | Message ID generator.
| `now` | `() => number` | Clock override for tests.

## Notes on SaaS Architecture

- Keep company branding, API keys, prompt copy, and custom analytics in `chatbot-company-impl`.
- Keep reusable runtime behavior, shell/layout, and generic widget UX in `chatbot-core-saas`.
- Use `implementationThemeDefaults` to inject a customer theme without modifying the core package.

## Development

Install dependencies:

```bash
npm install
```

Run checks:

```bash
npm run typecheck
npm run build
npm run test
```

## GitHub Pages Deployment

This package builds to an ES module entry at `dist/index.js`. When GitHub Pages publishes the `dist/` folder, its contents are served from the site root.

Recommended Pages import:

```html
<script type="module" src="https://<user>.github.io/<repo>/index.js"></script>
```

If you deploy via GitHub Actions, configure Pages to use the action-based source, then build and publish the `dist/` folder.
