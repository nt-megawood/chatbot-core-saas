import { validateConfigInput } from "./validateConfig.js";
function parseBoolean(rawValue, path) {
    if (rawValue === "true") {
        return true;
    }
    if (rawValue === "false") {
        return false;
    }
    throw new Error(`${path} must be either \"true\" or \"false\".`);
}
function parseJsonConfig(rawValue, path) {
    if (!rawValue) {
        return {};
    }
    try {
        const parsed = JSON.parse(rawValue);
        validateConfigInput(parsed, path);
        return parsed;
    }
    catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown parse error.";
        throw new Error(`${path} is not valid JSON config: ${reason}`);
    }
}
function toObject(value) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return value;
    }
    return {};
}
export function loadConfigFromScript(scriptElement, options = {}) {
    if (!(scriptElement instanceof HTMLScriptElement)) {
        throw new Error("A script element is required to load script config.");
    }
    const globalKey = options.globalKey ?? "CHATBOT_CORE_CONFIG";
    const jsonDatasetKey = options.jsonDatasetKey ?? "chatbotConfig";
    const dataset = scriptElement.dataset;
    const attributeConfig = {};
    if (dataset.mode) {
        attributeConfig.mode = dataset.mode;
    }
    if (dataset.apiEndpoint) {
        attributeConfig.apiEndpoint = dataset.apiEndpoint;
    }
    if (dataset.socketUrl) {
        attributeConfig.socketUrl = dataset.socketUrl;
    }
    if (dataset.useShadowDom !== undefined) {
        attributeConfig.useShadowDom = parseBoolean(dataset.useShadowDom, "script.dataset.useShadowDom");
    }
    const datasetConfig = parseJsonConfig(dataset[jsonDatasetKey], `script.dataset.${jsonDatasetKey}`);
    const globalConfig = toObject(globalThis[globalKey]);
    const merged = {
        ...globalConfig,
        ...datasetConfig,
        ...attributeConfig
    };
    validateConfigInput(merged, "scriptConfig");
    return merged;
}
//# sourceMappingURL=scriptConfig.js.map