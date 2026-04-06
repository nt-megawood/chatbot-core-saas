# Quickstart

## Browser integration

```html
<div id="chat-root"></div>

<script type="module">
  import { ChatbotWidgetCore } from "https://nt-megawood.github.io/chatbot-core-saas/dist/index.js";

  const widget = new ChatbotWidgetCore({
    apiEndpoint: "https://example.com/chat",
    socketUrl: "wss://example.com/chat"
  });

  widget.mount(document.getElementById("chat-root"));
</script>
```

## Minimal configuration

Required:

- apiEndpoint
- socketUrl

Recommended:

- mode
- position
- title
- i18n
- lifecycle

## Next steps

- Configure entry gating and starter packs
- Add structured input cards
- Add custom transport adapter if backend is non-stream
- Hook lifecycle events into analytics