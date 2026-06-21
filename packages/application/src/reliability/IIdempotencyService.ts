export interface IIdempotencyService {
  isProcessed(idempotencyKey: string): Promise<boolean>;
  markProcessed(idempotencyKey: string): Promise<void>;
  executeIdempotent<T>(idempotencyKey: string, operation: () => Promise<T>): Promise<T>;
}
