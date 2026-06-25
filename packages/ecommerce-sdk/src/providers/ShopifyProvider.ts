import { IECommerceProvider, IECommerceSession } from '../core/IECommerceProvider';
import { IProductModule } from '../modules/IProductModule';
import { IOrderModule } from '../modules/IOrderModule';
import { IInventoryModule } from '../modules/IInventoryModule';
import { CommerceProduct } from '../entities/CommerceProduct';
import { CommerceOrder, OrderStatus } from '../entities/CommerceOrder';
import { CommerceInventory } from '../entities/CommerceInventory';

class ShopifySession implements IECommerceSession {
  sessionId = `shopify-session-${Date.now()}`;
  async ping(): Promise<boolean> { return true; }
  async close(): Promise<void> {}

  products: IProductModule = {
    getProduct: async (id) => null,
    createProduct: async (data) => new CommerceProduct(),
    updateProduct: async (id, data) => new CommerceProduct()
  };

  orders: IOrderModule = {
    getOrder: async (id) => null,
    createOrder: async (data) => new CommerceOrder(),
    updateOrderStatus: async (id, status) => true,
    refundOrder: async (id, amount) => true
  };

  inventory: IInventoryModule = {
    getInventory: async (pId, vId, locId) => new CommerceInventory(),
    adjustStock: async (pId, qty, reason, locId) => true,
    transferStock: async (pId, qty, from, to) => true
  };
}

export class ShopifyProvider implements IECommerceProvider {
  async authenticate(credentials: Record<string, string>): Promise<IECommerceSession> {
    console.log(`[ShopifyProvider] Authenticating via Admin API Token...`);
    return new ShopifySession();
  }
}
