import { describe, expect, it, vi } from "vitest";
import { ChatbotWidgetCore } from "../src/ChatbotWidgetCore";
import { MockChatTransport } from "../src/mock/mockTransport";

describe("ChatbotWidgetCore config merge", () => {
  it("merges defaults and init config with required precedence", () => {
    const onMessageSent = vi.fn();

    const widget = new ChatbotWidgetCore(
      {
        mode: "landscape",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        theme: {
          name: "init-theme",
          tokens: {
            colorPrimary: "#000099"
          },
          fontFamilies: ["Init Sans", "sans-serif"]
        },
        lifecycle: {
          onMessageSent
        }
      },
      {
        implementationThemeDefaults: {
          name: "implementation-theme",
          tokens: {
            colorPrimary: "#009900",
            spacing: "20px"
          },
          fontFamilies: ["Implementation Sans", "sans-serif"]
        },
        transport: new MockChatTransport()
      }
    );

    const config = widget.getConfig();

    expect(config.mode).toBe("landscape");
    expect(config.theme.name).toBe("init-theme");
    expect(config.theme.tokens.colorPrimary).toBe("#000099");
    expect(config.theme.tokens.spacing).toBe("20px");
    expect(config.theme.fontFamilies).toEqual(["Init Sans", "sans-serif"]);
    expect(config.lifecycle.onMessageSent).toBe(onMessageSent);
  });

  it("rejects unknown top-level keys", () => {
    expect(() => {
      new ChatbotWidgetCore({
        mode: "normal",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        unknownKey: "nope"
      } as unknown as any);
    }).toThrow(/Unknown key/);
  });

  it("returns an immutable finalized config", () => {
    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test"
    });

    const config = widget.getConfig();

    expect(Object.isFrozen(config)).toBe(true);
    expect(Object.isFrozen(config.theme)).toBe(true);
    expect(Object.isFrozen(config.theme.tokens)).toBe(true);

    expect(() => {
      (config.theme.tokens as { spacing: string }).spacing = "99px";
    }).toThrow();
  });
});
