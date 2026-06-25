export class CommerceInventory {
  productId!: string;
  variantId?: string;
  locationId?: string; // Optional for simple single-warehouse platforms
  
  availableStock: number = 0;
  reservedStock: number = 0;
  incomingStock: number = 0;
}
