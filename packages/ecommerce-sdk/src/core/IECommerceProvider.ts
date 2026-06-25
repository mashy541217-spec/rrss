import { IProductModule } from '../modules/IProductModule';
import { IOrderModule } from '../modules/IOrderModule';
import { IInventoryModule } from '../modules/IInventoryModule';

export interface IECommerceSession {
  sessionId: string;
  ping(): Promise<boolean>;
  close(): Promise<void>;

  products: IProductModule;
  orders: IOrderModule;
  inventory: IInventoryModule;
}

export interface IECommerceProvider {
  authenticate(credentials: Record<string, string>): Promise<IECommerceSession>;
}
