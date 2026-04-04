import { describe, expect, it } from "vitest";
import { ChatbotWidgetCore } from "../src/ChatbotWidgetCore";

describe("ChatbotWidgetCore standalone mock operation", () => {
  it("runs independently with built-in mock transport", async () => {
    document.body.innerHTML = "<div id='target'></div>";

    const mount = document.getElementById("target");
    if (!(mount instanceof HTMLElement)) {
      throw new Error("Target mount element not found.");
    }

    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "http://localhost:4010/mock-api",
      socketUrl: "ws://localhost:4020/mock-socket",
      useShadowDom: false,
      resolveWelcomeMessage: () => "Standalone welcome"
    });

    widget.mount(mount);
    await widget.sendMessage("Can this run standalone?");

    const assistantMessages = widget
      .getMessages()
      .filter((message) => message.role === "assistant")
      .map((message) => message.text);

    expect(assistantMessages.some((text) => text.includes("Standalone welcome"))).toBe(true);
    expect(
      assistantMessages.some((text) => text.includes("Can this run standalone?"))
    ).toBe(true);
  });
});
