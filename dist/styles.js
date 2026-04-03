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

${bubbleMarkdown} a {
  color: var(--ccs-color-primary);
  text-decoration: underline;
  word-break: break-word;
}

${bubblePlain} {
  white-space: pre-wrap;
}

${userMessage} {
  align-self: flex-end;
}

${userMessage} ${bubble} {
  background: var(--ccs-color-primary);
  border-color: var(--ccs-color-primary);
  color: #ffffff;
}

${assistantMessage} {
  align-self: flex-start;
}

${emptyState} {
  color: var(--ccs-color-muted-text);
  margin: auto 0;
  text-align: center;
}

${metaRow} {
  display: flex;
  min-height: 14px;
}

${metaTime} {
  color: var(--ccs-color-muted-text);
  font-size: 11px;
}

${actionGroup} {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

${actionButton} {
  background: var(--ccs-color-primary);
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  font-size: 12px;
  padding: 7px 12px;
}

${actionButton}:hover {
  opacity: 0.9;
}

${thinking} {
  align-items: center;
  display: flex;
  gap: 8px;
  margin: 4px 0;
}

${thinkingText} {
  color: var(--ccs-color-muted-text);
  font-size: 13px;
  font-style: italic;
}

${thinkingDots} {
  animation: ccs-thinking-dot 1.5s infinite ease-in-out;
  background: #9ea8ba;
  border-radius: 50%;
  display: inline-block;
  height: 4px;
  margin-right: 2px;
  width: 4px;
}

${thinkingDots}:nth-child(1) { animation-delay: 0s; }
${thinkingDots}:nth-child(2) { animation-delay: 0.25s; }
${thinkingDots}:nth-child(3) { animation-delay: 0.5s; }

@keyframes ccs-thinking-dot {
  0%, 100% { opacity: 0.2; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
}

${footer} {
  align-items: center;
  background: #ffffff;
  border-top: 1px solid var(--ccs-color-border);
  box-shadow: 0 -1px 2px rgba(16, 24, 40, 0.06);
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  padding: 12px;
}

${input} {
  background: #ffffff;
  border: 1px solid var(--ccs-color-border);
  border-radius: 18px;
  color: var(--ccs-color-text);
  flex: 1;
  font: inherit;
  max-height: 120px;
  min-height: 42px;
  padding: 10px 12px;
  resize: none;
}

${send} {
  background: var(--ccs-color-primary);
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  height: 38px;
  min-width: 68px;
  padding: 0 14px;
}

${landscapeGrid} {
  display: grid;
  gap: var(--ccs-spacing);
  grid-template-columns: minmax(0, 2fr) minmax(220px, 1fr);
  min-height: 0;
  flex: 1;
}

${sidePanel} {
  background: #f6f8fc;
  border: 1px solid var(--ccs-color-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 12px 12px 0;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
}

${sideTitle} {
  font-size: 0.92rem;
  font-weight: 600;
  margin: 0;
}

${sideCopy} {
  color: var(--ccs-color-muted-text);
  font-size: 0.85rem;
  margin: 0;
}

${positionBottomRight} {
  bottom: 20px;
  right: 20px;
}

${positionBottomLeft} {
  bottom: 20px;
  left: 20px;
}

${positionBottomCenter} {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

${positionTopRight} {
  right: 20px;
  top: 20px;
}

${positionTopLeft} {
  left: 20px;
  top: 20px;
}

${positionTopCenter} {
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
}

${positionMiddleRight} {
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

${positionMiddleLeft} {
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}

${scopeSelector(scopeClass, ".ccs-layout-landscape .ccs-shell")} {
  width: var(--ccs-widget-width-landscape);
  height: var(--ccs-widget-height-landscape);
}

@media (max-width: 820px) {
  ${shell} {
    height: min(var(--ccs-widget-height), 86vh);
    width: min(var(--ccs-widget-width), 95vw);
  }

  ${scopeSelector(scopeClass, ".ccs-layout-landscape .ccs-shell")} {
    height: min(var(--ccs-widget-height-landscape), 88vh);
    width: min(var(--ccs-widget-width-landscape), 96vw);
  }

  ${landscapeGrid} {
    grid-template-columns: 1fr;
    padding-bottom: 10px;
  }

  ${sidePanel} {
    margin: 0 12px 12px;
  }
}
`;
}
export function applyThemeTokens(root, tokens, fontFamilies) {
    const variables = {
        "--ccs-color-surface": tokens.colorSurface,
        "--ccs-color-panel": tokens.colorPanel,
        "--ccs-color-primary": tokens.colorPrimary,
        "--ccs-color-text": tokens.colorText,
        "--ccs-color-muted-text": tokens.colorMutedText,
        "--ccs-color-border": tokens.colorBorder,
        "--ccs-border-radius": tokens.borderRadius,
        "--ccs-spacing": tokens.spacing,
        "--ccs-font-family": fontFamilies.join(", ")
    };
    for (const [name, value] of Object.entries(variables)) {
        root.style.setProperty(name, value);
    }
}
//# sourceMappingURL=styles.js.map