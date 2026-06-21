import { IRequestContext } from './IRequestContext';

export interface IAuthorizationService {
  checkAccess(context: IRequestContext, resource: string, action: string): Promise<boolean>;
  requireAccess(context: IRequestContext, resource: string, action: string): Promise<void>;
}
