# chatbot-core-saas

chatbot-core-saas is the company-agnostic runtime for the chatbot product line.

It owns stable widget UX and runtime behavior: shell rendering, message lifecycle, layout handling, i18n, actions, and extension contracts. Company-specific behavior stays outside this package.

## Product Positioning

| Layer | Owns | Does not own |
| --- | --- | --- |
| chatbot-core-saas | Widget shell, normal/landscape layouts, teaser timing, message rendering, action execution model, assistant toolbar interactions, storage abstraction, presence polling orchestration, i18n resolution, lifecycle event model, script config parsing | Company branding system, business prompt packs, backend auth policy, company analytics schemas, company conversion flows |
| chatbot-company-impl | Endpoints and auth resolution, company theme defaults, company prompt/context routing, company analytics wiring, company custom actions, company landscape panel behavior | Re-implementing shell/layout runtime internals that already exist in core |

## Core Elements Parity Map

This map tracks mw-widget core elements and their SaaS-runtime location.

| mw-widget element | Where it lives in chatbot-core-saas | Status | What remains company-specific |
| --- | --- | --- | --- |
| Floating shell, open toggle, close control, teaser open/dismiss flow | src/layouts/shared.ts, src/ChatbotWidgetCore.ts | implemented | Teaser copy, brand iconography, teaser campaign rules |
| Classic and landscape geometry (400x640, 860x540) and position classes | src/styles.ts | implemented | Brand colors, fonts, image assets |
| Shared transcript across mode switching | src/ChatbotWidgetCore.ts (setMode, snapshot hydrate/persist) | extended | Which experiences expose mode switching |
| Message send/stream/complete lifecycle | src/ChatbotWidgetCore.ts (sendMessage), src/types.ts (transport contracts) | implemented | Backend endpoint choice, request/response mapping, auth headers |
| Markdown rendering in assistant bubbles | src/utils/markdown.ts, src/layouts/shared.ts | implemented | Company content policy for markdown payloads |
| Message action buttons (send_message, open_url, custom) | src/layouts/shared.ts, src/ChatbotWidgetCore.ts (handleAction), src/types.ts | implemented | Business-specific custom action semantics |
| Assistant toolbar (feedback up/down, copy, speak) | src/layouts/shared.ts, src/ChatbotWidgetCore.ts (handleAssistantAction), src/types.ts | extended | Analytics and downstream handling of assistant-action events |
| Conversation persistence and hydration | src/storage/localStorageConversationStore.ts, src/ChatbotWidgetCore.ts | implemented | Storage key strategy and retention policy |
| Presence polling orchestration | src/ChatbotWidgetCore.ts, src/types.ts (PresenceAdapter) | implemented | Presence backend implementation and payload semantics |
| Built-in i18n and locale overrides | src/i18n.ts, src/types.ts (I18nConfigInput) | implemented | Locale strategy and branded copy |
| Landscape side-panel extension point | src/types.ts (LandscapePanelConfig), src/ChatbotWidgetCore.ts (render/bind contract) | extended | Planner/business workflows rendered in panel |
| Lifecycle telemetry hooks | src/types.ts (LifecycleHooks), src/ChatbotWidgetCore.ts | implemented | Event names, data-layer schema, conversion attribution |

## Styling Parity Policy

Geometry and interaction parity are preserved in core. Branding is externalized.

- Core keeps canonical layout dimensions, spacing rhythm, control placement, and interaction affordances aligned to parity tests.
- Core default tokens are intentionally neutral and non-company branded.
- Company implementation applies brand via theme tokens, font families, translations, and extension content.
- Any change that alters shell geometry or core interaction behavior requires parity validation before release.

## Install

```bash
npm install chatbot-core-saas
```

```ts
import { ChatbotWidgetCore } from "chatbot-core-saas";

const widget = new ChatbotWidgetCore({
  mode: "normal",
  apiEndpoint: "https://example.com/api/chat",
  socketUrl: "wss://example.com/chat",
  title: "Assistant"
});

widget.mount(document.getElementById("chat-root") as HTMLElement);
```

