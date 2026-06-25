export interface LongLivedTokenConfiguration {
  readonly type: 'LongLivedToken';
  readonly token: string;
  readonly expiresAt?: Date;
}
