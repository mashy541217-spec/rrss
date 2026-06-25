export interface ERPRecord {
  id?: string;
  type: string; // e.g., 'INVOICE', 'CUSTOMER', 'PRODUCT'
  data: Record<string, any>;
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    author?: string;
  };
}
