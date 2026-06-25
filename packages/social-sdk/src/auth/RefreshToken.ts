export interface RefreshTokenConfiguration {
  readonly type: 'RefreshToken';
  readonly token: string;
  readonly expiresAt?: Date;
}
