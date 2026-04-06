# Transport adapters

ConversaCore supports both stream-like and non-stream backend integrations.

## createHttpJsonTransport

Use for JSON over HTTP workflows.

## createNonStreamingTransportAdapter

Wraps a non-stream backend response and emits stream-compatible chunks for runtime consistency.

## Integration advice

- Normalize backend errors into explicit user-safe messages
- Keep endpoint/auth policy in company implementation
- Keep adapter pure and testable