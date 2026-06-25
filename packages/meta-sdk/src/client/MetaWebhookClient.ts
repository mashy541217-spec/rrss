import { MetaBaseClient } from './MetaBaseClient';

export class MetaWebhookClient extends MetaBaseClient {
  public async getSubscriptions(appId: string): Promise<any> {
    return this.get<any>(`${appId}/subscriptions`);
  }

  public async createSubscription(appId: string, object: string, fields: string[], callbackUrl: string, verifyToken: string): Promise<any> {
    return this.post<any>(`${appId}/subscriptions`, {
      object,
      fields: fields.join(','),
      callback_url: callbackUrl,
      verify_token: verifyToken
    });
  }
}
