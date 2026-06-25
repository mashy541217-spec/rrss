import { MetaAuthenticationClient } from './MetaAuthenticationClient';
import { MetaPublicationClient } from './MetaPublicationClient';
import { MetaMediaClient } from './MetaMediaClient';
import { MetaInsightsClient } from './MetaInsightsClient';
import { MetaUserClient } from './MetaUserClient';
import { MetaWebhookClient } from './MetaWebhookClient';

export class MetaGraphApiClient {
  public readonly auth: MetaAuthenticationClient;
  public readonly publication: MetaPublicationClient;
  public readonly media: MetaMediaClient;
  public readonly insights: MetaInsightsClient;
  public readonly user: MetaUserClient;
  public readonly webhook: MetaWebhookClient;

  constructor(accessToken: string, options?: { mock?: boolean }) {
    this.auth = new MetaAuthenticationClient(accessToken, options);
    this.publication = new MetaPublicationClient(accessToken, options);
    this.media = new MetaMediaClient(accessToken, options);
    this.insights = new MetaInsightsClient(accessToken, options);
    this.user = new MetaUserClient(accessToken, options);
    this.webhook = new MetaWebhookClient(accessToken, options);
  }
}
