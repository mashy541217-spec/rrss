import { PricingDetails } from './PricingDetails';

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED'
}

export class CommerceOrder {
  id?: string;
  orderNumber?: string;
  customerId?: string;
  status: OrderStatus = OrderStatus.PENDING;
  pricing: PricingDetails = new PricingDetails();
  lineItems: any[] = [];
  shippingAddress?: Record<string, string>;
  createdAt?: Date;
  attributes: Record<string, any> = {};
}
