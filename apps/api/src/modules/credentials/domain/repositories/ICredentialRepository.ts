import { Credential } from '../aggregate/Credential';
import { CredentialId } from '../value-objects/CredentialId';

export interface ICredentialRepository {
  save(credential: Credential): Promise<void>;
  findById(id: CredentialId): Promise<Credential | null>;
  delete(id: CredentialId): Promise<void>;
}
