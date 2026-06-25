import { ICRMSession } from './ICRMSession';

export interface ICRMProvider {
  /**
   * Authenticates using standard OAuth or API tokens
   */
  authenticate(credentials: Record<string, string>): Promise<ICRMSession>;
}
