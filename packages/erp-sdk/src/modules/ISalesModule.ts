import { ERPRecord } from '../models/ERPRecord';

export interface ISalesModule {
  createOrder(data: Record<string, any>): Promise<ERPRecord>;
  getOrder(id: string): Promise<ERPRecord | null>;
  createCustomer(data: Record<string, any>): Promise<ERPRecord>;
  getCustomer(id: string): Promise<ERPRecord | null>;
}
