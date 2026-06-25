import { CommerceInventory } from '../entities/CommerceInventory';

export interface IInventoryModule {
  getInventory(productId: string, variantId?: string, locationId?: string): Promise<CommerceInventory>;
  adjustStock(productId: string, quantityDelta: number, reason: string, locationId?: string): Promise<boolean>;
  transferStock(productId: string, quantity: number, fromLocation: string, toLocation: string): Promise<boolean>;
}
