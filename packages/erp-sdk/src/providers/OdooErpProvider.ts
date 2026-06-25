import { IERPProvider } from '../core/IERPProvider';
import { IERPSession } from '../core/IERPSession';
import { IERPTransaction } from '../core/IERPTransaction';
import { ERPContext } from '../models/ERPContext';
import { IAccountingModule } from '../modules/IAccountingModule';
import { ISalesModule } from '../modules/ISalesModule';
import { IInventoryModule } from '../modules/IInventoryModule';

class MockOdooTransaction implements IERPTransaction {
  async commit(): Promise<void> {}
  async rollback(): Promise<void> {}
  isActive(): boolean { return true; }
}

class MockOdooSession implements IERPSession {
  constructor(public sessionId: string, public context: ERPContext) {}

  async ping(): Promise<boolean> { return true; }
  async beginTransaction(): Promise<IERPTransaction> { return new MockOdooTransaction(); }
  async close(): Promise<void> { console.log(`[Odoo] XML-RPC Session closed.`); }

  accounting: IAccountingModule = {
    createInvoice: async (data) => { console.log(`[Odoo XML-RPC] account.move.create`); return { type: 'INVOICE', data }; },
    getInvoice: async (id) => null,
    recordPayment: async (id, amount, method) => true,
    getChartOfAccounts: async () => []
  };

  sales: ISalesModule = {
    createOrder: async (data) => { console.log(`[Odoo XML-RPC] sale.order.create`); return { type: 'ORDER', data }; },
    getOrder: async (id) => null,
    createCustomer: async (data) => { console.log(`[Odoo XML-RPC] res.partner.create`); return { type: 'CUSTOMER', data }; },
    getCustomer: async (id) => null
  };

  inventory: IInventoryModule = {
    checkStock: async (id, loc) => { return 100; },
    createProduct: async (data) => { return { type: 'PRODUCT', data }; },
    adjustStock: async (id, qty, reason) => { return true; }
  };
}

export class OdooErpProvider implements IERPProvider {
  supportedContexts = [ERPContext.API];

  async login(credentials: Record<string, string>, context: ERPContext = ERPContext.API): Promise<IERPSession> {
    console.log(`[Odoo Provider] Authenticating via XML-RPC...`);
    return new MockOdooSession(`odoo-session-${Date.now()}`, context);
  }
}
