import type { ThemeTokens } from "./types.js";

function scopeSelector(scopeClass: string | null, selector: string): string {
  if (!scopeClass) {
    return selector;
  }

  return `.${scopeClass} ${selector}`;
}

export function createWidgetStyles(scopeClass: string | null): string {
  const root = scopeSelector(scopeClass, ".ccs-root");
  const shell = scopeSelector(scopeClass, ".ccs-shell");
  const normalShell = scopeSelector(scopeClass, ".ccs-layout-normal .ccs-shell");
  const landscapeShell = scopeSelector(scopeClass, ".ccs-layout-landscape .ccs-shell");
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
  const headerActions = scopeSelector(scopeClass, ".ccs-header-actions");
  const headerActionsDivider = scopeSelector(
    scopeClass,
    ".ccs-header-actions .ccs-icon-btn + .ccs-icon-btn"
  );
  const iconButton = scopeSelector(scopeClass, ".ccs-icon-btn");
  const title = scopeSelector(scopeClass, ".ccs-title");
  const modeToggle = scopeSelector(scopeClass, ".ccs-mode-toggle");
  const modeButton = scopeSelector(scopeClass, ".ccs-mode-button");
  const modeButtonDivider = scopeSelector(
    scopeClass,
    ".ccs-mode-toggle .ccs-mode-button + .ccs-mode-button"
  );
  const body = scopeSelector(scopeClass, ".ccs-body");
  const message = scopeSelector(scopeClass, ".ccs-message");
  const metaRow = scopeSelector(scopeClass, ".ccs-meta-row");
  const metaTime = scopeSelector(scopeClass, ".ccs-meta-time");
  const assistantActions = scopeSelector(scopeClass, ".ccs-assistant-actions");
  const assistantActionButton = scopeSelector(scopeClass, ".ccs-assistant-action-btn");
  const assistantActionButtonActive = scopeSelector(
    scopeClass,
    ".ccs-assistant-action-btn.ccs-assistant-action-active"
  );
  const assistantActionIcon = scopeSelector(scopeClass, ".ccs-assistant-action-btn svg");
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
  const footerInputRow = scopeSelector(scopeClass, ".ccs-footer-input-row");
  const input = scopeSelector(scopeClass, ".ccs-input");
  const send = scopeSelector(scopeClass, ".ccs-send");
  const sendLoading = scopeSelector(scopeClass, ".ccs-send.ccs-send-loading");
  const sendSpinner = scopeSelector(scopeClass, ".ccs-send-spinner");
  const sendIcon = scopeSelector(scopeClass, ".ccs-send-icon");
  const visuallyHidden = scopeSelector(scopeClass, ".ccs-visually-hidden");
  const emptyState = scopeSelector(scopeClass, ".ccs-empty");
  const landscapeGrid = scopeSelector(scopeClass, ".ccs-landscape-grid");
  const landscapeMain = scopeSelector(scopeClass, ".ccs-landscape-main");
  const landscapeBody = scopeSelector(scopeClass, ".ccs-layout-landscape .ccs-body");
  const landscapeActionGroup = scopeSelector(scopeClass, ".ccs-layout-landscape .ccs-action-group");
  const sidePanel = scopeSelector(scopeClass, ".ccs-side-panel");
  const sideTitle = scopeSelector(scopeClass, ".ccs-side-title");
  const sideCopy = scopeSelector(scopeClass, ".ccs-side-copy");
  const sideCard = scopeSelector(scopeClass, ".ccs-side-card");
  const sideStrong = scopeSelector(scopeClass, ".ccs-side-strong");
  const sideLabel = scopeSelector(scopeClass, ".ccs-side-label");
  const sideRow = scopeSelector(scopeClass, ".ccs-side-row");
  const sideInput = scopeSelector(scopeClass, ".ccs-side-input");
  const sideHint = scopeSelector(scopeClass, ".ccs-side-hint");
  const sideStatus = scopeSelector(scopeClass, ".ccs-side-status");
  const sideStatusError = scopeSelector(scopeClass, ".ccs-side-status.ccs-side-status-error");
  const sideStatusSuccess = scopeSelector(
    scopeClass,
    ".ccs-side-status.ccs-side-status-success"
  );
  const sideActions = scopeSelector(scopeClass, ".ccs-side-actions");
  const sideButton = scopeSelector(scopeClass, ".ccs-side-button");
  const sideButtonPrimary = scopeSelector(scopeClass, ".ccs-side-button.ccs-side-button-primary");

  return `
${root} {
  --ccs-color-surface: #ffffff;
  --ccs-color-panel: #fafafa;
  --ccs-color-primary: #4b5563;
  --ccs-color-text: #333333;
  --ccs-color-muted-text: #666666;
  --ccs-color-border: #dddddd;
  --ccs-border-radius: 16px;
  --ccs-spacing: 12px;
  --ccs-widget-width: 400px;
  --ccs-widget-height: 640px;
  --ccs-widget-width-landscape: 860px;
  --ccs-widget-height-landscape: 540px;
  --ccs-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
  border-radius: var(--ccs-border-radius);
  box-shadow: var(--ccs-shadow);
  color: var(--ccs-color-text);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  transform: translateY(0);
  transition: transform 0.3s ease-in-out, opacity 0.3s;
}

${shellOpen} {
  opacity: 1;
  transform: translateY(0);
}

${shellClosed} {
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
}

${toggle} {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: var(--ccs-color-primary);
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
}

${toggleHidden} {
  display: none;
}

${teaser} {
  width: min(260px, 90vw);
  background: var(--ccs-color-surface);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  padding: 14px 16px 12px;
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
  color: #999999;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  position: absolute;
  right: 10px;
  top: 8px;
}

${teaserClose}:hover {
  color: var(--ccs-color-text);
}

${header} {
  align-items: center;
  border-bottom: 1px solid var(--ccs-color-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  min-height: 72px;
  padding: var(--ccs-spacing) calc(var(--ccs-spacing) + 4px);
}

${title} {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

${headerControls} {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

${headerActions} {
  align-items: center;
  border: 1.5px solid var(--ccs-color-primary);
  border-radius: 20px;
  display: inline-flex;
  overflow: hidden;
}

${headerActionsDivider} {
  border-left: 1.5px solid var(--ccs-color-primary);
}

${modeToggle} {
  align-items: center;
  background: #ffffff;
  border: 1.5px solid var(--ccs-color-primary);
  border-radius: 20px;
  display: inline-flex;
  overflow: hidden;
}

${modeButton} {
  background: #ffffff;
  border: 0;
  color: var(--ccs-color-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  height: 28px;
  line-height: 1;
  padding: 0 10px;
  transition: background 0.15s ease, color 0.15s ease;
  user-select: none;
}

${modeButtonDivider} {
  border-left: 1.5px solid var(--ccs-color-primary);
}

${modeButton}[aria-pressed="true"] {
  background: var(--ccs-color-primary);
  color: #ffffff;
}

${modeButton}:not([aria-pressed="true"]):hover {
  background: var(--ccs-color-primary);
  color: #ffffff;
}

${iconButton} {
  align-items: center;
  background: #ffffff;
  border: 0;
  color: var(--ccs-color-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 15px;
  height: 28px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: background 0.15s ease, color 0.15s ease;
  user-select: none;
  width: 32px;
}

${iconButton}:hover {
  background: var(--ccs-color-primary);
  color: #ffffff;
}

${iconButton}:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ccs-color-primary) 55%, #ffffff 45%);
  outline-offset: 1px;
}

${body} {
  background: var(--ccs-color-panel);
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--ccs-spacing);
  min-height: 0;
  overflow-y: auto;
  padding: calc(var(--ccs-spacing) + 6px) calc(var(--ccs-spacing) + 4px);
}

${message} {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 80%;
}

${bubble} {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: var(--ccs-color-text);
  line-height: 1.4;
  max-width: 100%;
  padding: 14px 16px;
}

${bubbleMarkdown} p {
  margin: 0 0 8px;
}

${bubbleMarkdown} p:last-child {
  margin-bottom: 0;
}

${bubbleMarkdown} ul {
  margin: 4px 0 8px;
  padding-left: 18px;
}

${bubbleMarkdown} li {
  margin-bottom: 4px;
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
  background: color-mix(in srgb, var(--ccs-color-panel) 70%, #e0e0e0 30%);
  color: var(--ccs-color-text);
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
  align-items: center;
  min-height: 14px;
}

${metaTime} {
  color: #aaaaaa;
  font-size: 11px;
}

${assistantActions} {
  align-items: center;
  display: flex;
  gap: 8px;
  margin-top: 4px;
  padding-left: 2px;
}

${assistantActionButton} {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: #999999;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  height: 24px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: color 0.16s ease;
  user-select: none;
  width: 24px;
}

${assistantActionIcon} {
  fill: none;
  height: 13px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  width: 13px;
}

${assistantActionButton}:hover {
  color: var(--ccs-color-primary);
}

${assistantActionButton}:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ccs-color-primary) 45%, #ffffff 55%);
  outline-offset: 1px;
}

${assistantActionButtonActive} {
  color: var(--ccs-color-primary);
}

${actionGroup} {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
}

${actionButton} {
  background: var(--ccs-color-primary);
  border: 0;
  border-radius: 20px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  min-width: 130px;
  padding: 8px 18px;
  text-align: center;
  transition: background 0.2s ease, opacity 0.2s ease;
}

${actionButton}:hover {
  background: color-mix(in srgb, var(--ccs-color-primary) 86%, #000000 14%);
}

${thinking} {
  align-items: center;
  display: flex;
  gap: 10px;
  margin: 0 0 12px;
  padding: 2px 0;
}

${thinkingText} {
  color: #c0c0c0;
  display: inline-flex;
  gap: 5px;
  font-size: 13px;
  font-style: italic;
  user-select: none;
}

${thinkingDots} {
  animation: ccs-thinking-dot 1.5s infinite ease-in-out;
  background: #c8c8c8;
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
  background: #ffffff;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  padding: calc(var(--ccs-spacing) - 2px) calc(var(--ccs-spacing) + 4px) calc(var(--ccs-spacing) - 4px);
}

${footerInputRow} {
  align-items: center;
  display: flex;
  gap: 8px;
  width: 100%;
}

${input} {
  background: #ffffff;
  border: 1px solid var(--ccs-color-primary);
  border-radius: 22px;
  box-sizing: border-box;
  color: var(--ccs-color-text);
  flex: 1;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  max-height: 120px;
  min-height: 40px;
  min-width: 0;
  outline: none;
  overflow-y: hidden;
  padding: 10px 14px;
  resize: none;
  transition: height 0.1s ease;
}

${input}::placeholder {
  color: #aaaaaa;
}

${input}:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ccs-color-primary) 36%, #ffffff 64%);
  outline-offset: 1px;
}

${input}:disabled {
  background: color-mix(in srgb, var(--ccs-color-panel) 80%, #ffffff 20%);
  cursor: not-allowed;
}

${send} {
  background: var(--ccs-color-primary);
  border: 0;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  font-size: 16px;
  height: 38px;
  justify-content: center;
  padding: 0;
  width: 38px;
}

${send}:disabled {
  cursor: default;
  opacity: 0.55;
}

${sendIcon} {
  font-size: 16px;
  line-height: 1;
}

${sendSpinner} {
  animation: ccs-send-spin 0.7s linear infinite;
  border: 2px solid rgba(255, 255, 255, 0.36);
  border-radius: 50%;
  border-top-color: #ffffff;
  display: inline-block;
  height: 14px;
  width: 14px;
}

${sendLoading} {
  pointer-events: none;
}

@keyframes ccs-send-spin {
  to {
    transform: rotate(360deg);
  }
}

${visuallyHidden} {
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

${landscapeGrid} {
  flex: 1;
  display: flex;
  min-height: 0;
}

${landscapeMain} {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

${sidePanel} {
  background: #f5f5f5;
  border-left: 1px solid #e2e2e2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 14px;
  width: 250px;
}

${sideTitle} {
  color: var(--ccs-color-text);
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

${sideCopy} {
  color: #555555;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

${sideCard} {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
}

${sideStrong} {
  color: var(--ccs-color-text);
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}

${sideLabel} {
  color: var(--ccs-color-text);
  font-size: 12px;
  font-weight: 600;
}

${sideRow},
${sideActions} {
  display: flex;
  gap: 8px;
}

${sideInput} {
  background: #ffffff;
  border: 1px solid #d7d7d7;
  border-radius: 8px;
  box-sizing: border-box;
  color: #333333;
  flex: 1;
  font-family: inherit;
  font-size: 12px;
  padding: 8px 9px;
  width: 100%;
}

${sideHint} {
  color: #777777;
  font-size: 11px;
  line-height: 1.35;
  margin: 0;
}

${sideStatus} {
  color: #666666;
  font-size: 11px;
  margin: 0;
  min-height: 16px;
}

${sideStatusError} {
  color: #a3002c;
}

${sideStatusSuccess} {
  color: #1e7a37;
}

${sideButton} {
  background: #dddddd;
  border: 0;
  border-radius: 8px;
  color: #666666;
  cursor: pointer;
  font-size: 13px;
  padding: 10px 12px;
}

${sideButton}:disabled {
  cursor: default;
  opacity: 0.65;
}

${sideButtonPrimary} {
  background: var(--ccs-color-primary);
  color: #ffffff;
}

${landscapeBody} {
  padding: 14px;
}

${landscapeActionGroup} {
  justify-content: flex-start;
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

${scopeSelector(scopeClass, ".ccs-toggle.ccs-pos-top-left")} {
  top: 30px;
  right: auto;
  bottom: auto;
  left: 30px;
  transform: none;
}

${scopeSelector(scopeClass, ".ccs-toggle.ccs-pos-top-center")} {
  top: 30px;
  right: auto;
  bottom: auto;
  left: 50%;
  transform: translateX(-50%);
}

${scopeSelector(scopeClass, ".ccs-toggle.ccs-pos-top-right")} {
  top: 30px;
  right: 30px;
  bottom: auto;
  left: auto;
  transform: none;
}

${scopeSelector(scopeClass, ".ccs-toggle.ccs-pos-bottom-left")} {
  top: auto;
  right: auto;
  bottom: 30px;
  left: 30px;
  transform: none;
}

${scopeSelector(scopeClass, ".ccs-toggle.ccs-pos-bottom-center")} {
  top: auto;
  right: auto;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}

${scopeSelector(scopeClass, ".ccs-toggle.ccs-pos-bottom-right")} {
  top: auto;
  right: 30px;
  bottom: 30px;
  left: auto;
  transform: none;
}

${scopeSelector(scopeClass, ".ccs-toggle.ccs-pos-middle-left")} {
  top: 50%;
  right: auto;
  bottom: auto;
  left: 30px;
  transform: translateY(-50%);
}

${scopeSelector(scopeClass, ".ccs-toggle.ccs-pos-middle-right")} {
  top: 50%;
  right: 30px;
  bottom: auto;
  left: auto;
  transform: translateY(-50%);
}

${scopeSelector(scopeClass, ".ccs-teaser.ccs-pos-top-left")} {
  top: 100px;
  right: auto;
  bottom: auto;
  left: 20px;
  transform: translateY(0);
}

${scopeSelector(scopeClass, ".ccs-teaser.ccs-pos-top-center")} {
  top: 100px;
  right: auto;
  bottom: auto;
  left: 50%;
  transform: translateX(-50%);
}

${scopeSelector(scopeClass, ".ccs-teaser.ccs-pos-top-right")} {
  top: 100px;
  right: 20px;
  bottom: auto;
  left: auto;
  transform: translateY(0);
}

${scopeSelector(scopeClass, ".ccs-teaser.ccs-pos-bottom-left")} {
  top: auto;
  right: auto;
  bottom: 100px;
  left: 20px;
  transform: translateY(0);
}

${scopeSelector(scopeClass, ".ccs-teaser.ccs-pos-bottom-center")} {
  top: auto;
  right: auto;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
}

${scopeSelector(scopeClass, ".ccs-teaser.ccs-pos-bottom-right")} {
  top: auto;
  right: 20px;
  bottom: 100px;
  left: auto;
  transform: translateY(0);
}

${scopeSelector(scopeClass, ".ccs-teaser.ccs-pos-middle-left")} {
  top: 50%;
  right: auto;
  bottom: auto;
  left: 20px;
  transform: translateY(-50%);
}

${scopeSelector(scopeClass, ".ccs-teaser.ccs-pos-middle-right")} {
  top: 50%;
  right: 20px;
  bottom: auto;
  left: auto;
  transform: translateY(-50%);
}

${landscapeShell} {
  width: var(--ccs-widget-width-landscape);
  height: var(--ccs-widget-height-landscape);
  border-radius: 14px;
}

@media (max-width: 980px) {
  ${landscapeShell} {
    height: min(var(--ccs-widget-height-landscape), 86vh);
    width: min(var(--ccs-widget-width-landscape), 96vw);
  }

  ${sidePanel} {
    width: 210px;
  }

  ${sideRow},
  ${sideActions} {
    flex-direction: column;
  }
}

@media (max-width: 820px) {
  ${normalShell} {
    height: min(var(--ccs-widget-height), 86vh);
    width: min(var(--ccs-widget-width), 95vw);
  }
}
`;
}

export function applyThemeTokens(root: HTMLElement, tokens: ThemeTokens, fontFamilies: string[]): void {
  const variables: Record<string, string> = {
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
