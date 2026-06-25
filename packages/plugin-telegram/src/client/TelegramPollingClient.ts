import { EventEmitter } from 'events';

export class TelegramPollingClient extends EventEmitter {
  private isPolling = false;
  private offset = 0;

  constructor(private readonly token: string, private readonly options?: { mock?: boolean }) {
    super();
  }

  public start(): void {
    if (this.isPolling) return;
    this.isPolling = true;
    this.poll();
  }

  public stop(): void {
    this.isPolling = false;
  }

  private async poll(): Promise<void> {
    if (!this.isPolling) return;

    try {
      if (this.options?.mock) {
        // Mock polling logic
        this.emit('update', [{ update_id: this.offset++, message: { text: 'mock poll' } }]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        throw new Error('Real HTTP client not implemented in Phase 3');
      }
    } catch (err: any) {
      this.emit('error', err);
    }

    if (this.isPolling) {
      setTimeout(() => this.poll(), 1000);
    }
  }
}
