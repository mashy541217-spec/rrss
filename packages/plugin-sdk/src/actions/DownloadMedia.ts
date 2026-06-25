export interface DownloadMediaInput {
  readonly mediaId: string;
}

export interface DownloadMediaOutput {
  readonly success: boolean;
  readonly content: any; // Using any to represent binary content buffer/stream
  readonly contentType: string;
}