## Browser And CDN Usage

### ESM import (self-hosted or CDN)

```html
<script type="module">
  import { ChatbotWidgetCore } from "https://your-cdn.example/chatbot-core-saas/index.js";

  const widget = new ChatbotWidgetCore({
    mode: "normal",
    apiEndpoint: "https://example.com/api/chat",
    socketUrl: "wss://example.com/chat"
  });

  widget.mount(document.getElementById("chat-root"));
</script>
```

### GitHub Pages import URL format

This repository deploys the dist artifact as the Pages site root, so the module entry is:

```text
https://<owner>.github.io/<repo>/index.js
```

Repository example:

```text
https://nt-megawood.github.io/chatbot-core-saas/index.js
```

### Script-first config loading

Use ChatbotWidgetCore.fromScript(scriptElement) when config is carried by data attributes and optional JSON.

```html
<div id="chat-root"></div>

<script
  id="chatbot-core-config"
  data-api-endpoint="https://example.com/api/chat"
  data-socket-url="wss://example.com/chat"
  data-mode="normal"
  data-title="Assistant"
  data-position="bottom-right"
  data-chatbot-config='{"teaser":{"enabled":true,"delayMs":8000}}'
></script>

<script type="module">
  import { ChatbotWidgetCore } from "https://nt-megawood.github.io/chatbot-core-saas/index.js";

  const script = document.getElementById("chatbot-core-config");
  const widget = ChatbotWidgetCore.fromScript(script);
  widget.mount(document.getElementById("chat-root"));
</script>
```

Script config precedence (lowest to highest):

1. window.CHATBOT_CORE_CONFIG
2. data-chatbot-config JSON payload
3. explicit data attributes on the script element

Supported direct data attributes:

- data-mode
- data-api-endpoint
- data-socket-url
- data-use-shadow-dom
- data-title
- data-position
- data-input-placeholder
- data-initially-open
- data-allow-runtime-mode-switch
- data-show-refresh-button
- data-locale
- data-fallback-locale
- data-teaser-enabled
- data-teaser-delay-ms
- data-teaser-title
- data-teaser-text

## Configuration Reference

All top-level ConfigInput fields are listed below.

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| mode | "normal" or "landscape" | "normal" | Initial layout mode |
| apiEndpoint | string | required non-empty | Validated at construction |
| socketUrl | string | required non-empty | Validated at construction |
| title | string | "Assistant" | Header title |
| position | WidgetPosition | "bottom-right" | Floating anchor |
| inputPlaceholder | string | "Type your message..." | Footer textarea placeholder |
| initiallyOpen | boolean | false | Initial open state |
| allowRuntimeModeSwitch | boolean | false | Enables normal/landscape switch UI and API setMode behavior |
| showRefreshButton | boolean | true | Shows clear-conversation button |
| theme | ThemeInput | core neutral defaults | Brand/token override surface |
| teaser | Partial<TeaserConfig> | enabled + 10000ms delay | Teaser timing and copy |
| storage | Partial<StorageConfig> | enabled + localStorage key | Conversation persistence behavior |
| presence | Partial<PresenceConfig> | disabled + 60000ms | Presence polling orchestration |
| thinking | Partial<ThinkingConfig> | 3 default messages + 2000ms | Pending-response indicator text rotation |
| i18n | I18nConfigInput | locale en, fallback en | Built-in + custom translation merge |
| actionHandlers | Partial<ActionHandlers> | {} | Override send_message/open_url/custom/assistant toolbar handling |
| lifecycle | Partial<LifecycleHooks> | {} | Runtime callbacks for host instrumentation |
| landscapePanel | LandscapePanelConfig | undefined | Landscape-only extension panel contract |
| resolveWelcomeMessage | (context) => string | default welcome text | Dynamic welcome message resolver |
| useShadowDom | boolean | true | Shadow DOM first, scoped-CSS fallback otherwise |

### Nested option objects

ThemeInput:

