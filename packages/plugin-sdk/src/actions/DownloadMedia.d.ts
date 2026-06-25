export interface DownloadMediaInput {
    readonly mediaId: string;
}
export interface DownloadMediaOutput {
    readonly success: boolean;
    readonly content: any;
    readonly contentType: string;
}
