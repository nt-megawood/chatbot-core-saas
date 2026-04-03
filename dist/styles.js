function scopeSelector(scopeClass, selector) {
    if (!scopeClass) {
        return selector;
    }
    return `.${scopeClass} ${selector}`;
}
export function createWidgetStyles(scopeClass) {
    const root = scopeSelector(scopeClass, ".ccs-root");
    const shell = scopeSelector(scopeClass, ".ccs-shell");
    const shellOpen = scopeSelector(scopeClass, ".ccs-shell-open");
    const shellClosed = scopeSelector(scopeClass, ".ccs-shell-closed");
    const positionBottomRight = scopeSelector(scopeClass, ".ccs-pos-bottom-right");
    const positionBottomLeft = scopeSelector(scopeClass, ".ccs-pos-bottom-left");
    const positionBottomCenter = scopeSelector(scopeClass, ".ccs-pos-bottom-center");
    const positionTopRight = scopeSelector(scopeClass, ".ccs-pos-top-right");
    const positionTopLeft = scopeSelector(scopeClass, ".ccs-pos-top-left");
    const positionTopCenter = scopeSelector(scopeClass, ".ccs-pos-top-center");
    const positionMiddleRight = scopeSelector(scopeClass, ".ccs-pos-middle-right");
    const positionMiddleLeft = scopeSelector(scopeClass, ".ccs-pos-middle-left");
    const toggle = scopeSelector(scopeClass, ".ccs-toggle");
    const toggleHidden = scopeSelector(scopeClass, ".ccs-toggle-hidden");
    const teaser = scopeSelector(scopeClass, ".ccs-teaser");
    const teaserOpen = scopeSelector(scopeClass, ".ccs-teaser-open");
    const teaserClose = scopeSelector(scopeClass, ".ccs-teaser-close");
    const header = scopeSelector(scopeClass, ".ccs-header");
    const headerControls = scopeSelector(scopeClass, ".ccs-header-controls");
    const iconButton = scopeSelector(scopeClass, ".ccs-icon-btn");
    const title = scopeSelector(scopeClass, ".ccs-title");
    const modeToggle = scopeSelector(scopeClass, ".ccs-mode-toggle");
    const modeButton = scopeSelector(scopeClass, ".ccs-mode-button");
    const body = scopeSelector(scopeClass, ".ccs-body");
    const message = scopeSelector(scopeClass, ".ccs-message");
    const metaRow = scopeSelector(scopeClass, ".ccs-meta-row");
    const metaTime = scopeSelector(scopeClass, ".ccs-meta-time");
    const bubble = scopeSelector(scopeClass, ".ccs-bubble");
    const bubbleMarkdown = scopeSelector(scopeClass, ".ccs-bubble-markdown");
    const bubblePlain = scopeSelector(scopeClass, ".ccs-bubble-plain");
    const userMessage = scopeSelector(scopeClass, ".ccs-message-user");
    const assistantMessage = scopeSelector(scopeClass, ".ccs-message-assistant");
    const actionGroup = scopeSelector(scopeClass, ".ccs-action-group");
    const actionButton = scopeSelector(scopeClass, ".ccs-action-btn");
    const thinking = scopeSelector(scopeClass, ".ccs-thinking");
    const thinkingText = scopeSelector(scopeClass, ".ccs-thinking-text");
    const thinkingDots = scopeSelector(scopeClass, ".ccs-thinking-dots span");
    const footer = scopeSelector(scopeClass, ".ccs-footer");
    const input = scopeSelector(scopeClass, ".ccs-input");
    const send = scopeSelector(scopeClass, ".ccs-send");
    const emptyState = scopeSelector(scopeClass, ".ccs-empty");
    const landscapeGrid = scopeSelector(scopeClass, ".ccs-landscape-grid");
    const sidePanel = scopeSelector(scopeClass, ".ccs-side-panel");
    const sideTitle = scopeSelector(scopeClass, ".ccs-side-title");
    const sideCopy = scopeSelector(scopeClass, ".ccs-side-copy");
    return `
${root} {
  --ccs-color-surface: #ffffff;
  --ccs-color-panel: #f6f8fb;
  --ccs-color-primary: #1f6feb;
  --ccs-color-text: #101828;
  --ccs-color-muted-text: #475467;
  --ccs-color-border: #d0d5dd;
  --ccs-border-radius: 12px;
  --ccs-spacing: 12px;
  --ccs-widget-width: 400px;
  --ccs-widget-height: 640px;
  --ccs-widget-width-landscape: 860px;
  --ccs-widget-height-landscape: 540px;
  --ccs-shadow: 0 10px 28px rgba(9, 20, 48, 0.2);
  color: var(--ccs-color-text);
  font-family: var(--ccs-font-family, system-ui, sans-serif);
  pointer-events: none;
}

${shell},
${toggle},
${teaser} {
  pointer-events: auto;
  position: fixed;
  z-index: 1100;
}

${shell} {
  width: var(--ccs-widget-width);
  height: var(--ccs-widget-height);
  background: var(--ccs-color-surface);
  border: 1px solid var(--ccs-color-border);
  border-radius: var(--ccs-border-radius);
  box-shadow: var(--ccs-shadow);
  color: var(--ccs-color-text);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

${shellOpen} {
  opacity: 1;
  transform: translateY(0);
}

${shellClosed} {
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
}

${toggle} {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
  background: linear-gradient(160deg, var(--ccs-color-primary), #1546a0);
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
}

${toggleHidden} {
  display: none;
}

${teaser} {
  width: min(280px, 90vw);
  background: var(--ccs-color-surface);
  border: 1px solid var(--ccs-color-border);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(5, 18, 42, 0.2);
  padding: 12px;
}

${teaserOpen} {
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  text-align: left;
  width: 100%;
}

${teaserClose} {
  background: transparent;
  border: 0;
  color: var(--ccs-color-muted-text);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  position: absolute;
  right: 12px;
  top: 8px;
}

${header} {
  align-items: center;
  border-bottom: 1px solid var(--ccs-color-border);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  min-height: 68px;
  padding: 12px 14px;
}

${title} {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

${headerControls} {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

${modeToggle} {
  display: inline-flex;
  border: 1px solid var(--ccs-color-border);
  border-radius: 999px;
  overflow: hidden;
}

${modeButton} {
  background: #ffffff;
  border: 0;
  color: var(--ccs-color-text);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 10px;
}

${modeButton}[aria-pressed="true"] {
  background: var(--ccs-color-primary);
  color: #ffffff;
}

${iconButton} {
  align-items: center;
  background: #ffffff;
  border: 1px solid var(--ccs-color-border);
  border-radius: 999px;
  color: var(--ccs-color-text);
  cursor: pointer;
  display: inline-flex;
  font-size: 0.95rem;
  height: 30px;
  justify-content: center;
  width: 30px;
}

${iconButton}:hover {
  border-color: var(--ccs-color-primary);
  color: var(--ccs-color-primary);
}

${body} {
  background: var(--ccs-color-panel);
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding: 14px;
}

${message} {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 86%;
}

${bubble} {
  background: #ffffff;
  border: 1px solid var(--ccs-color-border);
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(5, 18, 42, 0.08);
  line-height: 1.45;
  padding: 11px 12px;
}

${bubbleMarkdown} p {
  margin: 0 0 8px;
}

${bubbleMarkdown} p:last-child {
  margin-bottom: 0;
}

${bubbleMarkdown} ul {
  margin: 6px 0 0;
  padding-left: 18px;
}
