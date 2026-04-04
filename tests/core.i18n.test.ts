import { beforeEach, describe, expect, it } from "vitest";
import { ChatbotWidgetCore } from "../src/ChatbotWidgetCore";

describe("ChatbotWidgetCore i18n", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id='mount'></div>";
    localStorage.clear();
  });

  it("renders built-in German labels when locale is de", () => {
    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      initiallyOpen: true,
      useShadowDom: false,
      allowRuntimeModeSwitch: true,
      teaser: {
        enabled: false
      },
      i18n: {
        locale: "de"
      }
    });

    const mount = document.getElementById("mount");
    if (!(mount instanceof HTMLElement)) {
      throw new Error("Mount element not found.");
    }

    widget.mount(mount);

    const closeButton = mount.querySelector<HTMLButtonElement>("[data-close-chat]");
    const refreshButton = mount.querySelector<HTMLButtonElement>("[data-refresh-chat]");
    const input = mount.querySelector<HTMLTextAreaElement>("[data-chat-input]");
    const sendButton = mount.querySelector<HTMLButtonElement>(".ccs-send");
    const feedbackUpButton = mount.querySelector<HTMLButtonElement>(
      '[data-assistant-action="feedback_up"]'
    );
    const modeButtons = Array.from(mount.querySelectorAll<HTMLButtonElement>("[data-set-mode]"));

    expect(closeButton?.title).toBe("Chat schliessen");
    expect(refreshButton?.title).toBe("Gespraech neu starten");
    expect(input?.getAttribute("aria-label")).toBe("Nachricht eingeben");
    expect(sendButton?.textContent).toContain("Senden");
    expect(feedbackUpButton?.getAttribute("aria-label")).toBe("Antwort als hilfreich markieren");
    expect(modeButtons.map((button) => button.textContent?.trim())).toEqual(["Standard", "Breit"]);
  });

  it("supports custom locale dictionaries", () => {
    const widget = new ChatbotWidgetCore({
      mode: "normal",
      apiEndpoint: "https://api.example.test",
      socketUrl: "wss://socket.example.test",
      initiallyOpen: false,
      useShadowDom: false,
      teaser: {
        enabled: false
      },
      i18n: {
        locale: "fr",
        customTranslations: {
          fr: {
            openChatAriaLabel: "Ouvrir le chat",
            sendMessageLabel: "Envoyer",
            sendMessageAriaLabel: "Envoyer un message"
          }
        }
      }
    });

    const mount = document.getElementById("mount");
    if (!(mount instanceof HTMLElement)) {
      throw new Error("Mount element not found.");
    }

    widget.mount(mount);

    const toggleButton = mount.querySelector<HTMLButtonElement>("[data-toggle-open]");
    const sendButton = mount.querySelector<HTMLButtonElement>(".ccs-send");

    expect(toggleButton?.getAttribute("aria-label")).toBe("Ouvrir le chat");
    expect(sendButton?.textContent).toContain("Envoyer");
    expect(sendButton?.getAttribute("aria-label")).toBe("Envoyer un message");
  });

  it("rejects unknown translation keys", () => {
    expect(() => {
      new ChatbotWidgetCore({
        mode: "normal",
        apiEndpoint: "https://api.example.test",
        socketUrl: "wss://socket.example.test",
        i18n: {
          customTranslations: {
            de: {
              unknownLabel: "nope"
            } as unknown as never
          }
        }
      });
    }).toThrow(/Unknown key/);
  });
});
