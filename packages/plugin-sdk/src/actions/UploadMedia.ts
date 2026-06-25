export interface UploadMediaInput {
  readonly mediaUrl: string;
  readonly filename: string;
  readonly contentType: string;
}

export interface UploadMediaOutput {
  readonly success: boolean;
  readonly mediaId: string;
  readonly url?: string;
}
