export interface SocialPublication {
    readonly id: string;
    readonly providerId: string;
    readonly url?: string;
    readonly textContent?: string;
    readonly mediaUrls?: string[];
    readonly publishedAt: Date;
    readonly status: 'PUBLISHED' | 'FAILED' | 'PENDING';
    readonly metadata?: Record<string, any>;
}
