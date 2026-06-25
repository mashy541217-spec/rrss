import { IAdvertisingProvider, IAdvertisingSession } from '../core/IAdvertisingProvider';

export class AdvertisingSessionPool {
  private activeSessions: Map<string, IAdvertisingSession> = new Map();
  private idleSessions: IAdvertisingSession[] = [];

  constructor(
    private readonly provider: IAdvertisingProvider,
    private readonly credentials: Record<string, string>,
    private readonly maxPoolSize: number = 10
  ) {}

  async acquireSession(executionId: string): Promise<IAdvertisingSession> {
    let session = this.idleSessions.pop();

    if (session) {
      const isAlive = await session.ping();
      if (!isAlive) {
        console.log(`[AdsPool] Token expired, discarding session...`);
        session = undefined;
      }
    }

    if (!session) {
      if (this.activeSessions.size >= this.maxPoolSize) {
        throw new Error('AdvertisingSessionPool Exhausted: No available connections.');
      }
      console.log(`[AdsPool] Authenticating new Advertising session (OAuth/Token)...`);
      session = await this.provider.authenticate(this.credentials);
    } else {
      console.log(`[AdsPool] Reusing warm Advertising session for execution ${executionId}`);
    }

    this.activeSessions.set(executionId, session);
    return session;
  }

  async releaseSession(executionId: string): Promise<void> {
    const session = this.activeSessions.get(executionId);
    if (session) {
      this.activeSessions.delete(executionId);
      this.idleSessions.push(session);
    }
  }
}
