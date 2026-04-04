import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatbotWidgetCore } from "../src/ChatbotWidgetCore";
import type { ChatTransport } from "../src/types";

function getMount(): HTMLElement {
  const mount = document.getElementById("mount");
  if (!(mount instanceof HTMLElement)) {
    throw new Error("Mount element not found.");
  }

  return mount;
}

describe("ChatbotWidgetCore render hook extensions", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id='mount'></div>";
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("keeps default rendering behavior when render hooks are not provided", () => {
    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      initiallyOpen: true,
      useShadowDom: false,
      teaser: {
        enabled: false
      }
    });

    const mount = getMount();
    widget.mount(mount);

    expect(mount.querySelector(".ccs-header .ccs-title")?.textContent?.trim()).toBe("Assistant");
    expect(mount.querySelector<HTMLButtonElement>("[data-toggle-open]")?.textContent).toContain("💬");
    expect(mount.querySelector(".ccs-meta-row .ccs-meta-time")).not.toBeNull();
    expect(mount.querySelector("[data-message-sources]")).toBeNull();
  });

  it("invokes custom render hooks and integrates rendered DOM sections", () => {
    vi.useFakeTimers();

    const renderHeader = vi.fn(
      () =>
        '<header class="ccs-header custom-header"><button type="button" data-refresh-chat>R</button><button type="button" data-close-chat>X</button></header>'
    );
    const renderToggle = vi.fn(
      () => '<button type="button" class="ccs-toggle custom-toggle" data-toggle-open>Open</button>'
    );
    const renderTeaser = vi.fn(
      () =>
        '<section class="ccs-teaser custom-teaser" data-teaser><button type="button" data-dismiss-teaser>Dismiss</button><button type="button" data-open-from-teaser>Open</button></section>'
    );
    const renderMessageMeta = vi.fn(
      ({ message }) => `<span class="custom-message-meta" data-message-meta="${message.id}">meta</span>`
    );
    const renderMessageFooter = vi.fn(
      ({ message }) =>
        `<div class="custom-message-footer" data-message-footer="${message.id}">footer</div>`
    );
    const renderFooterMeta = vi.fn(
      ({ conversationId }) =>
        `<div class="custom-footer-meta">${conversationId ?? "no-conversation"}</div>`
    );
    const renderInputCard = vi.fn(
      ({ latestAssistantMessage }) =>
        `<div class="custom-input-card">${latestAssistantMessage?.id ?? "no-message"}</div>`
    );
    const bind = vi.fn(({ rootElement }) => {
      rootElement.setAttribute("data-render-hooks-bound", "true");
    });

    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      initiallyOpen: false,
      useShadowDom: false,
      teaser: {
        enabled: true,
        delayMs: 0
      },
      storage: {
        enabled: false
      },
      renderHooks: {
        renderHeader,
        renderToggle,
        renderTeaser,
        renderMessageMeta,
        renderMessageFooter,
        renderFooterMeta,
        renderInputCard,
        bind
      }
    });

    const mount = getMount();
    widget.mount(mount);

    expect(renderHeader).toHaveBeenCalled();
    expect(renderToggle).toHaveBeenCalled();
    expect(renderMessageMeta).toHaveBeenCalled();
    expect(renderMessageFooter).toHaveBeenCalled();
    expect(renderFooterMeta).toHaveBeenCalled();
    expect(renderInputCard).toHaveBeenCalled();
    expect(bind).toHaveBeenCalled();

    expect(mount.querySelector(".custom-header")).not.toBeNull();
    expect(mount.querySelector(".custom-toggle")).not.toBeNull();
    expect(mount.querySelector(".custom-message-meta")).not.toBeNull();
    expect(mount.querySelector(".custom-message-footer")).not.toBeNull();
    expect(mount.querySelector(".custom-footer-meta")).not.toBeNull();
    expect(mount.querySelector(".custom-input-card")).not.toBeNull();
    expect(mount.querySelector(".ccs-root")?.getAttribute("data-render-hooks-bound")).toBe("true");

    vi.advanceTimersByTime(1);

    expect(renderTeaser).toHaveBeenCalled();
    expect(mount.querySelector(".custom-teaser")).not.toBeNull();
  });

  it("renders source links from assistant message metadata", async () => {
    const transport: ChatTransport = {
      sendMessage: async (_request, handlers) => {
        handlers.onChunk("Response with citations");
        handlers.onComplete({
          metadata: {
            sources: [
              "https://example.test/a",
              {
                url: "https://example.test/b",
                label: "Doc B"
              },
              {
                href: "javascript:alert(1)",
                label: "invalid"
              }
            ]
          }
        });
      }
    };

    const widget = new ChatbotWidgetCore(
      {
        mode: "normal",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        initiallyOpen: true,
        useShadowDom: false,
        teaser: {
          enabled: false
        }
      },
      {
        transport
      }
    );

    const mount = getMount();
    widget.mount(mount);
    await widget.sendMessage("show sources");

    const sourceContainer = mount.querySelector("[data-message-sources]");
    expect(sourceContainer).not.toBeNull();

    const links = Array.from(sourceContainer?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute("href")).toBe("https://example.test/a");
    expect(links[0]?.textContent).toBe("https://example.test/a");
    expect(links[1]?.getAttribute("href")).toBe("https://example.test/b");
    expect(links[1]?.textContent).toBe("Doc B");
  });
});