| Field | Type |
| --- | --- |
| name | string |
| fontFamilies | string[] |
| tokens.colorSurface | string |
| tokens.colorPanel | string |
| tokens.colorPrimary | string |
| tokens.colorText | string |
| tokens.colorMutedText | string |
| tokens.colorBorder | string |
| tokens.borderRadius | string |
| tokens.spacing | string |

TeaserConfig:

| Field | Type |
| --- | --- |
| enabled | boolean |
| delayMs | number |
| title | string |
| text | string |

StorageConfig:

| Field | Type |
| --- | --- |
| enabled | boolean |
| key | string |
| maxMessages | number |
| persistOpenState | boolean |

PresenceConfig:

| Field | Type |
| --- | --- |
| enabled | boolean |
| intervalMs | number |
| pauseWhenHidden | boolean |
| pollWhenClosed | boolean |

ThinkingConfig:

| Field | Type |
| --- | --- |
| messages | string[] |
| intervalMs | number |

I18nConfigInput:

| Field | Type |
| --- | --- |
| locale | string |
| fallbackLocale | string |
| customTranslations | Record<string, Partial<I18nMessages>> |

ActionHandlers:

| Handler | Trigger |
| --- | --- |
| sendMessage(context) | Message action type send_message |
| openUrl(context) | Message action type open_url |
| custom(context) | Message action type custom |
| assistantAction(context) | Assistant toolbar action: feedback_up, feedback_down, copy, speak |

LifecycleHooks:

| Hook | Trigger |
| --- | --- |
| onInitialize | After first successful mount render |
| onMessageSent | User message accepted and queued |
| onStreamUpdate | Stream chunk and final completion |
| onToggleLayout | Mode transition (normal <-> landscape) |
| onOpenChange | Open/close state transitions |
| onTeaser | Teaser shown, dismissed, or hidden by open |
| onPresence | Presence adapter appended messages |
| onActionInvoked | Message action execution |
| onAssistantActionInvoked | Assistant toolbar action execution |

LandscapePanelConfig:

| Field | Type |
| --- | --- |
| render(context) | (LandscapePanelRenderContext) => string |
| bind(context) | (LandscapePanelBindContext) => void or cleanup function |

Validation constraints enforced by core:

- storage.maxMessages >= 1
- presence.intervalMs >= 1000
- teaser.delayMs >= 0
- thinking.intervalMs >= 200
- thinking.messages must contain at least one non-empty string

## i18n

Built-in locales:

- en
- de

Locale resolution behavior:

1. Resolve locale and fallbackLocale (normalized to lowercase)
2. Start from built-in fallback messages
3. Apply built-in locale messages
4. Apply custom fallback locale overrides
5. Apply custom active locale overrides

Supported I18nMessages keys:

- layoutModeSelectorAriaLabel
- layoutModeNormalLabel
- layoutModeLandscapeLabel
- messageActionsAriaLabel
- assistantActionsAriaLabel
- assistantFeedbackUpAriaLabel
- assistantFeedbackDownAriaLabel
- assistantCopyAriaLabel
- assistantCopiedAriaLabel
- assistantSpeakAriaLabel
- assistantStopSpeakAriaLabel
- emptyMessageListText
- landscapeSidebarTitle
- landscapeSidebarLine1
- landscapeSidebarLine2
- teaserDismissAriaLabel
- openChatAriaLabel
- clearConversationTitle
- closeChatTitle
- inputAriaLabel
- sendMessageAriaLabel
- sendMessageLabel

Custom locale extension example:

```ts
import { ChatbotWidgetCore } from "chatbot-core-saas";

const widget = new ChatbotWidgetCore({
  mode: "normal",
  apiEndpoint: "https://example.com/api/chat",
  socketUrl: "wss://example.com/chat",
  i18n: {
    locale: "fr",
    fallbackLocale: "en",
    customTranslations: {
      fr: {
        openChatAriaLabel: "Ouvrir le chat",
        sendMessageAriaLabel: "Envoyer un message",
        sendMessageLabel: "Envoyer"
      }
    }
  }
});
```

