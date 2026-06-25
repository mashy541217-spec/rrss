import { IECommerceEvent } from '@rrss-auto/ecommerce-sdk';

export class ShopifyWebhookIngester {
  
  verifyHmac(rawBody: string, hmacHeader: string, secret: string): boolean {
    // Standard crypto verification would go here
    return true; 
  }

  ingestWebhook(topic: string, rawPayload: any): IECommerceEvent {
    console.log(`[ShopifyWebhookIngester] Processing webhook topic: ${topic}`);

    let standardEventType = 'Unknown';
    if (topic === 'orders/create') standardEventType = 'OrderCreated';
    if (topic === 'orders/paid') standardEventType = 'OrderPaid';
    if (topic === 'inventory_levels/update') standardEventType = 'InventoryUpdated';

    return {
      eventId: `shp-wh-${Date.now()}`,
      eventType: standardEventType,
      entityType: topic.startsWith('orders') ? 'Order' : 'Inventory',
      entityId: rawPayload.id ? rawPayload.id.toString() : 'UNKNOWN',
      timestamp: new Date(),
      payload: rawPayload
    };
  }
}
