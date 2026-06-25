import { IERPTransaction } from './IERPTransaction';
import { ERPContext } from '../models/ERPContext';
import { IAccountingModule } from '../modules/IAccountingModule';
import { ISalesModule } from '../modules/ISalesModule';
import { IInventoryModule } from '../modules/IInventoryModule';

export interface IERPSession {
  sessionId: string;
  context: ERPContext;
  
  /**
   * Checks if the session is still valid and authenticated.
   */
  ping(): Promise<boolean>;

  /**
   * Begins a new atomic transaction.
   */
  beginTransaction(): Promise<IERPTransaction>;

  /**
   * Safely logs out and terminates the session.
   */
  close(): Promise<void>;

  // Standard Modules Access
  accounting: IAccountingModule;
  sales: ISalesModule;
  inventory: IInventoryModule;
}
