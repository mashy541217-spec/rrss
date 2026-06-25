export interface WebhookReceivedEvent {
    readonly payload: Record<string, any>;
    readonly headers: Record<string, string>;
    readonly query: Record<string, string>;
    readonly receivedAt: Date;
}
