export interface IStorageService {
  upload(bucket: string, key: string, data: Buffer, contentType?: string): Promise<string>;
  download(bucket: string, key: string): Promise<Buffer>;
  delete(bucket: string, key: string): Promise<void>;
  getSignedUrl(bucket: string, key: string, expirationSeconds: number): Promise<string>;
}
