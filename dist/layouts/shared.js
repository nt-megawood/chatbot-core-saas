function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
function renderMessage(message) {
    const roleClass = message.role === "user" ? "ccs-message-user" : "ccs-message-assistant";
    return `<article class="ccs-message ${roleClass}" data-message-id="${message.id}">${escapeHtml(message.text)}</article>`;
}
export function renderMessageList(messages) {
    if (messages.length === 0) {
        return "<p class=\"ccs-empty\">No messages yet.</p>";
    }
    return messages.map((message) => renderMessage(message)).join("");
}
export function renderModeToggle(currentMode) {
    return `<div class="ccs-mode-toggle">
    <button type="button" class="ccs-mode-button" data-set-mode="normal" aria-pressed="${currentMode === "normal"}">Normal</button>
    <button type="button" class="ccs-mode-button" data-set-mode="landscape" aria-pressed="${currentMode === "landscape"}">Landscape</button>
  </div>`;
}
//# sourceMappingURL=shared.js.map