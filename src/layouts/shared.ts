import type { I18nMessages, Message, WidgetMode } from "../types.js";
import { renderMarkdown } from "../utils/markdown.js";

export interface LayoutRenderState {
  mode: WidgetMode;
  title: string;
  inputPlaceholder: string;
  positionClass: string;
  allowRuntimeModeSwitch: boolean;
  showRefreshButton: boolean;
  isOpen: boolean;
  showTeaser: boolean;
  teaserTitle: string;
  teaserText: string;
  messages: readonly Message[];
  isThinking: boolean;
  thinkingText: string;
  labels: I18nMessages;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTimestamp(createdAt: number): string {
  return new Date(createdAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderModeToggle(currentMode: WidgetMode, labels: I18nMessages): string {
  return `<div class="ccs-mode-toggle" aria-label="${escapeHtml(labels.layoutModeSelectorAriaLabel)}">
    <button type="button" class="ccs-mode-button" data-set-mode="normal" aria-pressed="${
      currentMode === "normal"
    }">${escapeHtml(labels.layoutModeNormalLabel)}</button>
    <button type="button" class="ccs-mode-button" data-set-mode="landscape" aria-pressed="${
      currentMode === "landscape"
    }">${escapeHtml(labels.layoutModeLandscapeLabel)}</button>
  </div>`;
}

function renderMessageActions(message: Message, labels: I18nMessages): string {
  if (!Array.isArray(message.actions) || message.actions.length === 0) {
    return "";
  }

  const items = message.actions
    .map(
      (action, index) =>
        `<button type="button" class="ccs-action-btn" data-action-message-id="${message.id}" data-action-index="${index}">${escapeHtml(
          action.label
        )}</button>`
    )
    .join("");

  return `<div class="ccs-action-group" aria-label="${escapeHtml(labels.messageActionsAriaLabel)}">${items}</div>`;
}

function renderMessage(message: Message, labels: I18nMessages): string {
  const roleClass = message.role === "user" ? "ccs-message-user" : "ccs-message-assistant";
  const stateClass = `ccs-message-state-${message.state}`;

  const content =
    message.role === "assistant"
      ? `<div class="ccs-bubble-markdown">${renderMarkdown(message.text)}</div>`
      : `<div class="ccs-bubble-plain">${escapeHtml(message.text).replaceAll("\n", "<br>")}</div>`;

  return `<article class="ccs-message ${roleClass} ${stateClass}" data-message-id="${message.id}">
    <div class="ccs-bubble">${content}</div>
    <div class="ccs-meta-row">
      <span class="ccs-meta-time">${formatTimestamp(message.createdAt)}</span>
    </div>
    ${renderMessageActions(message, labels)}
  </article>`;
}

function renderMessageList(messages: readonly Message[], labels: I18nMessages): string {
  if (messages.length === 0) {
    return `<p class="ccs-empty">${escapeHtml(labels.emptyMessageListText)}</p>`;
  }

  return messages.map((message) => renderMessage(message, labels)).join("");
}

function renderThinkingIndicator(thinkingText: string): string {
  return `<div class="ccs-thinking" aria-live="polite">
    <span class="ccs-thinking-text">${escapeHtml(thinkingText)}</span>
    <span class="ccs-thinking-dots" aria-hidden="true"><span></span><span></span><span></span></span>
  </div>`;
}

function renderShellBody(state: LayoutRenderState): string {
  const messageStream = `${renderMessageList(state.messages, state.labels)}${
    state.isThinking ? renderThinkingIndicator(state.thinkingText) : ""
  }`;

  if (state.mode === "landscape") {
    return `<div class="ccs-landscape-grid">
      <main class="ccs-body" data-chat-messages>${messageStream}</main>
      <aside class="ccs-side-panel">
        <h3 class="ccs-side-title">${escapeHtml(state.labels.landscapeSidebarTitle)}</h3>
        <p class="ccs-side-copy">${escapeHtml(state.labels.landscapeSidebarLine1)}</p>
        <p class="ccs-side-copy">${escapeHtml(state.labels.landscapeSidebarLine2)}</p>
      </aside>
    </div>`;
  }

  return `<main class="ccs-body" data-chat-messages>${messageStream}</main>`;
}

export function renderWidgetLayout(state: LayoutRenderState): string {
  const modeClass = state.mode === "landscape" ? "ccs-layout-landscape" : "ccs-layout-normal";

  const teaserMarkup =
    !state.isOpen && state.showTeaser
      ? `<section class="ccs-teaser ${state.positionClass}" data-teaser>
          <button type="button" class="ccs-teaser-close" data-dismiss-teaser aria-label="${escapeHtml(state.labels.teaserDismissAriaLabel)}">&times;</button>
          <button type="button" class="ccs-teaser-open" data-open-from-teaser>
            <span class="ccs-teaser-title">${escapeHtml(state.teaserTitle)}</span>
            <span class="ccs-teaser-text">${escapeHtml(state.teaserText)}</span>
          </button>
        </section>`
      : "";

  return `<section class="ccs-root ${modeClass}">
    ${teaserMarkup}
    <button type="button" class="ccs-toggle ${state.positionClass}${
      state.isOpen ? " ccs-toggle-hidden" : ""
    }" data-toggle-open aria-label="${escapeHtml(state.labels.openChatAriaLabel)}">💬</button>
    <section class="ccs-shell ${state.positionClass}${state.isOpen ? " ccs-shell-open" : " ccs-shell-closed"}">
      <header class="ccs-header">
        <h2 class="ccs-title">${escapeHtml(state.title)}</h2>
        <div class="ccs-header-controls">
          ${state.allowRuntimeModeSwitch ? renderModeToggle(state.mode, state.labels) : ""}
          ${state.showRefreshButton ? `<button type="button" class="ccs-icon-btn" data-refresh-chat title="${escapeHtml(state.labels.clearConversationTitle)}">&#8635;</button>` : ""}
          <button type="button" class="ccs-icon-btn" data-close-chat title="${escapeHtml(state.labels.closeChatTitle)}">&times;</button>
        </div>
      </header>
      ${renderShellBody(state)}
      <form class="ccs-footer" data-chat-form>
        <textarea
          class="ccs-input"
          data-chat-input
          rows="1"
          placeholder="${escapeHtml(state.inputPlaceholder)}"
          aria-label="${escapeHtml(state.labels.inputAriaLabel)}"
        ></textarea>
        <button class="ccs-send" type="submit" aria-label="${escapeHtml(state.labels.sendMessageAriaLabel)}">${escapeHtml(state.labels.sendMessageLabel)}</button>
      </form>
    </section>
  </section>`;
}
