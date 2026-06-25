export interface IECommerceEvent {
  eventId: string;
  eventType: 'OrderCreated' | 'OrderPaid' | 'InventoryUpdated' | 'ShipmentDelivered' | string;
  entityType: 'Order' | 'Product' | 'Inventory' | 'Customer';
  entityId: string;
  timestamp: Date;
  payload: Record<string, any>;
}
