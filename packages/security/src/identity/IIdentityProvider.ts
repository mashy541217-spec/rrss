export interface IIdentityProvider {
  authenticateUser(username: string, passwordHash: string): Promise<string>;
  validateToken(token: string): Promise<boolean>;
  mapSsoClaimsToUser(claims: Record<string, any>): any;
}
