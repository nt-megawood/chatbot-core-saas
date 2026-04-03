import { renderMarkdown } from "../utils/markdown.js";
function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
function formatTimestamp(createdAt) {
    return new Date(createdAt).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit"
    });
}
function renderModeToggle(currentMode) {
    return `<div class="ccs-mode-toggle" aria-label="Layout mode selector">
    <button type="button" class="ccs-mode-button" data-set-mode="normal" aria-pressed="${currentMode === "normal"}">Normal</button>
    <button type="button" class="ccs-mode-button" data-set-mode="landscape" aria-pressed="${currentMode === "landscape"}">Landscape</button>
  </div>`;
}
function renderMessageActions(message) {
    if (!Array.isArray(message.actions) || message.actions.length === 0) {
        return "";
    }
    const items = message.actions
        .map((action, index) => `<button type="button" class="ccs-action-btn" data-action-message-id="${message.id}" data-action-index="${index}">${escapeHtml(action.label)}</button>`)
        .join("");
    return `<div class="ccs-action-group" aria-label="Message actions">${items}</div>`;
}
function renderMessage(message) {
    const roleClass = message.role === "user" ? "ccs-message-user" : "ccs-message-assistant";
    const stateClass = `ccs-message-state-${message.state}`;
    const content = message.role === "assistant"
        ? `<div class="ccs-bubble-markdown">${renderMarkdown(message.text)}</div>`
        : `<div class="ccs-bubble-plain">${escapeHtml(message.text).replaceAll("\n", "<br>")}</div>`;
    return `<article class="ccs-message ${roleClass} ${stateClass}" data-message-id="${message.id}">
    <div class="ccs-bubble">${content}</div>
    <div class="ccs-meta-row">
      <span class="ccs-meta-time">${formatTimestamp(message.createdAt)}</span>
    </div>
    ${renderMessageActions(message)}
  </article>`;
}
function renderMessageList(messages) {
    if (messages.length === 0) {
        return `<p class="ccs-empty">No messages yet. Start the conversation below.</p>`;
    }
    return messages.map((message) => renderMessage(message)).join("");
}
function renderThinkingIndicator(thinkingText) {
    return `<div class="ccs-thinking" aria-live="polite">
    <span class="ccs-thinking-text">${escapeHtml(thinkingText)}</span>
    <span class="ccs-thinking-dots" aria-hidden="true"><span></span><span></span><span></span></span>
  </div>`;
}
function renderShellBody(state) {
    const messageStream = `${renderMessageList(state.messages)}${state.isThinking ? renderThinkingIndicator(state.thinkingText) : ""}`;
    if (state.mode === "landscape") {
        return `<div class="ccs-landscape-grid">
      <main class="ccs-body" data-chat-messages>${messageStream}</main>
      <aside class="ccs-side-panel">
        <h3 class="ccs-side-title">Workspace</h3>
        <p class="ccs-side-copy">Use quick actions from assistant replies to branch the flow faster.</p>
        <p class="ccs-side-copy">The chat transcript remains shared when you switch between supported modes.</p>
      </aside>
    </div>`;
    }
    return `<main class="ccs-body" data-chat-messages>${messageStream}</main>`;
}
export function renderWidgetLayout(state) {
    const modeClass = state.mode === "landscape" ? "ccs-layout-landscape" : "ccs-layout-normal";
    const teaserMarkup = !state.isOpen && state.showTeaser
        ? `<section class="ccs-teaser ${state.positionClass}" data-teaser>
          <button type="button" class="ccs-teaser-close" data-dismiss-teaser aria-label="Dismiss teaser">&times;</button>
          <button type="button" class="ccs-teaser-open" data-open-from-teaser>
            <span class="ccs-teaser-title">${escapeHtml(state.teaserTitle)}</span>
            <span class="ccs-teaser-text">${escapeHtml(state.teaserText)}</span>
          </button>
        </section>`
        : "";
    return `<section class="ccs-root ${modeClass}">
    ${teaserMarkup}
    <button type="button" class="ccs-toggle ${state.positionClass}${state.isOpen ? " ccs-toggle-hidden" : ""}" data-toggle-open aria-label="Open chat">💬</button>
    <section class="ccs-shell ${state.positionClass}${state.isOpen ? " ccs-shell-open" : " ccs-shell-closed"}">
      <header class="ccs-header">
        <h2 class="ccs-title">${escapeHtml(state.title)}</h2>
        <div class="ccs-header-controls">
          ${state.allowRuntimeModeSwitch ? renderModeToggle(state.mode) : ""}
          ${state.showRefreshButton ? "<button type=\"button\" class=\"ccs-icon-btn\" data-refresh-chat title=\"Clear conversation\">&#8635;</button>" : ""}
          <button type="button" class="ccs-icon-btn" data-close-chat title="Close chat">&times;</button>
        </div>
      </header>
      ${renderShellBody(state)}
      <form class="ccs-footer" data-chat-form>
        <textarea
          class="ccs-input"
          data-chat-input
          rows="1"
          placeholder="${escapeHtml(state.inputPlaceholder)}"
          aria-label="Type a message"
        ></textarea>
        <button class="ccs-send" type="submit" aria-label="Send message">Send</button>
      </form>
    </section>
  </section>`;
}
//# sourceMappingURL=shared.js.map