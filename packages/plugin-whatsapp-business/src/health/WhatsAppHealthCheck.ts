import { WhatsAppBusinessClient } from '../client/WhatsAppBusinessClient';

export interface WhatsAppHealth {
  readonly isHealthy: boolean;
  readonly status: 'ACTIVE' | 'UNAUTHORIZED' | 'ERROR';
}

export class WhatsAppHealthCheck {
  public static async verify(token?: string, phoneNumberId?: string): Promise<WhatsAppHealth> {
    if (!token || !phoneNumberId) return { isHealthy: false, status: 'UNAUTHORIZED' };
    
    try {
      const client = new WhatsAppBusinessClient(token, phoneNumberId, { mock: true });
      const profile = await client.getBusinessProfile();
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
