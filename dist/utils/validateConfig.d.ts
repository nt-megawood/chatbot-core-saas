import type { Config, ConfigInput, LifecycleHooks, ThemeInput } from "../types.js";
export declare function validatePartialTheme(value: unknown, path?: string): asserts value is ThemeInput;
export declare function validateLifecycleMap(value: unknown, path?: string): asserts value is Partial<LifecycleHooks>;
export declare function validateConfigInput(value: unknown, path?: string): asserts value is ConfigInput;
export declare function validateResolvedConfig(config: Config): void;
//# sourceMappingURL=validateConfig.d.ts.map