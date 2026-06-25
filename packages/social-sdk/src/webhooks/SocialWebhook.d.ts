export type SocialWebhookEventType = 'PUBLICATION_CREATED' | 'PUBLICATION_UPDATED' | 'COMMENT_RECEIVED' | 'MESSAGE_RECEIVED' | 'REACTION_ADDED' | 'WEBHOOK_VERIFIED';
export interface BaseSocialWebhookEvent<T = any> {
    readonly providerId: string;
    readonly eventType: SocialWebhookEventType;
    readonly timestamp: Date;
    readonly rawPayload: Record<string, any>;
    readonly data: T;
}
export interface WebhookVerifiedData {
    readonly challenge?: string;
    readonly status: 'SUCCESS' | 'FAILED';
}
export interface PublicationCreatedData {
    readonly publicationId: string;
    readonly accountId: string;
    readonly pageId?: string;
    readonly content: string;
    readonly mediaUrls?: string[];
}
export interface PublicationUpdatedData {
    readonly publicationId: string;
    readonly accountId: string;
    readonly pageId?: string;
    readonly status?: string;
    readonly metrics?: Record<string, number>;
}
export interface CommentReceivedData {
    readonly commentId: string;
    readonly publicationId: string;
    readonly authorId: string;
    readonly authorName: string;
    readonly text: string;
}
export interface MessageReceivedData {
    readonly messageId: string;
    readonly senderId: string;
    readonly senderName: string;
    readonly text: string;
}
export interface ReactionAddedData {
    readonly publicationId: string;
    readonly commentId?: string;
    readonly reactorId: string;
    readonly reactionType: string;
}
export type SocialWebhookEvent = (BaseSocialWebhookEvent<WebhookVerifiedData> & {
    eventType: 'WEBHOOK_VERIFIED';
}) | (BaseSocialWebhookEvent<PublicationCreatedData> & {
    eventType: 'PUBLICATION_CREATED';
}) | (BaseSocialWebhookEvent<PublicationUpdatedData> & {
    eventType: 'PUBLICATION_UPDATED';
}) | (BaseSocialWebhookEvent<CommentReceivedData> & {
    eventType: 'COMMENT_RECEIVED';
}) | (BaseSocialWebhookEvent<MessageReceivedData> & {
    eventType: 'MESSAGE_RECEIVED';
}) | (BaseSocialWebhookEvent<ReactionAddedData> & {
    eventType: 'REACTION_ADDED';
});
export interface SocialWebhookHandler {
    verifyWebhook(headers: Record<string, string>, query: Record<string, string>): Promise<boolean>;
    parseWebhookEvent(headers: Record<string, string>, body: Record<string, any>, query: Record<string, string>): Promise<SocialWebhookEvent>;
}
