import type { ChatTransport, MessageAction, TransportRequest, TransportStreamHandlers } from "../types.js";
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
export declare class MockChatTransport implements ChatTransport {
    private readonly latencyMs;
    private readonly chunkSize;
    private readonly responsePrefix;
    private readonly responseActions;
    private readonly conversationId;
    private readonly responseResolver?;
    constructor(options?: MockTransportOptions);
    private resolveResponse;
    sendMessage(request: TransportRequest, handlers: TransportStreamHandlers): Promise<void>;
}
//# sourceMappingURL=mockTransport.d.ts.map