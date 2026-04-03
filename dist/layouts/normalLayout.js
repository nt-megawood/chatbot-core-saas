import { renderMessageList, renderModeToggle } from "./shared";
export function renderNormalLayout(messages, currentMode) {
    return `<section class="ccs-root ccs-layout-normal">
    <header class="ccs-header">
      <h2 class="ccs-title">Chatbot</h2>
      ${renderModeToggle(currentMode)}
    </header>
    <main class="ccs-messages" data-chat-messages>
      ${renderMessageList(messages)}
    </main>
    <form class="ccs-input-row" data-chat-form>
      <input class="ccs-input" data-chat-input type="text" placeholder="Type your message" autocomplete="off" />
      <button class="ccs-send" type="submit">Send</button>
    </form>
  </section>`;
}
//# sourceMappingURL=normalLayout.js.map