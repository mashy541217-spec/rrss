import { IERPSession } from './IERPSession';
import { ERPContext } from '../models/ERPContext';

export interface IERPProvider {
  /**
   * Supported execution contexts (e.g. GUI vs API)
   */
  supportedContexts: ERPContext[];

  /**
   * Authenticates and returns a new session.
   */
  login(credentials: Record<string, string>, context?: ERPContext): Promise<IERPSession>;
}
