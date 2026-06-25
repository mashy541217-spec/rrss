import { IAdvertisingEvent } from '@rrss-auto/advertising-sdk';

export class GoogleAdsWebhookIngester {
  
  ingestWebhook(topic: string, rawPayload: any): IAdvertisingEvent {
    console.log(`[GoogleAdsWebhookIngester] Processing webhook topic: ${topic}`);

    let standardEventType = 'Unknown';
    if (topic === 'policy_disapproval') standardEventType = 'CreativeRejected';
    if (topic === 'budget_exhausted') standardEventType = 'BudgetExceeded';

    return {
      eventId: `gads-wh-${Date.now()}`,
      eventType: standardEventType,
      entityType: topic.startsWith('policy') ? 'Creative' : 'Campaign',
      entityId: rawPayload.resourceName || 'UNKNOWN',
      timestamp: new Date(),
      payload: rawPayload
    };
  }
}
