function scopeSelector(scopeClass, selector) {
    if (!scopeClass) {
        return selector;
    }
    return `.${scopeClass} ${selector}`;
}
export function createWidgetStyles(scopeClass) {
    const root = scopeSelector(scopeClass, ".ccs-root");
    const header = scopeSelector(scopeClass, ".ccs-header");
    const title = scopeSelector(scopeClass, ".ccs-title");
    const modeToggle = scopeSelector(scopeClass, ".ccs-mode-toggle");
    const modeButton = scopeSelector(scopeClass, ".ccs-mode-button");
    const messages = scopeSelector(scopeClass, ".ccs-messages");
    const message = scopeSelector(scopeClass, ".ccs-message");
    const userMessage = scopeSelector(scopeClass, ".ccs-message-user");
    const assistantMessage = scopeSelector(scopeClass, ".ccs-message-assistant");
    const inputRow = scopeSelector(scopeClass, ".ccs-input-row");
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
  background: var(--ccs-color-surface);
  border: 1px solid var(--ccs-color-border);
  border-radius: var(--ccs-border-radius);
  color: var(--ccs-color-text);
  display: flex;
  flex-direction: column;
  font-family: var(--ccs-font-family, system-ui, sans-serif);
  gap: var(--ccs-spacing);
  max-width: 100%;
  min-height: 420px;
  padding: var(--ccs-spacing);
  box-sizing: border-box;
}

${header} {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

${title} {
  font-size: 1.05rem;
  margin: 0;
}

${modeToggle} {
  display: inline-flex;
  border: 1px solid var(--ccs-color-border);
  border-radius: 999px;
  overflow: hidden;
}

${modeButton} {
  background: transparent;
  border: 0;
  color: var(--ccs-color-text);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 6px 12px;
}

${modeButton}[aria-pressed="true"] {
  background: var(--ccs-color-primary);
  color: #ffffff;
}

${messages} {
  background: var(--ccs-color-panel);
  border: 1px solid var(--ccs-color-border);
  border-radius: calc(var(--ccs-border-radius) - 4px);
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 220px;
  overflow-y: auto;
  padding: var(--ccs-spacing);
}

${message} {
  border-radius: 10px;
  line-height: 1.4;
  max-width: 86%;
  padding: 8px 10px;
  white-space: pre-wrap;
}

${userMessage} {
  align-self: flex-end;
  background: var(--ccs-color-primary);
  color: #ffffff;
}

${assistantMessage} {
  align-self: flex-start;
  background: #ffffff;
  border: 1px solid var(--ccs-color-border);
  color: var(--ccs-color-text);
}

${emptyState} {
  color: var(--ccs-color-muted-text);
  margin: auto;
}

${inputRow} {
  display: flex;
  gap: 8px;
}

${input} {
  background: #ffffff;
  border: 1px solid var(--ccs-color-border);
  border-radius: 8px;
  color: var(--ccs-color-text);
  flex: 1;
  padding: 10px;
}

${send} {
  background: var(--ccs-color-primary);
  border: 0;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  padding: 10px 14px;
}

${landscapeGrid} {
  display: grid;
  gap: var(--ccs-spacing);
  grid-template-columns: minmax(0, 2fr) minmax(180px, 1fr);
  min-height: 220px;
}

${sidePanel} {
  background: #ffffff;
  border: 1px solid var(--ccs-color-border);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
}

${sideTitle} {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}

${sideCopy} {
  color: var(--ccs-color-muted-text);
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 820px) {
  ${landscapeGrid} {
    grid-template-columns: 1fr;
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