import { Subscription } from '../value-objects/Subscription';

export interface IBillingProvider {
  createCustomer(organizationId: string, email: string, name: string): Promise<string>;
  createSubscription(customerId: string, priceId: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  updateSubscription(subscriptionId: string, newPriceId: string): Promise<Subscription>;
}

export interface IInvoiceProvider {
  getLatestInvoice(customerId: string): Promise<{
    id: string;
    amountDue: number;
    amountPaid: number;
    status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
    hostedInvoiceUrl: string;
  }>;
}
