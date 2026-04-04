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
function resolveRenderedMarkup(markup) {
    return typeof markup === "string" ? markup : null;
}
function createRenderHooksSharedContext(state) {
    return {
        mode: state.mode,
        isOpen: state.isOpen,
        conversationId: state.conversationId,
        messages: state.messages,
        labels: state.labels,
        title: state.title,
        inputPlaceholder: state.inputPlaceholder,
        positionClass: state.positionClass,
        allowRuntimeModeSwitch: state.allowRuntimeModeSwitch,
        showRefreshButton: state.showRefreshButton,
        teaserTitle: state.teaserTitle,
        teaserText: state.teaserText,
        isThinking: state.isThinking,
        thinkingText: state.thinkingText,
        isInputDisabled: state.isInputDisabled,
        isSendLoading: state.isSendLoading
    };
}
function createMessageRenderContext(state, message, messageIndex, assistantActionState) {
    return {
        ...createRenderHooksSharedContext(state),
        message,
        messageIndex,
        assistantActionState
    };
}
function renderModeToggle(currentMode, labels) {
    return `<div class="ccs-mode-toggle" aria-label="${escapeHtml(labels.layoutModeSelectorAriaLabel)}">
    <button type="button" class="ccs-mode-button" data-set-mode="normal" aria-pressed="${currentMode === "normal"}">${escapeHtml(labels.layoutModeNormalLabel)}</button>
    <button type="button" class="ccs-mode-button" data-set-mode="landscape" aria-pressed="${currentMode === "landscape"}">${escapeHtml(labels.layoutModeLandscapeLabel)}</button>
  </div>`;
}
function renderMessageActions(message, labels) {
    if (!Array.isArray(message.actions) || message.actions.length === 0) {
        return "";
    }
    const items = message.actions
        .map((action, index) => `<button type="button" class="ccs-action-btn" data-action-message-id="${message.id}" data-action-index="${index}">${escapeHtml(action.label)}</button>`)
        .join("");
    return `<div class="ccs-action-group" aria-label="${escapeHtml(labels.messageActionsAriaLabel)}">${items}</div>`;
}
function iconThumbUp() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`;
}
function iconThumbDown() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"></path><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>`;
}
function iconCopy() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
}
function iconCopied() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
}
function iconSpeak() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
}
function renderAssistantActionToolbar(message, labels, actionState) {
    if (message.role !== "assistant" || message.state === "pending" || !message.text.trim()) {
        return "";
    }
    const feedbackState = actionState?.feedback ?? null;
    const copied = actionState?.copied ?? false;
    const speaking = actionState?.speaking ?? false;
    const feedbackUpClass = feedbackState === "up" ? " ccs-assistant-action-active" : "";
    const feedbackDownClass = feedbackState === "down" ? " ccs-assistant-action-active" : "";
    const speakClass = speaking ? " ccs-assistant-action-active" : "";
    const copyTitle = copied ? labels.assistantCopiedAriaLabel : labels.assistantCopyAriaLabel;
    const speakTitle = speaking ? labels.assistantStopSpeakAriaLabel : labels.assistantSpeakAriaLabel;
    return `<div class="ccs-assistant-actions" aria-label="${escapeHtml(labels.assistantActionsAriaLabel)}">
    <button
      type="button"
      class="ccs-assistant-action-btn${feedbackUpClass}"
      data-assistant-action-message-id="${message.id}"
      data-assistant-action="feedback_up"
      title="${escapeHtml(labels.assistantFeedbackUpAriaLabel)}"
      aria-label="${escapeHtml(labels.assistantFeedbackUpAriaLabel)}"
      aria-pressed="${feedbackState === "up"}"
    >${iconThumbUp()}</button>
    <button
      type="button"
      class="ccs-assistant-action-btn${feedbackDownClass}"
      data-assistant-action-message-id="${message.id}"
      data-assistant-action="feedback_down"
      title="${escapeHtml(labels.assistantFeedbackDownAriaLabel)}"
      aria-label="${escapeHtml(labels.assistantFeedbackDownAriaLabel)}"
      aria-pressed="${feedbackState === "down"}"
    >${iconThumbDown()}</button>
    <button
      type="button"
      class="ccs-assistant-action-btn${copied ? " ccs-assistant-action-active" : ""}"
      data-assistant-action-message-id="${message.id}"
      data-assistant-action="copy"
      title="${escapeHtml(copyTitle)}"
      aria-label="${escapeHtml(copyTitle)}"
      aria-pressed="${copied}"
    >${copied ? iconCopied() : iconCopy()}</button>
    <button
      type="button"
      class="ccs-assistant-action-btn${speakClass}"
      data-assistant-action-message-id="${message.id}"
      data-assistant-action="speak"
      title="${escapeHtml(speakTitle)}"
      aria-label="${escapeHtml(speakTitle)}"
      aria-pressed="${speaking}"
    >${iconSpeak()}</button>
  </div>`;
}
function asRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }
    return value;
}
function normalizeSourceLink(input) {
    if (typeof input === "string") {
        const trimmed = input.trim();
        if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
            return null;
        }
        return {
            url: trimmed,
            label: trimmed
        };
    }
    const record = asRecord(input);
    if (!record) {
        return null;
    }
    const rawUrl = typeof record.url === "string"
        ? record.url
        : typeof record.href === "string"
            ? record.href
            : "";
    const url = rawUrl.trim();
    if (!url || !/^https?:\/\//i.test(url)) {
        return null;
    }
    const rawLabel = typeof record.label === "string"
        ? record.label
        : typeof record.title === "string"
            ? record.title
            : url;
    return {
        url,
        label: rawLabel.trim() || url
    };
}
function extractSourceLinks(message) {
    const metadata = asRecord(message.metadata);
    if (!metadata) {
        return [];
    }
    const sources = metadata.sources;
    if (!Array.isArray(sources)) {
        return [];
    }
    const links = [];
    for (const entry of sources) {
        const normalized = normalizeSourceLink(entry);
        if (normalized) {
            links.push(normalized);
        }
    }
    return links;
}
function renderMessageSources(message) {
    const links = extractSourceLinks(message);
    if (links.length === 0) {
        return "";
    }
    const items = links
        .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`)
        .join("");
    return `<div class="ccs-message-sources" data-message-sources>
    <span class="ccs-message-sources-label">Sources</span>
    ${items}
  </div>`;
}
function renderMessage(state, message, messageIndex) {
    const roleClass = message.role === "user" ? "ccs-message-user" : "ccs-message-assistant";
    const stateClass = `ccs-message-state-${message.state}`;
    const assistantActionState = state.assistantActionStateByMessageId[message.id];
    const renderContext = createMessageRenderContext(state, message, messageIndex, assistantActionState);
    const assistantActionToolbar = renderAssistantActionToolbar(message, state.labels, assistantActionState);
    const customMetaMarkup = resolveRenderedMarkup(state.renderHooks.renderMessageMeta?.(renderContext));
    const customFooterMarkup = resolveRenderedMarkup(state.renderHooks.renderMessageFooter?.(renderContext));
    const messageMetaMarkup = customMetaMarkup ?? `<span class="ccs-meta-time">${formatTimestamp(message.createdAt)}</span>`;
    const messageFooterMarkup = `${renderMessageSources(message)}${customFooterMarkup ?? ""}`;
    const content = message.role === "assistant"
        ? `<div class="ccs-bubble-markdown">${renderMarkdown(message.text)}</div>`
        : `<div class="ccs-bubble-plain">${escapeHtml(message.text).replaceAll("\n", "<br>")}</div>`;
    return `<article class="ccs-message ${roleClass} ${stateClass}" data-message-id="${message.id}">
    <div class="ccs-bubble">${content}</div>
    <div class="ccs-meta-row">
      ${messageMetaMarkup}
    </div>
    ${messageFooterMarkup}
    ${assistantActionToolbar}
    ${renderMessageActions(message, state.labels)}
  </article>`;
}
function renderMessageList(state) {
    if (state.messages.length === 0) {
        return `<p class="ccs-empty">${escapeHtml(state.labels.emptyMessageListText)}</p>`;
    }
    return state.messages
        .map((message, messageIndex) => renderMessage(state, message, messageIndex))
        .join("");
}
function renderThinkingIndicator(thinkingText) {
    return `<div class="ccs-thinking" aria-live="polite">
    <span class="ccs-thinking-text">${escapeHtml(thinkingText)}</span>
    <span class="ccs-thinking-dots" aria-hidden="true"><span></span><span></span><span></span></span>
  </div>`;
}
function findLatestAssistantMessage(messages) {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        const message = messages[index];
        if (message?.role === "assistant") {
            return message;
        }
    }
    return null;
}
function renderInputCard(state) {
    const renderInputCardHook = state.renderHooks.renderInputCard;
    if (!renderInputCardHook) {
        return "";
    }
    const context = {
        ...createRenderHooksSharedContext(state),
        latestAssistantMessage: findLatestAssistantMessage(state.messages)
    };
    const rendered = resolveRenderedMarkup(renderInputCardHook(context));
    return rendered ?? "";
}
function renderMessageStream(state) {
    const inputCardMarkup = renderInputCard(state);
    return `${renderMessageList(state)}${state.isThinking ? renderThinkingIndicator(state.thinkingText) : ""}${inputCardMarkup}`;
}
function renderHeader(state) {
    const customMarkup = resolveRenderedMarkup(state.renderHooks.renderHeader?.(createRenderHooksSharedContext(state)));
    if (customMarkup !== null) {
        return customMarkup;
    }
    return `<header class="ccs-header">
    <h2 class="ccs-title">${escapeHtml(state.title)}</h2>
    <div class="ccs-header-controls">
      ${state.allowRuntimeModeSwitch ? renderModeToggle(state.mode, state.labels) : ""}
      <div class="ccs-header-actions">
        ${state.showRefreshButton ? `<button type="button" class="ccs-icon-btn" data-refresh-chat title="${escapeHtml(state.labels.clearConversationTitle)}">&#8635;</button>` : ""}
        <button type="button" class="ccs-icon-btn" data-close-chat title="${escapeHtml(state.labels.closeChatTitle)}">&times;</button>
      </div>
    </div>
  </header>`;
}
function renderFooterMeta(state) {
    const rendered = resolveRenderedMarkup(state.renderHooks.renderFooterMeta?.(createRenderHooksSharedContext(state)));
    return rendered ?? "";
}
function renderFooter(state) {
    const inputDisabledAttribute = state.isInputDisabled ? " disabled" : "";
    const footerMetaMarkup = renderFooterMeta(state);
    return `<form class="ccs-footer" data-chat-form>
    <div class="ccs-footer-input-row">
      <textarea
        class="ccs-input"
        data-chat-input
        rows="1"
        placeholder="${escapeHtml(state.inputPlaceholder)}"
        aria-label="${escapeHtml(state.labels.inputAriaLabel)}"${inputDisabledAttribute}
      ></textarea>
      <button
        class="ccs-send${state.isSendLoading ? " ccs-send-loading" : ""}"
        type="submit"
        aria-label="${escapeHtml(state.labels.sendMessageAriaLabel)}"
        title="${escapeHtml(state.labels.sendMessageAriaLabel)}"${inputDisabledAttribute}
      >
        ${state.isSendLoading
        ? '<span class="ccs-send-spinner" aria-hidden="true"></span>'
        : '<span class="ccs-send-icon" aria-hidden="true">&#10148;</span>'}
        <span class="ccs-visually-hidden">${escapeHtml(state.labels.sendMessageLabel)}</span>
      </button>
    </div>
    ${footerMetaMarkup}
  </form>`;
}
function renderDefaultLandscapePanel(state) {
    return `<h3 class="ccs-side-title">${escapeHtml(state.labels.landscapeSidebarTitle)}</h3>
    <p class="ccs-side-copy">${escapeHtml(state.labels.landscapeSidebarLine1)}</p>
    <p class="ccs-side-copy">${escapeHtml(state.labels.landscapeSidebarLine2)}</p>`;
}
function renderToggle(state) {
    const customMarkup = resolveRenderedMarkup(state.renderHooks.renderToggle?.(createRenderHooksSharedContext(state)));
    if (customMarkup !== null) {
        return customMarkup;
    }
    return `<button type="button" class="ccs-toggle ${state.positionClass}${state.isOpen ? " ccs-toggle-hidden" : ""}" data-toggle-open aria-label="${escapeHtml(state.labels.openChatAriaLabel)}">&#128172;</button>`;
}
function renderTeaser(state) {
    const customMarkup = resolveRenderedMarkup(state.renderHooks.renderTeaser?.(createRenderHooksSharedContext(state)));
    if (customMarkup !== null) {
        return customMarkup;
    }
    return `<section class="ccs-teaser ${state.positionClass}" data-teaser>
    <button type="button" class="ccs-teaser-close" data-dismiss-teaser aria-label="${escapeHtml(state.labels.teaserDismissAriaLabel)}">&times;</button>
    <button type="button" class="ccs-teaser-open" data-open-from-teaser>
      <span class="ccs-teaser-title">${escapeHtml(state.teaserTitle)}</span>
      <span class="ccs-teaser-text">${escapeHtml(state.teaserText)}</span>
    </button>
  </section>`;
}
function renderShellBody(state) {
    const messageStream = renderMessageStream(state);
    if (state.mode === "landscape") {
        const panelMarkup = typeof state.landscapePanelContent === "string" && state.landscapePanelContent.trim()
            ? state.landscapePanelContent
            : renderDefaultLandscapePanel(state);
        return `<div class="ccs-landscape-grid">
      <div class="ccs-landscape-main">
        ${renderHeader(state)}
        <main class="ccs-body" data-chat-messages>${messageStream}</main>
        ${renderFooter(state)}
      </div>
      <aside class="ccs-side-panel" data-landscape-panel>${panelMarkup}</aside>
    </div>`;
    }
    return `${renderHeader(state)}
    <main class="ccs-body" data-chat-messages>${messageStream}</main>
    ${renderFooter(state)}`;
}
export function renderWidgetLayout(state) {
    const modeClass = state.mode === "landscape" ? "ccs-layout-landscape" : "ccs-layout-normal";
    const teaserMarkup = !state.isOpen && state.showTeaser
        ? renderTeaser(state)
        : "";
    return `<section class="ccs-root ${modeClass}">
    ${teaserMarkup}
    ${renderToggle(state)}
    <section class="ccs-shell ${state.positionClass}${state.isOpen ? " ccs-shell-open" : " ccs-shell-closed"}">
      ${renderShellBody(state)}
    </section>
  </section>`;
}
//# sourceMappingURL=shared.js.map