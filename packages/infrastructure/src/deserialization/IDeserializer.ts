export interface IDeserializer {
  deserialize<T>(data: string | Buffer): T;
}
