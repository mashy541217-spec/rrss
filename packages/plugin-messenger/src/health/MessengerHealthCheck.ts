import { MessengerClient } from '../client/MessengerClient';

export interface MessengerHealth {
  readonly isHealthy: boolean;
  readonly status: 'ACTIVE' | 'UNAUTHORIZED' | 'ERROR';
}

export class MessengerHealthCheck {
  public static async verify(token?: string, pageId?: string): Promise<MessengerHealth> {
    if (!token || !pageId) return { isHealthy: false, status: 'UNAUTHORIZED' };
    
    try {
      const client = new MessengerClient(token, pageId, { mock: true });
      const profile = await client.getPageProfile();
      if (profile) { 
        return { isHealthy: true, status: 'ACTIVE' };
      }
      return { isHealthy: false, status: 'UNAUTHORIZED' };
    } catch (err) {
      console.error(err);
      return { isHealthy: false, status: 'ERROR' };
    }
  }
}
