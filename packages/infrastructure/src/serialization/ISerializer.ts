export interface ISerializer {
  serialize<T>(data: T): string | Buffer;
}
