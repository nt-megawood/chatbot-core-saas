export function renderMarkdown(text) {
    let html = String(text || "");
    html = html
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    const linkPlaceholders = [];
    html = html.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g, (_full, label, url) => {
        const anchor = `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        const token = `__CCS_MDLINK_${linkPlaceholders.length}__`;
        linkPlaceholders.push(anchor);
        return token;
    });
    html = html.replace(/(https?:\/\/[^\s<]+)/g, (fullUrl) => {
        const match = String(fullUrl).match(/^(https?:\/\/[^\s<]*?)([)\].,;:!?]+)?$/);
        if (!match) {
            return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${fullUrl}</a>`;
        }
        const cleanUrl = match[1];
        const trailing = match[2] || "";
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>${trailing}`;
    });
    html = html.replace(/__CCS_MDLINK_(\d+)__/g, (_full, idxText) => {
        const idx = Number(idxText);
        if (!Number.isFinite(idx)) {
            return "";
        }
        return linkPlaceholders[idx] || "";
    });
    const lines = html.split("\n");
    const blocks = [];
    let paragraphLines = [];
    let listItems = [];
    const flushParagraph = () => {
        if (!paragraphLines.length) {
            return;
        }
        blocks.push(`<p>${paragraphLines.join("<br>")}</p>`);
        paragraphLines = [];
    };
    const flushList = () => {
        if (!listItems.length) {
            return;
        }
        blocks.push(`<ul>${listItems.join("")}</ul>`);
        listItems = [];
    };
    for (const line of lines) {
        const trimmed = line.trim();
        const bullet = trimmed.match(/^[-*]\s+(.+)$/);
        if (bullet) {
            flushParagraph();
            listItems.push(`<li>${bullet[1]}</li>`);
            continue;
        }
        if (!trimmed) {
            flushParagraph();
            flushList();
            continue;
        }
        flushList();
        paragraphLines.push(trimmed);
    }
    flushParagraph();
    flushList();
    return blocks.join("");
}
//# sourceMappingURL=markdown.js.map