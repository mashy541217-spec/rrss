import { SlackBotClient } from '../client/SlackBotClient';

export interface SlackHealth {
  readonly isHealthy: boolean;
  readonly status: 'ACTIVE' | 'UNAUTHORIZED' | 'ERROR';
}

export class SlackHealthCheck {
  public static async verify(token?: string): Promise<SlackHealth> {
    if (!token) return { isHealthy: false, status: 'UNAUTHORIZED' };
    
    try {
      const client = new SlackBotClient(token, { mock: true });
      const test = await client.authTest();
      if (test && test.ok) { 
        return { isHealthy: true, status: 'ACTIVE' };
      }
      return { isHealthy: false, status: 'UNAUTHORIZED' };
    } catch (err) {
      console.error(err);
      return { isHealthy: false, status: 'ERROR' };
    }
  }
}
