import { IERPProvider } from '../core/IERPProvider';
import { IERPSession } from '../core/IERPSession';
import { IERPTransaction } from '../core/IERPTransaction';
import { ERPContext } from '../models/ERPContext';
import { IAccountingModule } from '../modules/IAccountingModule';
import { ISalesModule } from '../modules/ISalesModule';
import { IInventoryModule } from '../modules/IInventoryModule';
import { ERPRecord } from '../models/ERPRecord';

class MockSapTransaction implements IERPTransaction {
  async commit(): Promise<void> { console.log(`[SAP] BAPI_TRANSACTION_COMMIT executed.`); }
  async rollback(): Promise<void> { console.log(`[SAP] BAPI_TRANSACTION_ROLLBACK executed.`); }
  isActive(): boolean { return true; }
}

class MockSapSession implements IERPSession {
  constructor(public sessionId: string, public context: ERPContext) {}

  async ping(): Promise<boolean> { return true; }
  async beginTransaction(): Promise<IERPTransaction> { return new MockSapTransaction(); }
  async close(): Promise<void> { console.log(`[SAP] Session ${this.sessionId} closed.`); }

  accounting: IAccountingModule = {
    createInvoice: async (data) => { console.log(`[SAP BAPI_INCOMINGINVOICE_CREATE]`); return { type: 'INVOICE', data }; },
    getInvoice: async (id) => null,
    recordPayment: async (id, amount, method) => true,
    getChartOfAccounts: async () => []
  };

  sales: ISalesModule = {
    createOrder: async (data) => { console.log(`[SAP BAPI_SALESORDER_CREATEFROMDAT2]`); return { type: 'ORDER', data }; },
    getOrder: async (id) => null,
    createCustomer: async (data) => { console.log(`[SAP BAPI_CUSTOMER_CREATEFROMDATA1]`); return { type: 'CUSTOMER', data }; },
    getCustomer: async (id) => null
  };

  inventory: IInventoryModule = {
    checkStock: async (id, loc) => { console.log(`[SAP BAPI_MATERIAL_AVAILABILITY]`); return 100; },
    createProduct: async (data) => { console.log(`[SAP BAPI_MATERIAL_SAVEDATA]`); return { type: 'MATERIAL', data }; },
    adjustStock: async (id, qty, reason) => { console.log(`[SAP BAPI_GOODSMVT_CREATE]`); return true; }
  };
}

export class SapErpProvider implements IERPProvider {
  supportedContexts = [ERPContext.API, ERPContext.GUI];

  async login(credentials: Record<string, string>, context: ERPContext = ERPContext.API): Promise<IERPSession> {
    console.log(`[SAP Provider] Authenticating via RFC (Context: ${context})...`);
    // Mock RFC login
    return new MockSapSession(`sap-session-${Date.now()}`, context);
  }
}
