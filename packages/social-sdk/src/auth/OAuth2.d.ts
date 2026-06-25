export interface OAuth2Configuration {
    readonly type: 'OAuth2';
    readonly clientId: string;
    readonly clientSecret?: string;
    readonly accessToken: string;
    readonly refreshToken?: string;
    readonly expiresAt?: Date;
    readonly scopes?: string[];
}
