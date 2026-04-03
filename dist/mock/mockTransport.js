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
    responseResolver;
    constructor(options = {}) {
        this.latencyMs = options.latencyMs ?? 0;
        this.chunkSize = options.chunkSize ?? 8;
        this.responsePrefix = options.responsePrefix ?? "Mock response: ";
        this.responseResolver = options.resolveResponse;
    }
    async sendMessage(request, handlers) {
        try {
            const response = this.responseResolver
                ? this.responseResolver(request)
                : `${this.responsePrefix}${request.message.text}`;
            for (const chunk of chunkText(response, this.chunkSize)) {
                handlers.onChunk(chunk);
                await wait(this.latencyMs);
            }
            handlers.onComplete();
        }
        catch (error) {
            handlers.onError(error instanceof Error ? error : new Error("Unknown transport error."));
            throw error;
        }
    }
}
//# sourceMappingURL=mockTransport.js.map