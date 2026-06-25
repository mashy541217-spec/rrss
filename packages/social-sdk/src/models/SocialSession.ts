export interface SocialSession {
  readonly token: string;
  readonly expiresAt?: Date;
  readonly scopes: string[];
}
