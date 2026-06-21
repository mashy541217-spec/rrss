export interface IRequestContext {
  get userId(): string | null;
  get tenantId(): string | null;
  get correlationId(): string;
  isAuthenticated(): boolean;
  hasRole(role: string): boolean;
}
