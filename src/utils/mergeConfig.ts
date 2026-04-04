import { CORE_DEFAULT_CONFIG, MODE_DEFAULTS } from "../defaults.js";
import type {
  ActionHandlers,
  Config,
  ConfigInput,
  LifecycleHooks,
  PresenceConfig,
  StorageConfig,
  TeaserConfig,
  Theme,
  ThemeInput,
  ThinkingConfig
} from "../types.js";
import {
  validateConfigInput,
  validateLifecycleMap,
  validatePartialTheme,
  validateResolvedConfig
} from "./validateConfig.js";
import { resolveI18nConfig } from "../i18n.js";

export interface MergeConfigOptions {
  implementationThemeDefaults?: ThemeInput;
}

function cloneStringArray(value: string[] | undefined, fallback: string[]): string[] {
  return Array.isArray(value) ? [...value] : [...fallback];
}

function mergeTheme(
  modeTheme: Theme,
  implementationThemeDefaults: ThemeInput | undefined,
  initTheme: ThemeInput | undefined
): Theme {
  const merged: Theme = {
    ...CORE_DEFAULT_CONFIG.theme,
    ...modeTheme,
    ...(implementationThemeDefaults ?? {}),
    ...(initTheme ?? {}),
    tokens: {
      ...CORE_DEFAULT_CONFIG.theme.tokens,
      ...modeTheme.tokens,
      ...(implementationThemeDefaults?.tokens ?? {}),
      ...(initTheme?.tokens ?? {})
    },
    fontFamilies: cloneStringArray(
      initTheme?.fontFamilies ?? implementationThemeDefaults?.fontFamilies ?? modeTheme.fontFamilies,
      CORE_DEFAULT_CONFIG.theme.fontFamilies
    )
  };

  return merged;
}

function mergeLifecycle(
  modeLifecycle: Partial<LifecycleHooks>,
  initLifecycle: Partial<LifecycleHooks> | undefined
): LifecycleHooks {
  return {
    ...CORE_DEFAULT_CONFIG.lifecycle,
    ...modeLifecycle,
    ...(initLifecycle ?? {})
  };
}

function mergeTeaser(input: Partial<TeaserConfig> | undefined): TeaserConfig {
  return {
    ...CORE_DEFAULT_CONFIG.teaser,
    ...(input ?? {})
  };
}

function mergeStorage(input: Partial<StorageConfig> | undefined): StorageConfig {
  return {
    ...CORE_DEFAULT_CONFIG.storage,
    ...(input ?? {})
  };
}

function mergePresence(input: Partial<PresenceConfig> | undefined): PresenceConfig {
  return {
    ...CORE_DEFAULT_CONFIG.presence,
    ...(input ?? {})
  };
}

function mergeThinking(input: Partial<ThinkingConfig> | undefined): ThinkingConfig {
  return {
    ...CORE_DEFAULT_CONFIG.thinking,
    ...(input ?? {}),
    messages: cloneStringArray(input?.messages, CORE_DEFAULT_CONFIG.thinking.messages)
  };
}

function mergeI18n(input: ConfigInput["i18n"]): Config["i18n"] {
  return resolveI18nConfig(input);
}

function mergeActionHandlers(input: Partial<ActionHandlers> | undefined): ActionHandlers {
  return {
    ...CORE_DEFAULT_CONFIG.actionHandlers,
    ...(input ?? {})
  };
}

export function mergeConfig(initConfig: ConfigInput, options: MergeConfigOptions = {}): Config {
  validateConfigInput(initConfig, "initConfig");

  if (options.implementationThemeDefaults) {
    validatePartialTheme(options.implementationThemeDefaults, "implementationThemeDefaults");
  }

  const selectedMode = initConfig.mode ?? CORE_DEFAULT_CONFIG.mode;
  const modeDefaults = MODE_DEFAULTS[selectedMode];

  validatePartialTheme(modeDefaults.theme, "modeDefaults.theme");
  validateLifecycleMap(modeDefaults.lifecycle, "modeDefaults.lifecycle");

  const mergedTheme = mergeTheme(
    modeDefaults.theme,
    options.implementationThemeDefaults,
    initConfig.theme
  );

  const mergedLifecycle = mergeLifecycle(modeDefaults.lifecycle, initConfig.lifecycle);

  const mergedConfig: Config = {
    ...CORE_DEFAULT_CONFIG,
    ...modeDefaults,
    ...initConfig,
    mode: selectedMode,
    theme: mergedTheme,
    teaser: mergeTeaser(initConfig.teaser),
    storage: mergeStorage(initConfig.storage),
    presence: mergePresence(initConfig.presence),
    thinking: mergeThinking(initConfig.thinking),
    i18n: mergeI18n(initConfig.i18n),
    actionHandlers: mergeActionHandlers(initConfig.actionHandlers),
    lifecycle: mergedLifecycle
  };

  validateResolvedConfig(mergedConfig);

  return mergedConfig;
}
