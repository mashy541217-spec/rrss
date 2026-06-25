export interface ISecretsVault {
  storeSecret(key: string, value: string, scope: string): Promise<void>;
  retrieveSecret(key: string, scope: string): Promise<string | null>;
  deleteSecret(key: string, scope: string): Promise<void>;
}
