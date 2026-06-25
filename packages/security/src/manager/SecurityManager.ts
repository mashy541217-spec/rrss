import { IIdentityProvider } from '../identity/IIdentityProvider';
import { ISecretsVault } from '../vault/ISecretsVault';
import { IPolicyEvaluator } from '../rbac/IPolicyEvaluator';
import { IAuditLogger } from '../audit/IAuditLogger';

export class SecurityManager {
  private static instance: SecurityManager;

  public identity!: IIdentityProvider;
  public vault!: ISecretsVault;
  public rbac!: IPolicyEvaluator;
  public audit!: IAuditLogger;

  private constructor() {}

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  public initialize(
    identity: IIdentityProvider,
    vault: ISecretsVault,
    rbac: IPolicyEvaluator,
    audit: IAuditLogger
  ) {
    this.identity = identity;
    this.vault = vault;
    this.rbac = rbac;
    this.audit = audit;
    console.log('[SecurityManager] Global Security Platform initialized.');
  }
}
