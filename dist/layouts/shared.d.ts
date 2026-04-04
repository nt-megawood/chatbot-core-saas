import type { AssistantMessageActionState, I18nMessages, Message, RenderHooksConfig, WidgetMode } from "../types.js";
export interface LayoutRenderState {
    mode: WidgetMode;
    conversationId: string | null;
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
    assistantActionStateByMessageId: Readonly<Record<string, AssistantMessageActionState | undefined>>;
    isThinking: boolean;
    thinkingText: string;
    isInputDisabled: boolean;
    isSendLoading: boolean;
    landscapePanelContent: string | null;
    labels: I18nMessages;
    renderHooks: RenderHooksConfig;
}
export declare function renderWidgetLayout(state: LayoutRenderState): string;
//# sourceMappingURL=shared.d.ts.map