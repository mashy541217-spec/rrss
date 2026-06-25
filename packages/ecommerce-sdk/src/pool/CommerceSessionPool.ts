import { IECommerceProvider, IECommerceSession } from '../core/IECommerceProvider';

export class CommerceSessionPool {
  private activeSessions: Map<string, IECommerceSession> = new Map();
  private idleSessions: IECommerceSession[] = [];

  constructor(
    private readonly provider: IECommerceProvider,
    private readonly credentials: Record<string, string>,
    private readonly maxPoolSize: number = 10
  ) {}

  async acquireSession(executionId: string): Promise<IECommerceSession> {
    let session = this.idleSessions.pop();

    if (session) {
      const isAlive = await session.ping();
      if (!isAlive) {
        console.log(`[CommercePool] Token expired, discarding session...`);
        session = undefined;
      }
    }

    if (!session) {
      if (this.activeSessions.size >= this.maxPoolSize) {
        throw new Error('CommerceSessionPool Exhausted: No available connections.');
      }
      console.log(`[CommercePool] Authenticating new Commerce session (OAuth/Token)...`);
      session = await this.provider.authenticate(this.credentials);
    } else {
      console.log(`[CommercePool] Reusing warm Commerce session for execution ${executionId}`);
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
