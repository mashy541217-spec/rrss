export interface ShortLivedTokenConfiguration {
    readonly type: 'ShortLivedToken';
    readonly token: string;
    readonly expiresAt?: Date;
}
