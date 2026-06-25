export class CommerceProduct {
  id?: string;
  sku?: string;
  title?: string;
  description?: string;
  price?: number;
  isActive: boolean = true;
  variants: any[] = []; // Simplified for mock
  attributes: Record<string, any> = {};
}
