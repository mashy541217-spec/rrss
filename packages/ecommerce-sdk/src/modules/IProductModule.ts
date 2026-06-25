import { CommerceProduct } from '../entities/CommerceProduct';

export interface IProductModule {
  getProduct(id: string): Promise<CommerceProduct | null>;
  createProduct(data: Partial<CommerceProduct>): Promise<CommerceProduct>;
  updateProduct(id: string, data: Partial<CommerceProduct>): Promise<CommerceProduct>;
}
