import { TelegramBotClient } from '../client/TelegramBotClient';

export interface TelegramHealth {
  readonly isHealthy: boolean;
  readonly status: 'ACTIVE' | 'UNAUTHORIZED' | 'ERROR';
}

export class TelegramHealthCheck {
  public static async verify(token?: string): Promise<TelegramHealth> {
    if (!token) return { isHealthy: false, status: 'UNAUTHORIZED' };
    
    try {
      const client = new TelegramBotClient(token, { mock: true });
      const me = await client.getMe();
      if (me.ok) {
        return { isHealthy: true, status: 'ACTIVE' };
      }
      return { isHealthy: false, status: 'UNAUTHORIZED' };
    } catch (err) {
      return { isHealthy: false, status: 'ERROR' };
    }
  }
}
