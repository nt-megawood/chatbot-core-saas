import type { I18nConfig, I18nConfigInput, I18nMessages } from "./types.js";
export declare const DEFAULT_LOCALE = "en";
export declare const BUILTIN_I18N_MESSAGES: Readonly<Record<string, Readonly<I18nMessages>>>;
export declare function resolveI18nConfig(input: I18nConfigInput | undefined): I18nConfig;
export declare function getBuiltinI18nMessages(locale: string): I18nMessages;
//# sourceMappingURL=i18n.d.ts.map