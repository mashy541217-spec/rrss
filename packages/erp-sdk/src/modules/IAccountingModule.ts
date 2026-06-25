import { ERPRecord } from '../models/ERPRecord';

export interface IAccountingModule {
  createInvoice(data: Record<string, any>): Promise<ERPRecord>;
  getInvoice(id: string): Promise<ERPRecord | null>;
  recordPayment(invoiceId: string, amount: number, method: string): Promise<boolean>;
  getChartOfAccounts(): Promise<ERPRecord[]>;
}
