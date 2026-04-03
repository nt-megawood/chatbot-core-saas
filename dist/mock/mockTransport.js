function wait(ms) {
    if (ms <= 0) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function chunkText(value, chunkSize) {
    if (chunkSize <= 0) {
        return [value];
    }
    const chunks = [];
    for (let index = 0; index < value.length; index += chunkSize) {
        chunks.push(value.slice(index, index + chunkSize));
    }
    return chunks;
}
export class MockChatTransport {
    latencyMs;
    chunkSize;
    responsePrefix;
    responseActions;
    conversationId;
    responseResolver;
    constructor(options = {}) {
        this.latencyMs = options.latencyMs ?? 0;
        this.chunkSize = options.chunkSize ?? 8;
        this.responsePrefix = options.responsePrefix ?? "Mock response: ";
        this.responseActions = Array.isArray(options.responseActions) ? [...options.responseActions] : [];
        this.conversationId = options.conversationId ?? null;
        this.responseResolver = options.resolveResponse;
    }
    resolveResponse(request) {
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
    async sendMessage(request, handlers) {
        try {
            const response = this.resolveResponse(request);
            for (const chunk of chunkText(response.text, this.chunkSize)) {
                handlers.onChunk(chunk);
                await wait(this.latencyMs);
            }
            const completionMeta = {
                actions: response.actions,
                conversationId: response.conversationId,
                metadata: response.metadata
            };
            handlers.onComplete(completionMeta);
        }
        catch (error) {
            handlers.onError(error instanceof Error ? error : new Error("Unknown transport error."));
            throw error;
        }
    }
}
//# sourceMappingURL=mockTransport.js.map