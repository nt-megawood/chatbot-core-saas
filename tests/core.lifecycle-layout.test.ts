import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatbotWidgetCore } from "../src/ChatbotWidgetCore";
import { MockChatTransport } from "../src/mock/mockTransport";

describe("ChatbotWidgetCore lifecycle and layout", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id='mount'></div>";
  });

  it("fires required lifecycle hooks and rerenders on mode switch", async () => {
    const onInitialize = vi.fn();
    const onMessageSent = vi.fn();
    const onStreamUpdate = vi.fn();
    const onToggleLayout = vi.fn();

    const widget = new ChatbotWidgetCore(
      {
        mode: "normal",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        allowRuntimeModeSwitch: true,
        useShadowDom: false,
        lifecycle: {
          onInitialize,
          onMessageSent,
          onStreamUpdate,
          onToggleLayout
        }
      },
      {
        transport: new MockChatTransport({
          latencyMs: 0,
          chunkSize: 4,
          responsePrefix: "Echo: "
        })
      }
    );

    const mount = document.getElementById("mount");
    if (!(mount instanceof HTMLElement)) {
      throw new Error("Mount element not found.");
    }

    widget.mount(mount);
    expect(onInitialize).toHaveBeenCalledTimes(1);
    const initializeEvent = onInitialize.mock.calls[0]?.[0] as {
      mode: string;
      welcomeMessage: { id: string; role: string; text: string; createdAt: number };
      timestamp: number;
      config: object;
    };
    expect(initializeEvent).toEqual(
      expect.objectContaining({
        mode: "normal",
        timestamp: expect.any(Number),
        config: expect.any(Object),
        welcomeMessage: expect.objectContaining({
          id: expect.any(String),
          role: "assistant",
          text: expect.any(String),
          createdAt: expect.any(Number)
        })
      })
    );
    expect(mount.querySelector(".ccs-layout-normal")).not.toBeNull();

    await widget.sendMessage("hello from test");

    expect(onMessageSent).toHaveBeenCalledTimes(1);
    const messageSentEvent = onMessageSent.mock.calls[0]?.[0] as {
      mode: string;
      message: { id: string; role: string; text: string; createdAt: number };
      timestamp: number;
    };
    expect(messageSentEvent).toEqual(
      expect.objectContaining({
        mode: "normal",
        timestamp: expect.any(Number),
        message: expect.objectContaining({
          id: expect.any(String),
          role: "user",
          text: "hello from test",
          createdAt: expect.any(Number)
        })
      })
    );

    expect(onStreamUpdate).toHaveBeenCalled();
    const streamEvents = onStreamUpdate.mock.calls.map((call) =>
      call[0] as {
        messageId: string;
        chunk: string;
        accumulatedText: string;
        isFinal: boolean;
        timestamp: number;
      }
    );
    expect(streamEvents[0]).toEqual(
      expect.objectContaining({
        messageId: expect.any(String),
        chunk: expect.any(String),
        accumulatedText: expect.any(String),
        isFinal: expect.any(Boolean),
        timestamp: expect.any(Number)
      })
    );
    const lastStreamEvent = streamEvents[streamEvents.length - 1];
    expect(lastStreamEvent).toEqual(
      expect.objectContaining({
        messageId: expect.any(String),
        chunk: "",
        accumulatedText: expect.any(String),
        isFinal: true,
        timestamp: expect.any(Number)
      })
    );

    widget.setMode("landscape");
    expect(onToggleLayout).toHaveBeenCalledTimes(1);
    expect(onToggleLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        previousMode: "normal",
        nextMode: "landscape",
        timestamp: expect.any(Number)
      })
    );
    expect(mount.querySelector(".ccs-layout-landscape")).not.toBeNull();
  });

  it("supports UI mode switching and binds custom landscape panel content", () => {
    const bindSpy = vi.fn();
    const cleanupSpy = vi.fn();

    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      allowRuntimeModeSwitch: true,
      useShadowDom: false,
      storage: {
        enabled: false
      },
      landscapePanel: {
        render: () => '<button type="button" data-panel-action>Panel action</button>',
        bind: ({ panelElement }) => {
          bindSpy();
          const actionButton = panelElement.querySelector<HTMLButtonElement>("[data-panel-action]");
          actionButton?.addEventListener("click", () => {
            panelElement.setAttribute("data-panel-clicked", "true");
          });

          return cleanupSpy;
        }
      }
    });

    const mount = document.getElementById("mount");
    if (!(mount instanceof HTMLElement)) {
      throw new Error("Mount element not found.");
    }

    widget.mount(mount);

    const landscapeModeButton = mount.querySelector<HTMLButtonElement>('[data-set-mode="landscape"]');
    expect(landscapeModeButton).not.toBeNull();

    landscapeModeButton?.click();

    expect(widget.getMode()).toBe("landscape");
    expect(mount.querySelector(".ccs-layout-landscape")).not.toBeNull();
    expect(bindSpy).toHaveBeenCalledTimes(1);

    const panelElement = mount.querySelector<HTMLElement>("[data-landscape-panel]");
    expect(panelElement).not.toBeNull();

    panelElement?.querySelector<HTMLButtonElement>("[data-panel-action]")?.click();
    expect(panelElement?.getAttribute("data-panel-clicked")).toBe("true");

    const normalModeButton = mount.querySelector<HTMLButtonElement>('[data-set-mode="normal"]');
    expect(normalModeButton).not.toBeNull();
    normalModeButton?.click();

    expect(widget.getMode()).toBe("normal");
    expect(mount.querySelector(".ccs-layout-normal")).not.toBeNull();
    expect(mount.querySelector("[data-landscape-panel]")).toBeNull();
    expect(cleanupSpy).toHaveBeenCalledTimes(1);
  });

  it("blocks mode changes when runtime mode switching is disabled", () => {
    const onToggleLayout = vi.fn();

    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      allowRuntimeModeSwitch: false,
      useShadowDom: false,
      storage: {
        enabled: false
      },
      lifecycle: {
        onToggleLayout
      }
    });

    const mount = document.getElementById("mount");
    if (!(mount instanceof HTMLElement)) {
      throw new Error("Mount element not found.");
    }

    widget.mount(mount);

    expect(widget.getMode()).toBe("normal");
    expect(mount.querySelector(".ccs-layout-normal")).not.toBeNull();
    expect(mount.querySelector(".ccs-layout-landscape")).toBeNull();

    const landscapeModeButton = mount.querySelector<HTMLButtonElement>('[data-set-mode="landscape"]');
    expect(landscapeModeButton).toBeNull();
    landscapeModeButton?.click();

    expect(widget.getMode()).toBe("normal");
    expect(mount.querySelector(".ccs-layout-normal")).not.toBeNull();
    expect(mount.querySelector(".ccs-layout-landscape")).toBeNull();

    expect(() => widget.setMode("landscape")).not.toThrow();

    expect(widget.getMode()).toBe("normal");
    expect(mount.querySelector(".ccs-layout-normal")).not.toBeNull();
    expect(mount.querySelector(".ccs-layout-landscape")).toBeNull();
    expect(onToggleLayout).not.toHaveBeenCalled();
  });

  it("uses shadow DOM as the primary render path when enabled", () => {
    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      useShadowDom: true
    });

    const mount = document.getElementById("mount");
    if (!(mount instanceof HTMLElement)) {
      throw new Error("Mount element not found.");
    }

    expect(typeof mount.attachShadow).toBe("function");

    widget.mount(mount);

    expect(mount.shadowRoot).not.toBeNull();
    expect(mount.shadowRoot?.querySelector(".ccs-root")).not.toBeNull();
    expect(mount.querySelector(".ccs-root")).toBeNull();
  });

  it("uses fallback welcome message resolver", () => {
    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      useShadowDom: false
    });

    const mount = document.getElementById("mount");
    if (!(mount instanceof HTMLElement)) {
      throw new Error("Mount element not found.");
    }

    widget.mount(mount);
    const firstMessage = widget.getMessages()[0];

    expect(firstMessage?.role).toBe("assistant");
    expect(firstMessage?.text.length).toBeGreaterThan(0);
  });
});
