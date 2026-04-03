import { CORE_DEFAULT_CONFIG, MODE_DEFAULTS } from "../defaults.js";
import { validateConfigInput, validateLifecycleMap, validatePartialTheme, validateResolvedConfig } from "./validateConfig.js";
function cloneStringArray(value, fallback) {
    return Array.isArray(value) ? [...value] : [...fallback];
}
function mergeTheme(modeTheme, implementationThemeDefaults, initTheme) {
    const merged = {
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
        fontFamilies: cloneStringArray(initTheme?.fontFamilies ?? implementationThemeDefaults?.fontFamilies ?? modeTheme.fontFamilies, CORE_DEFAULT_CONFIG.theme.fontFamilies)
    };
    return merged;
}
function mergeLifecycle(modeLifecycle, initLifecycle) {
    return {
        ...CORE_DEFAULT_CONFIG.lifecycle,
        ...modeLifecycle,
        ...(initLifecycle ?? {})
    };
}
export function mergeConfig(initConfig, options = {}) {
    validateConfigInput(initConfig, "initConfig");
    if (options.implementationThemeDefaults) {
        validatePartialTheme(options.implementationThemeDefaults, "implementationThemeDefaults");
    }
    const selectedMode = initConfig.mode ?? CORE_DEFAULT_CONFIG.mode;
    const modeDefaults = MODE_DEFAULTS[selectedMode];
    validatePartialTheme(modeDefaults.theme, "modeDefaults.theme");
    validateLifecycleMap(modeDefaults.lifecycle, "modeDefaults.lifecycle");
    const mergedTheme = mergeTheme(modeDefaults.theme, options.implementationThemeDefaults, initConfig.theme);
    const mergedLifecycle = mergeLifecycle(modeDefaults.lifecycle, initConfig.lifecycle);
    const mergedConfig = {
        ...CORE_DEFAULT_CONFIG,
        ...modeDefaults,
        ...initConfig,
        mode: selectedMode,
        theme: mergedTheme,
        lifecycle: mergedLifecycle
    };
    validateResolvedConfig(mergedConfig);
    return mergedConfig;
}
//# sourceMappingURL=mergeConfig.js.map