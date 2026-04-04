export const DEFAULT_LOCALE = "en";
const EN_MESSAGES = {
    layoutModeSelectorAriaLabel: "Layout mode selector",
    layoutModeNormalLabel: "Normal",
    layoutModeLandscapeLabel: "Landscape",
    messageActionsAriaLabel: "Message actions",
    assistantActionsAriaLabel: "Assistant message actions",
    assistantFeedbackUpAriaLabel: "Mark response as helpful",
    assistantFeedbackDownAriaLabel: "Mark response as not helpful",
    assistantCopyAriaLabel: "Copy response",
    assistantCopiedAriaLabel: "Response copied",
    assistantSpeakAriaLabel: "Read response aloud",
    assistantStopSpeakAriaLabel: "Stop reading response",
    emptyMessageListText: "No messages yet. Start the conversation below.",
    landscapeSidebarTitle: "Workspace",
    landscapeSidebarLine1: "Use quick actions from assistant replies to branch the flow faster.",
    landscapeSidebarLine2: "The chat transcript remains shared when you switch between supported modes.",
    teaserDismissAriaLabel: "Dismiss teaser",
    openChatAriaLabel: "Open chat",
    clearConversationTitle: "Clear conversation",
    closeChatTitle: "Close chat",
    inputAriaLabel: "Type a message",
    sendMessageAriaLabel: "Send message",
    sendMessageLabel: "Send"
};
const DE_MESSAGES = {
    layoutModeSelectorAriaLabel: "Layout-Auswahl",
    layoutModeNormalLabel: "Standard",
    layoutModeLandscapeLabel: "Breit",
    messageActionsAriaLabel: "Nachrichtenaktionen",
    assistantActionsAriaLabel: "Aktionen der Assistenten-Nachricht",
    assistantFeedbackUpAriaLabel: "Antwort als hilfreich markieren",
    assistantFeedbackDownAriaLabel: "Antwort als nicht hilfreich markieren",
    assistantCopyAriaLabel: "Antwort kopieren",
    assistantCopiedAriaLabel: "Antwort kopiert",
    assistantSpeakAriaLabel: "Antwort vorlesen",
    assistantStopSpeakAriaLabel: "Vorlesen stoppen",
    emptyMessageListText: "Noch keine Nachrichten. Starte die Unterhaltung unten.",
    landscapeSidebarTitle: "Arbeitsbereich",
    landscapeSidebarLine1: "Nutze schnelle Aktionen aus Antworten, um den Flow schneller zu steuern.",
    landscapeSidebarLine2: "Der Chatverlauf bleibt erhalten, wenn du das Layout wechselst.",
    teaserDismissAriaLabel: "Hinweis schliessen",
    openChatAriaLabel: "Chat oeffnen",
    clearConversationTitle: "Gespraech neu starten",
    closeChatTitle: "Chat schliessen",
    inputAriaLabel: "Nachricht eingeben",
    sendMessageAriaLabel: "Senden",
    sendMessageLabel: "Senden"
};
export const BUILTIN_I18N_MESSAGES = {
    en: EN_MESSAGES,
    de: DE_MESSAGES
};
function getBuiltInOrDefault(locale) {
    const builtIn = BUILTIN_I18N_MESSAGES[locale];
    if (builtIn) {
        return builtIn;
    }
    return EN_MESSAGES;
}
function normalizeLocale(rawLocale, fallback) {
    if (typeof rawLocale !== "string") {
        return fallback;
    }
    const normalized = rawLocale.trim().toLowerCase();
    return normalized || fallback;
}
function cloneCustomTranslations(value) {
    if (!value) {
        return {};
    }
    const cloned = {};
    for (const [locale, messages] of Object.entries(value)) {
        if (!locale.trim()) {
            continue;
        }
        if (messages && typeof messages === "object" && !Array.isArray(messages)) {
            cloned[locale.trim().toLowerCase()] = { ...messages };
        }
    }
    return cloned;
}
function resolveBaseMessages(locale, fallbackLocale) {
    const fallback = getBuiltInOrDefault(fallbackLocale);
    const localeBase = BUILTIN_I18N_MESSAGES[locale] ?? fallback;
    return {
        ...fallback,
        ...localeBase
    };
}
export function resolveI18nConfig(input) {
    const locale = normalizeLocale(input?.locale, DEFAULT_LOCALE);
    const fallbackLocale = normalizeLocale(input?.fallbackLocale, DEFAULT_LOCALE);
    const customTranslations = cloneCustomTranslations(input?.customTranslations);
    const baseMessages = resolveBaseMessages(locale, fallbackLocale);
    const fallbackOverrides = customTranslations[fallbackLocale] ?? {};
    const localeOverrides = customTranslations[locale] ?? {};
    return {
        locale,
        fallbackLocale,
        customTranslations,
        messages: {
            ...baseMessages,
            ...fallbackOverrides,
            ...localeOverrides
        }
    };
}
export function getBuiltinI18nMessages(locale) {
    const normalized = normalizeLocale(locale, DEFAULT_LOCALE);
    const builtIn = getBuiltInOrDefault(normalized);
    return {
        ...builtIn
    };
}
//# sourceMappingURL=i18n.js.map