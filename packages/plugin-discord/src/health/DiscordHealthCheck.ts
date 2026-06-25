import { DiscordBotClient } from '../client/DiscordBotClient';

export interface DiscordHealth {
  readonly isHealthy: boolean;
  readonly status: 'ACTIVE' | 'UNAUTHORIZED' | 'ERROR';
}

export class DiscordHealthCheck {
  public static async verify(token?: string): Promise<DiscordHealth> {
    if (!token) return { isHealthy: false, status: 'UNAUTHORIZED' };
    
    try {
      const client = new DiscordBotClient(token, { mock: true });
      const me = await client.getMe();
      if (me) { 
        return { isHealthy: true, status: 'ACTIVE' };
      }
      return { isHealthy: false, status: 'UNAUTHORIZED' };
    } catch (err) {
      console.error(err);
      return { isHealthy: false, status: 'ERROR' };
    }
  }
}
