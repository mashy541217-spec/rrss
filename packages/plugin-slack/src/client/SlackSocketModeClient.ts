import { EventEmitter } from 'events';

export class SlackSocketModeClient extends EventEmitter {
  private isConnected = false;

  constructor(private readonly appToken: string, private readonly options?: { mock?: boolean }) {
    super();
  }

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    
    if (this.options?.mock) {
      setTimeout(() => this.emit('connected'), 100);
    }
  }

  public disconnect(): void {
    this.isConnected = false;
    this.emit('disconnected');
  }
}
