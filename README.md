# chatbot-core-saas

chatbot-core-saas is the tenant-neutral widget runtime for chatbot consumers.

It owns layout, rendering, state, transport contracts, persistence, lifecycle hooks, and extension points. It does not own any company branding, business prompt strategy, backend policy, or conversion semantics.

## Strict boundary

Core includes only generic runtime behavior.

- Included in core: shell/layout rendering, message lifecycle, action execution model, i18n resolution, storage and restore, presence orchestration, panel/render extension contracts.
- Not included in core: logos, brand tokens/copy, company prompt-pack taxonomy, company analytics schemas, company planner/dealer business logic.

If behavior is reusable across tenants, it belongs here. If behavior is business or brand specific, it belongs in the consumer package.

## Generic capabilities (current architecture)

- Entry/context model: configurable pre-chat entry fields with optional gating before send.
- Starter packs: reusable starter prompts with click events and custom handler support.
- Quick replies and action model: assistant actions via message actions (send_message/open_url/custom).
- Structured input cards: schema-driven input collection with submit handling and optional message templating.
- Landscape panel extension contract: render/bind/onError hooks with contract id/version metadata.
- HTTP non-stream adapter: wrap non-stream backends into streaming-compatible chunks.
- Session restore + migration: versioned storage snapshots with migrate callbacks and restore lifecycle event.
- Expanded lifecycle hooks: initialize, message/stream, open/teaser/presence, entry/starter/input-card, actions, restore.
- i18n copy overrides: locale/fallback/custom translations plus direct message overrides.
- Density/theme variants: density (compact/normal/spacious) and themeVariant (default/outlined/elevated).

## Quick usage patterns

### 1) Base widget + entry/starter/input card

```ts
import { ChatbotWidgetCore } from "chatbot-core-saas";

const widget = new ChatbotWidgetCore({
  apiEndpoint: "https://example.com/chat",
  socketUrl: "wss://example.com/chat",
  density: "compact",
  themeVariant: "outlined",
  entry: {
    enabled: true,
    requiredBeforeSend: true,
    title: "Before we start",
    description: "Share context.",
    submitLabel: "Continue",
    persistValues: true,
    fields: [
      {
        id: "audience",
        label: "Audience",
        type: "select",
        required: true,
        options: [
          { value: "consumer", label: "Consumer" },
          { value: "pro", label: "Professional" }
        ]
      }
    ]
  },
  starterPacks: {
    enabled: true,
    hideAfterInteraction: true,
    showBeforeFirstUserMessage: true,
    packs: [
      {
        id: "getting-started",
        title: "Try one",
        items: [
          { id: "a", label: "Compare products", message: "Help me compare products." },
          { id: "b", label: "Find support", message: "I need support options." }
        ]
      }
    ]
  },
  inputCard: {
    enabled: true,
    id: "structured",
    title: "Structured input",
    description: "",
    submitLabel: "Submit",
    submitBehavior: "none",
    resetOnSubmit: true,
    persistValues: true,
    fields: [{ id: "city", label: "City", type: "text", required: true }]
  }
});

widget.mount(document.getElementById("chat-root") as HTMLElement);
```

### 2) Non-stream HTTP adapter + restore migration + lifecycle + i18n

```ts
import {
  ChatbotWidgetCore,
  createNonStreamingTransportAdapter
} from "chatbot-core-saas";

const legacyTransport = createNonStreamingTransportAdapter(async (request) => {
  const response = await fetch("https://example.com/legacy-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: request.message.text, conversationId: request.conversationId })
  });
  const payload = await response.json();
  return { text: String(payload.text || "") };
});

const widget = new ChatbotWidgetCore(
  {
    apiEndpoint: "https://example.com/chat",
    socketUrl: "wss://example.com/chat",
    i18n: {
      locale: "de",
      fallbackLocale: "en",
      messages: { sendMessageLabel: "Senden" }
    },
    storage: {
      version: 3,
      migrate: (snapshot, context) => {
        if (context.fromVersion < 3) {
          return { ...snapshot, version: 3 };
        }
        return snapshot;
      }
    },
    lifecycle: {
      onSessionRestore: (event) => console.info("restore", event.status),
      onEntrySubmitted: (event) => console.info("entry", event.values),
      onInputCardSubmitted: (event) => console.info("card", event.values),
      onAssistantActionInvoked: (event) => console.info("assistant-action", event.action)
    }
  },
  { transport: legacyTransport }
);
```

### 3) Landscape panel extension contract

```ts
const widget = new ChatbotWidgetCore({
  apiEndpoint: "https://example.com/chat",
  socketUrl: "wss://example.com/chat",
  mode: "landscape",
  allowRuntimeModeSwitch: true,
  landscapePanel: {
    id: "my-panel",
    contractVersion: 1,
    render: ({ contract }) => `<div>Panel ${contract.extensionId} v${contract.contractVersion}</div>`,
    bind: ({ panelElement, widget }) => {
      panelElement.addEventListener("click", () => {
        void widget.sendMessage("Open planner context");
      });
      return () => {
        panelElement.replaceChildren();
      };
    }
  }
});
```

## Build and publish expectation

Consumers depend on built artifacts in dist.

- Run checks before publishing: npm run typecheck, npm run test, npm run build
- Commit and publish updated dist output whenever public APIs or runtime behavior change.
- Browser URL consumers currently resolve core from dist/index.js (for example GitHub Pages based hosting).

## Package exports

- ChatbotWidgetCore
- createHttpJsonTransport
- createNonStreamingTransportAdapter
- createLocalStorageConversationStore
- loadConfigFromScript
- renderMarkdown
- getBuiltinI18nMessages / resolveI18nConfig
- all public types from src/types.ts
