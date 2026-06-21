export interface IFileSystem {
  readFile(path: string): Promise<Buffer>;
  writeFile(path: string, data: Buffer | string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}
