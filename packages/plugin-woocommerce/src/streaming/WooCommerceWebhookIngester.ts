import { IECommerceEvent } from '@rrss-auto/ecommerce-sdk';

export class WooCommerceWebhookIngester {
  
  /**
   * Translates a raw WooCommerce webhook payload into the standard Platform E-Commerce Event format.
   */
  ingestWebhook(topic: string, rawPayload: any): IECommerceEvent {
    console.log(`[WooWebhookIngester] Processing webhook topic: ${topic}`);

    let standardEventType = 'Unknown';
    if (topic === 'order.created') standardEventType = 'OrderCreated';
    if (topic === 'order.updated' && rawPayload.status === 'processing') standardEventType = 'OrderPaid';
    if (topic === 'product.updated') standardEventType = 'ProductUpdated';

    return {
      eventId: `woo-wh-${Date.now()}`,
      eventType: standardEventType,
      entityType: topic.startsWith('order') ? 'Order' : 'Product',
      entityId: rawPayload.id ? rawPayload.id.toString() : 'UNKNOWN',
      timestamp: new Date(),
      payload: rawPayload
    };
  }
}
