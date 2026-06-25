import { ERPRecord } from '../models/ERPRecord';

export interface IInventoryModule {
  checkStock(productId: string, locationId?: string): Promise<number>;
  createProduct(data: Record<string, any>): Promise<ERPRecord>;
  adjustStock(productId: string, quantity: number, reason: string): Promise<boolean>;
}