The package also exports getBuiltinI18nMessages and resolveI18nConfig for host-side tooling.

## Message Actions And Toolbar Hooks

Message actions are attached to assistant messages via the MessageAction[] payload.

Action types:

- send_message
- open_url
- custom

Default behavior:

- send_message: sends action.message via widget.sendMessage when present
- open_url: opens action.url in a new tab with noopener,noreferrer
- custom: no-op unless actionHandlers.custom is provided

Assistant toolbar actions are built in for assistant messages:

- feedback_up
- feedback_down
- copy
- speak

Integration points:

- actionHandlers.assistantAction for custom handling
- lifecycle.onAssistantActionInvoked for telemetry

## Landscape Extension Panel Contract

Landscape mode supports an extension panel using landscapePanel.render and landscapePanel.bind.

```ts
import type { LandscapePanelConfig } from "chatbot-core-saas";

const landscapePanel: LandscapePanelConfig = {
  render: ({ conversationId, labels }) => {
    return `<h3>${labels.landscapeSidebarTitle}</h3><p>Conversation: ${conversationId ?? "new"}</p>`;
  },
  bind: ({ panelElement, widget }) => {
    const button = panelElement.querySelector("button[data-send]");
    button?.addEventListener("click", () => {
      void widget.sendMessage("Continue in planner mode");
    });

    return () => {
      button?.replaceWith(button.cloneNode(true));
    };
  }
};
```

Contract notes:

- render is called for landscape mode only
- bind runs after each render when panel exists
- bind may return a cleanup function
- cleanup is called before rebind, on mode changes that remove panel, and on unmount
- if no custom render output is returned, the built-in default landscape sidebar copy is shown

## Runtime API

Public instance methods:

- mount(host)
- unmount()
- open(source?)
- close(source?)
- toggle()
- setMode(nextMode)
- sendMessage(text)
- clearConversation()
- dismissTeaser()
- isWidgetOpen()
- getMode()
- getMessages()
- getConversationId()
- getConfig()

Constructor integration options (second argument):

- transport
- presenceAdapter
- conversationStore
- implementationThemeDefaults
- idFactory
- now

## Migration Guide From mw-widget

### 1) Keep runtime mechanics in core

Move shared behavior from per-variant React hooks/components into ChatbotWidgetCore configuration and typed contracts.

### 2) Keep company logic in chatbot-company-impl

Keep endpoint routing, auth tokens, planner/dealer custom actions, prompt packs, and analytics in chatbot-company-impl.

### 3) Use extension points instead of forks

- transport for backend protocol
- actionHandlers for message and toolbar behavior
- lifecycle for analytics and telemetry
- landscapePanel for planner/sidebar workflows
- theme and i18n overrides for brand and locale

### 4) Validate parity before rollout

Run:

```bash
npm run typecheck
npm run build
npm run test
```

## Security And Privacy Boundaries

- Core does not ship backend credentials, auth policy, or company secrets.
- Core validates config shape and rejects unknown keys.
- Core uses localStorage only when storage.enabled is true.
- Conversation payloads flow through provided transport and presence adapters.
- open_url actions can open external URLs; sanitize and govern outbound links in your implementation layer.
- Assistant copy/speak features rely on browser Clipboard and SpeechSynthesis APIs.
- Analytics is opt-in through lifecycle hooks and host-level integrations.

## Release Acceptance Checklist

- [ ] README positioning is explicit: core runtime vs company implementation boundaries
- [ ] Core Elements Parity Map is present and updated
- [ ] Styling parity policy is present and states geometry/UX parity with externalized branding
- [ ] Install and browser/CDN usage includes GitHub Pages URL format
- [ ] Configuration reference covers all ConfigInput options and nested objects
- [ ] i18n section documents built-in locales and custom locale extension
- [ ] Message actions and assistant toolbar hooks are documented
- [ ] Landscape extension panel contract is documented
- [ ] Migration guidance from mw-widget is documented
- [ ] Security and privacy boundaries are documented
- [ ] Typecheck, build, and test pass before release
