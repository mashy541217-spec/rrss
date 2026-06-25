export class ApiKey {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly workspaceId: string | null, // null means org-level key
    public readonly name: string,
    public readonly keyHash: string, // Store only the hash, never the plain text
    public readonly scopes: string[], // e.g. ['execution:read', 'execution:write']
    public readonly createdAt: Date,
    public readonly expiresAt: Date | null,
    public lastUsedAt: Date | null,
    public isActive: boolean
  ) {}

  revoke() {
    this.isActive = false;
  }

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return this.expiresAt < new Date();
  }

  isValid(): boolean {
    return this.isActive && !this.isExpired();
  }
}
