import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatbotWidgetCore } from "../src/ChatbotWidgetCore";
import { MockChatTransport } from "../src/mock/mockTransport";
import type { ChatTransport, ConversationSnapshot, ConversationStore, PresenceAdapter } from "../src/types";

function getMount(): HTMLElement {
  const mount = document.getElementById("mount");
  if (!(mount instanceof HTMLElement)) {
    throw new Error("Mount element not found.");
  }
  return mount;
}

describe("ChatbotWidgetCore parity behavior", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id='mount'></div>";
    localStorage.clear();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("supports toggle open/close and preserves messages across unmount/mount", async () => {
    const widget = new ChatbotWidgetCore(
      {
        mode: "normal",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        initiallyOpen: false,
        useShadowDom: false,
        teaser: {
          enabled: false
        }
      },
      {
        transport: new MockChatTransport({
          chunkSize: 32,
          responsePrefix: "Echo: "
        })
      }
    );

    const mount = getMount();
    widget.mount(mount);

    expect(widget.isWidgetOpen()).toBe(false);

    const toggle = mount.querySelector<HTMLButtonElement>("[data-toggle-open]");
    if (!toggle) {
      throw new Error("Toggle button not rendered.");
    }

    toggle.click();
    expect(widget.isWidgetOpen()).toBe(true);

    await widget.sendMessage("Hello parity");
    const messageCount = widget.getMessages().length;

    widget.unmount();
    widget.mount(mount);

    expect(widget.isWidgetOpen()).toBe(true);
    expect(widget.getMessages().length).toBe(messageCount);

    widget.close();
    expect(widget.isWidgetOpen()).toBe(false);

    widget.open();
    expect(widget.isWidgetOpen()).toBe(true);
  });

  it("shows teaser on delay when closed and opens from teaser", () => {
    vi.useFakeTimers();

    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      initiallyOpen: false,
      useShadowDom: false,
      teaser: {
        enabled: true,
        delayMs: 80,
        title: "Need help?",
        text: "Ask anything"
      }
    });

    const mount = getMount();
    widget.mount(mount);

    expect(mount.querySelector("[data-teaser]")).toBeNull();

    vi.advanceTimersByTime(81);

    const teaser = mount.querySelector("[data-teaser]");
    expect(teaser).not.toBeNull();

    const openFromTeaser = mount.querySelector<HTMLButtonElement>("[data-open-from-teaser]");
    if (!openFromTeaser) {
      throw new Error("Teaser open button not found.");
    }

    openFromTeaser.click();
    expect(widget.isWidgetOpen()).toBe(true);
    expect(mount.querySelector("[data-teaser]")).toBeNull();
  });

  it("emits parity style geometry and neutral default theme tokens", () => {
    const widget = new ChatbotWidgetCore({
      mode: "landscape",
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

    const styleText = mount.querySelector("style")?.textContent ?? "";

    expect(styleText).toMatch(/--ccs-widget-width:\s*400px;/);
    expect(styleText).toMatch(/--ccs-widget-height:\s*640px;/);
    expect(styleText).toMatch(/--ccs-widget-width-landscape:\s*860px;/);
    expect(styleText).toMatch(/--ccs-widget-height-landscape:\s*540px;/);

    expect(styleText).toMatch(/\.ccs-layout-landscape \.ccs-shell\s*\{[\s\S]*?border-radius:\s*14px;/);
    expect(styleText).toMatch(/\.ccs-assistant-action-btn\s*\{[\s\S]*?background:\s*transparent;/);
    expect(styleText).toMatch(/\.ccs-assistant-action-btn\s*\{[\s\S]*?border:\s*0;/);
    expect(styleText).toMatch(/\.ccs-input\s*\{[\s\S]*?min-height:\s*40px;/);
    expect(styleText).toMatch(/\.ccs-send\s*\{[\s\S]*?width:\s*38px;/);
    expect(styleText).toMatch(/\.ccs-toggle\.ccs-pos-bottom-right\s*\{[\s\S]*?bottom:\s*30px;/);
    expect(styleText).toMatch(/\.ccs-teaser\.ccs-pos-bottom-right\s*\{[\s\S]*?bottom:\s*100px;/);

    expect(mount.querySelector(".ccs-header-actions")).not.toBeNull();
    expect(mount.querySelectorAll(".ccs-header-actions .ccs-icon-btn")).toHaveLength(2);

    const root = mount.querySelector<HTMLElement>(".ccs-root");
    if (!root) {
      throw new Error("Widget root not rendered.");
    }

    expect(root.style.getPropertyValue("--ccs-color-primary").trim().toLowerCase()).toBe("#4b5563");
    expect(root.style.getPropertyValue("--ccs-color-panel").trim().toLowerCase()).toBe("#f5f5f5");
    expect(root.style.getPropertyValue("--ccs-border-radius").trim()).toBe("14px");
    expect(root.style.getPropertyValue("--ccs-color-primary").trim().toLowerCase()).not.toBe(
      "#b4032f"
    );
  });

  it("renders markdown, shows thinking indicator, and executes message actions", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null as unknown as Window);

    const delayedTransport: ChatTransport = {
      sendMessage: async (_request, handlers) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });
        handlers.onChunk("**Answer**\n- First\nhttps://example.test");
        handlers.onComplete({
          actions: [
            {
              label: "Open Docs",
              type: "open_url",
              url: "https://example.test/docs"
            }
          ]
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
        transport: delayedTransport
      }
    );

    const mount = getMount();
    widget.mount(mount);

    const pendingSend = widget.sendMessage("Show enhanced output");
    expect(mount.querySelector(".ccs-thinking")).not.toBeNull();
    expect(mount.querySelector<HTMLTextAreaElement>("[data-chat-input]")?.disabled).toBe(true);
    expect(mount.querySelector<HTMLButtonElement>(".ccs-send")?.disabled).toBe(true);

    await pendingSend;

    const strong = mount.querySelector(".ccs-bubble-markdown strong");
    expect(strong?.textContent).toBe("Answer");
    expect(mount.querySelector('.ccs-bubble-markdown a[href="https://example.test"]')).not.toBeNull();
    expect(mount.querySelector(".ccs-thinking")).toBeNull();
    expect(mount.querySelector<HTMLTextAreaElement>("[data-chat-input]")?.disabled).toBe(false);
    expect(mount.querySelector<HTMLButtonElement>(".ccs-send")?.disabled).toBe(false);
    expect(mount.querySelectorAll("[data-assistant-action]").length).toBeGreaterThan(0);

    const actionButton = Array.from(mount.querySelectorAll<HTMLButtonElement>(".ccs-action-btn")).find(
      (button) => button.textContent?.trim() === "Open Docs"
    );

    expect(actionButton).toBeDefined();
    actionButton?.click();

    expect(openSpy).toHaveBeenCalledWith(
      "https://example.test/docs",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("emits typed assistant action hooks and toggles toolbar action states", async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: clipboardWriteText
      },
      configurable: true
    });

    const onAssistantActionInvoked = vi.fn();
    const assistantAction = vi.fn();

    const widget = new ChatbotWidgetCore(
      {
        mode: "normal",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        initiallyOpen: true,
        useShadowDom: false,
        teaser: {
          enabled: false
        },
        lifecycle: {
          onAssistantActionInvoked
        },
        actionHandlers: {
          assistantAction
        }
      },
      {
        transport: new MockChatTransport()
      }
    );

    const mount = getMount();
    widget.mount(mount);

    const clickToolbarButton = (actionType: "feedback_up" | "copy"): void => {
      const button = mount.querySelector<HTMLButtonElement>(`[data-assistant-action="${actionType}"]`);
      if (!button) {
        throw new Error(`Toolbar action button not found for ${actionType}.`);
      }
      button.click();
    };

    clickToolbarButton("feedback_up");
    expect(onAssistantActionInvoked).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "feedback_up"
      })
    );
    expect(assistantAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "feedback_up",
        state: expect.objectContaining({
          feedback: "up"
        })
      })
    );
    expect(
      mount
        .querySelector<HTMLButtonElement>("[data-assistant-action='feedback_up']")
        ?.getAttribute("aria-pressed")
    ).toBe("true");

    clickToolbarButton("copy");
    await Promise.resolve();
    await Promise.resolve();

    expect(clipboardWriteText).toHaveBeenCalled();
    expect(onAssistantActionInvoked).toHaveBeenCalledTimes(2);
    expect(onAssistantActionInvoked).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: "copy"
      })
    );
    expect(assistantAction).toHaveBeenLastCalledWith(
      expect.objectContaining({
        action: "copy",
        state: expect.objectContaining({
          copied: true
        })
      })
    );
  });

  it("hydrates and persists conversation through the storage abstraction", async () => {
    const persistedSnapshot: ConversationSnapshot = {
      conversationId: "conv-existing",
      mode: "normal",
      isOpen: true,
      teaserDismissed: true,
      updatedAt: Date.now(),
      messages: [
        {
          id: "stored-msg",
          role: "assistant",
          text: "Stored welcome back message",
          createdAt: Date.now(),
          state: "complete"
        }
      ]
    };

    const saveSpy = vi.fn();
    const store: ConversationStore = {
      load: vi.fn(() => persistedSnapshot),
      save: saveSpy,
      clear: vi.fn()
    };

    const widget = new ChatbotWidgetCore(
      {
        mode: "normal",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        useShadowDom: false,
        teaser: {
          enabled: false
        }
      },
      {
        transport: new MockChatTransport(),
        conversationStore: store
      }
    );

    const mount = getMount();
    widget.mount(mount);

    expect(widget.isWidgetOpen()).toBe(true);
    expect(widget.getConversationId()).toBe("conv-existing");
    expect(widget.getMessages().some((message) => message.text.includes("Stored welcome back message"))).toBe(
      true
    );

    await widget.sendMessage("Persist this");

    expect(saveSpy).toHaveBeenCalled();
    const latest = saveSpy.mock.calls[saveSpy.mock.calls.length - 1]?.[0] as ConversationSnapshot;
    expect(latest.conversationId).toBeTypeOf("string");
    expect(latest.messages.length).toBeGreaterThan(1);
  });

  it("polls presence adapter and appends reusable presence messages", async () => {
    const presenceAdapter: PresenceAdapter = {
      poll: vi
        .fn()
        .mockResolvedValueOnce({
          conversationId: "conv-presence",
          newMessages: [
            {
              id: "presence-msg-1",
              role: "assistant",
              text: "Presence sync message"
            }
          ]
        })
        .mockResolvedValue({
          conversationId: "conv-presence",
          newMessages: []
        })
    };

    const presenceSnapshot: ConversationSnapshot = {
      conversationId: "conv-presence",
      mode: "normal",
      isOpen: true,
      teaserDismissed: true,
      updatedAt: Date.now(),
      messages: []
    };

    const store: ConversationStore = {
      load: vi.fn(() => presenceSnapshot),
      save: vi.fn(),
      clear: vi.fn()
    };

    const widget = new ChatbotWidgetCore(
      {
        mode: "normal",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        useShadowDom: false,
        teaser: {
          enabled: false
        },
        presence: {
          enabled: true,
          intervalMs: 1_000,
          pauseWhenHidden: false,
          pollWhenClosed: true
        },
        initiallyOpen: true
      },
      {
        presenceAdapter,
        conversationStore: store
      }
    );

    const mount = getMount();
    widget.mount(mount);

    await Promise.resolve();
    await Promise.resolve();

    expect(presenceAdapter.poll).toHaveBeenCalled();
    expect(widget.getMessages().some((message) => message.text === "Presence sync message")).toBe(true);

    widget.unmount();
  });
});
