import { EventEmitter } from 'events';

export class DiscordGatewayClient extends EventEmitter {
  private isConnected = false;

  constructor(private readonly token: string, private readonly options?: { mock?: boolean }) {
    super();
  }

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    
    if (this.options?.mock) {
      setTimeout(() => this.emit('ready', { user: { id: 'mock-bot-id' } }), 100);
    }
  }

  public disconnect(): void {
    this.isConnected = false;
    this.emit('disconnected');
  }
}
