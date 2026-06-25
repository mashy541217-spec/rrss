export enum AuditEventType {
  ORGANIZATION_CREATED = 'ORGANIZATION_CREATED',
  MEMBER_INVITED = 'MEMBER_INVITED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  SUBSCRIPTION_CHANGED = 'SUBSCRIPTION_CHANGED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
  WORKSPACE_CREATED = 'WORKSPACE_CREATED',
  EXECUTION_STARTED = 'EXECUTION_STARTED',
  PLUGIN_INSTALLED = 'PLUGIN_INSTALLED'
}

export class AuditLog {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly workspaceId: string | null,
    public readonly userId: string,
    public readonly eventType: AuditEventType,
    public readonly payload: any,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly timestamp: Date
  ) {}
}
