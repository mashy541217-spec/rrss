export interface ILockProvider {
  acquire(lockKey: string, ttlMs: number): Promise<boolean>;
  release(lockKey: string): Promise<void>;
  extend(lockKey: string, ttlMs: number): Promise<boolean>;
}
