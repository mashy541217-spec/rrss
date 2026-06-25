export interface MessageReceivedEvent {
    readonly senderId: string;
    readonly messageId: string;
    readonly text: string;
    readonly timestamp: Date;
    readonly metadata?: Record<string, any>;
}
