import { IERPProvider } from '../core/IERPProvider';
import { IERPSession } from '../core/IERPSession';
import { ERPContext } from '../models/ERPContext';

export class ERPSessionPool {
  private activeSessions: Map<string, IERPSession> = new Map();
  private idleSessions: IERPSession[] = [];

  constructor(
    private readonly provider: IERPProvider,
    private readonly credentials: Record<string, string>,
    private readonly context: ERPContext,
    private readonly maxPoolSize: number = 5
  ) {}

  /**
   * Acquires a warm session from the pool or authenticates a new one if space allows.
   */
  async acquireSession(executionId: string): Promise<IERPSession> {
    let session = this.idleSessions.pop();

    if (session) {
      // Ensure it hasn't timed out
      const isAlive = await session.ping();
      if (!isAlive) {
        console.log(`[ERPPool] Stale session detected, discarding...`);
        session = undefined;
      }
    }

    if (!session) {
      if (this.activeSessions.size >= this.maxPoolSize) {
        throw new Error('ERPSessionPool Exhausted: No available connections.');
      }
      console.log(`[ERPPool] Authenticating new ERP session (Context: ${this.context})...`);
      session = await this.provider.login(this.credentials, this.context);
    } else {
      console.log(`[ERPPool] Reusing warm ERP session for execution ${executionId}`);
    }

    this.activeSessions.set(executionId, session);
    return session;
  }

  /**
   * Releases a session back into the idle pool.
   */
  async releaseSession(executionId: string): Promise<void> {
    const session = this.activeSessions.get(executionId);
    if (session) {
      this.activeSessions.delete(executionId);
      this.idleSessions.push(session);
      console.log(`[ERPPool] Released session back to pool.`);
    }
  }

  getMetrics() {
    return {
      activeSessions: this.activeSessions.size,
      idleSessions: this.idleSessions.length,
      maxPoolSize: this.maxPoolSize
    };
  }
}
