export class BrowserContextPool {
  private activeContexts: Map<string, any> = new Map();

  constructor(
    private readonly maxContexts: number = 10
  ) {}

  /**
   * Acquires a fresh, isolated incognito browser context for a specific execution.
   */
  async acquireContext(executionId: string): Promise<any> {
    if (this.activeContexts.size >= this.maxContexts) {
      throw new Error('Browser Pool Exhausted: No available contexts.');
    }

    // In Playwright: const context = await browser.newContext();
    const context = { id: executionId, type: 'incognito' }; // Mock
    this.activeContexts.set(executionId, context);
    
    console.log(`[BrowserPool] Acquired fresh context for execution ${executionId}`);
    return context;
  }

  /**
   * Releases the context and completely clears cookies/localStorage to prevent data leakage.
   */
  async releaseContext(executionId: string): Promise<void> {
    const context = this.activeContexts.get(executionId);
    if (context) {
      // In Playwright: await context.close();
      this.activeContexts.delete(executionId);
      console.log(`[BrowserPool] Released and cleaned context for execution ${executionId}`);
    }
  }

  getMetrics() {
    return {
      activeSessions: this.activeContexts.size,
      maxSessions: this.maxContexts,
      isExhausted: this.activeContexts.size >= this.maxContexts
    };
  }
}
