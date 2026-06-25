import { ICRMProvider } from '../core/ICRMProvider';
import { ICRMSession } from '../core/ICRMSession';

export class CRMSessionPool {
  private activeSessions: Map<string, ICRMSession> = new Map();
  private idleSessions: ICRMSession[] = [];

  constructor(
    private readonly provider: ICRMProvider,
    private readonly credentials: Record<string, string>,
    private readonly maxPoolSize: number = 10
  ) {}

  async acquireSession(executionId: string): Promise<ICRMSession> {
    let session = this.idleSessions.pop();

    if (session) {
      const isAlive = await session.ping();
      if (!isAlive) {
        console.log(`[CRMPool] Token expired, discarding session...`);
        session = undefined;
      }
    }

    if (!session) {
      if (this.activeSessions.size >= this.maxPoolSize) {
        throw new Error('CRMSessionPool Exhausted: No available connections.');
      }
      console.log(`[CRMPool] Authenticating new CRM session (OAuth/Token)...`);
      session = await this.provider.authenticate(this.credentials);
    } else {
      console.log(`[CRMPool] Reusing warm CRM session for execution ${executionId}`);
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
