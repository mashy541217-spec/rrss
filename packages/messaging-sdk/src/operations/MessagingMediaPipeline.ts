export interface MessagingMediaPipeline {
  uploadMedia(url: string, type: 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'AUDIO', options?: Record<string, any>): Promise<string>;
  downloadMedia(mediaId: string): Promise<Buffer>;
  validateMediaConstraints(sizeBytes: number, type: string): boolean;
}
