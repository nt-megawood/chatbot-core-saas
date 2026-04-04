import type { Config, ConfigInput } from "../types.js";
import { validateConfigInput } from "./validateConfig.js";

export interface ScriptConfigOptions {
  globalKey?: string;
  jsonDatasetKey?: string;
}

function parseBoolean(rawValue: string, path: string): boolean {
  if (rawValue === "true") {
    return true;
  }

  if (rawValue === "false") {
    return false;
  }

  throw new Error(`${path} must be either \"true\" or \"false\".`);
}

function parseFiniteNumber(rawValue: string, path: string): number {
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${path} must be a finite number.`);
  }

  return parsed;
}

function parseJsonConfig(rawValue: string | undefined, path: string): ConfigInput {
  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    validateConfigInput(parsed, path);
    return parsed;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown parse error.";
    throw new Error(`${path} is not valid JSON config: ${reason}`);
  }
}

function toObject(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

export function loadConfigFromScript(
  scriptElement: HTMLScriptElement,
  options: ScriptConfigOptions = {}
): ConfigInput {
  if (!(scriptElement instanceof HTMLScriptElement)) {
    throw new Error("A script element is required to load script config.");
  }

  const globalKey = options.globalKey ?? "CHATBOT_CORE_CONFIG";
  const jsonDatasetKey = options.jsonDatasetKey ?? "chatbotConfig";
  const dataset = scriptElement.dataset as Record<string, string | undefined>;

  const attributeConfig: ConfigInput = {};

  if (dataset.mode) {
    attributeConfig.mode = dataset.mode as Config["mode"];
  }

  if (dataset.apiEndpoint) {
    attributeConfig.apiEndpoint = dataset.apiEndpoint;
  }

  if (dataset.socketUrl) {
    attributeConfig.socketUrl = dataset.socketUrl;
  }

  if (dataset.useShadowDom !== undefined) {
    attributeConfig.useShadowDom = parseBoolean(
      dataset.useShadowDom,
      "script.dataset.useShadowDom"
    );
  }

  if (dataset.title) {
    attributeConfig.title = dataset.title;
  }

  if (dataset.position) {
    attributeConfig.position = dataset.position as Config["position"];
  }

  if (dataset.inputPlaceholder) {
    attributeConfig.inputPlaceholder = dataset.inputPlaceholder;
  }

  if (dataset.initiallyOpen !== undefined) {
    attributeConfig.initiallyOpen = parseBoolean(
      dataset.initiallyOpen,
      "script.dataset.initiallyOpen"
    );
  }

  if (dataset.allowRuntimeModeSwitch !== undefined) {
    attributeConfig.allowRuntimeModeSwitch = parseBoolean(
      dataset.allowRuntimeModeSwitch,
      "script.dataset.allowRuntimeModeSwitch"
    );
  }

  if (dataset.showRefreshButton !== undefined) {
    attributeConfig.showRefreshButton = parseBoolean(
      dataset.showRefreshButton,
      "script.dataset.showRefreshButton"
    );
  }

  if (dataset.locale || dataset.fallbackLocale) {
    attributeConfig.i18n = {
      ...(attributeConfig.i18n ?? {}),
      ...(dataset.locale ? { locale: dataset.locale } : {}),
      ...(dataset.fallbackLocale ? { fallbackLocale: dataset.fallbackLocale } : {})
    };
  }

  if (
    dataset.teaserEnabled !== undefined ||
    dataset.teaserDelayMs !== undefined ||
    dataset.teaserTitle !== undefined ||
    dataset.teaserText !== undefined
  ) {
    attributeConfig.teaser = {
      ...(attributeConfig.teaser ?? {}),
      ...(dataset.teaserEnabled !== undefined
        ? {
            enabled: parseBoolean(dataset.teaserEnabled, "script.dataset.teaserEnabled")
          }
        : {}),
      ...(dataset.teaserDelayMs !== undefined
        ? {
            delayMs: parseFiniteNumber(dataset.teaserDelayMs, "script.dataset.teaserDelayMs")
          }
        : {}),
      ...(dataset.teaserTitle !== undefined ? { title: dataset.teaserTitle } : {}),
      ...(dataset.teaserText !== undefined ? { text: dataset.teaserText } : {})
    };
  }

  const datasetConfig = parseJsonConfig(dataset[jsonDatasetKey], `script.dataset.${jsonDatasetKey}`);
  const globalConfig = toObject((globalThis as Record<string, unknown>)[globalKey]);

  const merged = {
    ...globalConfig,
    ...datasetConfig,
    ...attributeConfig
  } as ConfigInput;

  validateConfigInput(merged, "scriptConfig");

  return merged;
}
