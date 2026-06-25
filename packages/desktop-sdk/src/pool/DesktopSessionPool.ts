import { IDesktopSession, IDesktopProvider } from '../core/IDesktopSession';

export class DesktopSessionPool {
  private activeSessions: Map<string, IDesktopSession> = new Map();

  constructor(private readonly provider: IDesktopProvider) {}

  /**
   * Acquires a new desktop session.
   * Unlike web/mobile, desktop sessions often require a dedicated worker, so pooling
   * is mostly about tracking the singleton active session on this worker.
   */
  async acquireSession(executionId: string): Promise<IDesktopSession> {
    if (this.activeSessions.size > 0) {
      throw new Error('DesktopSessionPool: This worker is currently executing a desktop workflow.');
    }

    console.log(`[DesktopPool] Creating new Desktop Session for execution ${executionId}`);
    const session = await this.provider.createSession();
    this.activeSessions.set(executionId, session);

    return session;
  }

  /**
   * Releases the session and forces all windows/apps spawned by this session to close.
   */
  async releaseSession(executionId: string): Promise<void> {
    const session = this.activeSessions.get(executionId);
    if (session) {
      console.log(`[DesktopPool] Closing Desktop Session for execution ${executionId}`);
      await session.close();
      this.activeSessions.delete(executionId);
    }
  }

  getMetrics() {
    return {
      activeSessions: this.activeSessions.size,
      maxSessions: 1 // Typical constraint for Windows GUI
    };
  }
}
