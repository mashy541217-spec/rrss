export interface SocialMediaAsset {
    readonly id: string;
    readonly url: string;
    readonly assetType: 'IMAGE' | 'VIDEO' | 'AUDIO';
    readonly mimeType?: string;
}
