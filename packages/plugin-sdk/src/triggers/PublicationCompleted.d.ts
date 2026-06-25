export interface PublicationCompletedEvent {
    readonly publicationId: string;
    readonly externalId: string;
    readonly url?: string;
    readonly completedAt: Date;
}
