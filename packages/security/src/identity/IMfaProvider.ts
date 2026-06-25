export interface IMfaProvider {
  verifyTotp(userId: string, code: string): Promise<boolean>;
  verifyWebAuthn(userId: string, payload: any): Promise<boolean>;
}
