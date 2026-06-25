import { MetaBaseClient } from './MetaBaseClient';

export class MetaAuthenticationClient extends MetaBaseClient {
  public async getLongLivedToken(clientId: string, clientSecret: string, shortLivedToken: string): Promise<{ access_token: string; expires_in: number }> {
    return this.get<{ access_token: string; expires_in: number }>('oauth/access_token', {
      grant_type: 'fb_exchange_token',
      client_id: clientId,
      client_secret: clientSecret,
      fb_exchange_token: shortLivedToken
    });
  }

  public async validateToken(): Promise<boolean> {
    try {
      const res = await this.get<{ id: string }>('me', { fields: 'id' });
      return !!res.id;
    } catch {
      return false;
    }
  }
}
