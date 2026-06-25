export interface ERPAttachment {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  description?: string;
}
