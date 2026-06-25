export interface SendMessageInput {
    readonly recipientId: string;
    readonly text: string;
    readonly mediaUrl?: string;
}
export interface SendMessageOutput {
    readonly success: boolean;
    readonly messageId?: string;
}
