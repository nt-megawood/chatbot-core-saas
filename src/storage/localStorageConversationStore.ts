import type {
  ConversationSnapshot,
  ConversationStore,
  Message,
  MessageAction,
  MessageRole,
  MessageState,
  WidgetMode
} from "../types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function toMode(value: unknown): WidgetMode {
  return value === "landscape" ? "landscape" : "normal";
}

function toRole(value: unknown): MessageRole {
  return value === "user" ? "user" : "assistant";
}

function toState(value: unknown): MessageState {
  if (value === "pending" || value === "streaming" || value === "error") {
    return value;
  }
  return "complete";
}

function sanitizeAction(raw: unknown): MessageAction | null {
  if (!isRecord(raw)) {
    return null;
  }

  const label = toStringOrNull(raw.label);
  if (!label) {
    return null;
  }

  const type = raw.type;
  if (type !== "send_message" && type !== "open_url" && type !== "custom") {
    return null;
  }

  const action: MessageAction = {
    id: toStringOrNull(raw.id) ?? undefined,
    label,
    type,
    message: toStringOrNull(raw.message) ?? undefined,
    url: toStringOrNull(raw.url) ?? undefined,
    payload: isRecord(raw.payload) ? raw.payload : undefined
  };

  return action;
}

function sanitizeMessage(raw: unknown): Message | null {
  if (!isRecord(raw)) {
    return null;
  }

  const id = toStringOrNull(raw.id);
  const text = toStringOrNull(raw.text);
  if (!id || text === null) {
    return null;
  }

  const createdAt = Number(raw.createdAt);
  const actions = Array.isArray(raw.actions)
    ? raw.actions.map((item) => sanitizeAction(item)).filter((item): item is MessageAction => item !== null)
    : undefined;

  return {
    id,
    role: toRole(raw.role),
    text,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
    state: toState(raw.state),
    actions: actions && actions.length > 0 ? actions : undefined,
    metadata: isRecord(raw.metadata) ? raw.metadata : undefined
  };
}

function sanitizeSnapshot(raw: unknown): ConversationSnapshot | null {
  if (!isRecord(raw)) {
    return null;
  }

  const messages = Array.isArray(raw.messages)
    ? raw.messages.map((item) => sanitizeMessage(item)).filter((item): item is Message => item !== null)
    : [];

  return {
    conversationId: toStringOrNull(raw.conversationId),
    mode: toMode(raw.mode),
    isOpen: Boolean(raw.isOpen),
    teaserDismissed: Boolean(raw.teaserDismissed),
    messages,
    updatedAt: Number.isFinite(Number(raw.updatedAt)) ? Number(raw.updatedAt) : Date.now()
  };
}

export function createLocalStorageConversationStore(storageKey: string): ConversationStore {
  function load(): ConversationSnapshot | null {
    if (typeof localStorage === "undefined") {
      return null;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as unknown;
      return sanitizeSnapshot(parsed);
    } catch {
      return null;
    }
  }

  function save(snapshot: ConversationSnapshot): void {
    if (typeof localStorage === "undefined") {
      return;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(snapshot));
    } catch {
      // Ignore persistence failures to keep the widget usable.
    }
  }

  function clear(): void {
    if (typeof localStorage === "undefined") {
      return;
    }

    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures.
    }
  }

  return {
    load,
    save,
    clear
  };
}
