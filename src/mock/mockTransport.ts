import type {
  ChatTransport,
  MessageAction,
  TransportCompleteMeta,
  TransportRequest,
  TransportStreamHandlers
} from "../types.js";

export interface MockResolvedResponse {
  text: string;
  actions?: MessageAction[];
  conversationId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface MockTransportOptions {
  latencyMs?: number;
  chunkSize?: number;
  responsePrefix?: string;
  responseActions?: MessageAction[];
  conversationId?: string | null;
  resolveResponse?: (request: TransportRequest) => string | MockResolvedResponse;
}

function wait(ms: number): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function chunkText(value: string, chunkSize: number): string[] {
  if (chunkSize <= 0) {
    return [value];
  }

  const chunks: string[] = [];

  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }

  return chunks;
}

export class MockChatTransport implements ChatTransport {
  private readonly latencyMs: number;
  private readonly chunkSize: number;
  private readonly responsePrefix: string;
  private readonly responseActions: MessageAction[];
  private readonly conversationId: string | null;
  private readonly responseResolver?: (request: TransportRequest) => string | MockResolvedResponse;

  public constructor(options: MockTransportOptions = {}) {
    this.latencyMs = options.latencyMs ?? 0;
    this.chunkSize = options.chunkSize ?? 8;
    this.responsePrefix = options.responsePrefix ?? "Mock response: ";
    this.responseActions = Array.isArray(options.responseActions) ? [...options.responseActions] : [];
    this.conversationId = options.conversationId ?? null;
    this.responseResolver = options.resolveResponse;
  }

  private resolveResponse(request: TransportRequest): MockResolvedResponse {
    const resolved = this.responseResolver
      ? this.responseResolver(request)
      : `${this.responsePrefix}${request.message.text}`;

    if (typeof resolved === "string") {
      return {
        text: resolved,
        actions: this.responseActions,
        conversationId: this.conversationId
      };
    }

    return {
      text: resolved.text,
      actions: resolved.actions ?? this.responseActions,
      conversationId: resolved.conversationId ?? this.conversationId,
      metadata: resolved.metadata
    };
  }

  public async sendMessage(
    request: TransportRequest,
    handlers: TransportStreamHandlers
  ): Promise<void> {
    try {
      const response = this.resolveResponse(request);

      for (const chunk of chunkText(response.text, this.chunkSize)) {
        handlers.onChunk(chunk);
        await wait(this.latencyMs);
      }

      const completionMeta: TransportCompleteMeta = {
        actions: response.actions,
        conversationId: response.conversationId,
        metadata: response.metadata
      };

      handlers.onComplete(completionMeta);
    } catch (error) {
      handlers.onError(error instanceof Error ? error : new Error("Unknown transport error."));
      throw error;
    }
  }
}
