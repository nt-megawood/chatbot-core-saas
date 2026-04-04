import type { LayoutRenderState } from "./shared.js";
import { renderWidgetLayout } from "./shared.js";

export function renderNormalLayout(state: Omit<LayoutRenderState, "mode">): string {
  return renderWidgetLayout({
    ...state,
    mode: "normal"
  });
}
