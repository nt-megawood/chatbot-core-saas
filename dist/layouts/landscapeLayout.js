import { renderMessageList, renderModeToggle } from "./shared";
export function renderLandscapeLayout(messages, currentMode) {
    return `<section class="ccs-root ccs-layout-landscape">
    <header class="ccs-header">
      <h2 class="ccs-title">Chatbot</h2>
      ${renderModeToggle(currentMode)}
    </header>
    <div class="ccs-landscape-grid">
      <main class="ccs-messages" data-chat-messages>
        ${renderMessageList(messages)}
      </main>
      <aside class="ccs-side-panel">
        <p class="ccs-side-title">Layout: Landscape</p>
        <p class="ccs-side-copy">This panel demonstrates alternate layout rendering for wider containers.</p>
      </aside>
    </div>
    <form class="ccs-input-row" data-chat-form>
      <input class="ccs-input" data-chat-input type="text" placeholder="Type your message" autocomplete="off" />
      <button class="ccs-send" type="submit">Send</button>
    </form>
  </section>`;
}
//# sourceMappingURL=landscapeLayout.js.map