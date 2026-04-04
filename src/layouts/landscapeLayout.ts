import type { LayoutRenderState } from "./shared.js";
import { renderWidgetLayout } from "./shared.js";

export function renderLandscapeLayout(state: Omit<LayoutRenderState, "mode">): string {
  return renderWidgetLayout({
    ...state,
    mode: "landscape"
  });
}
