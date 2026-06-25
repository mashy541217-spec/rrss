import { IDomainEvent } from '@rrss-auto/domain';
import { CredentialId } from '../value-objects/CredentialId';

export class CredentialExpired implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly credentialId: string
  ) {
    this.occurredAt = new Date();
  }

  public getAggregateId(): CredentialId {
    return CredentialId.create(this.credentialId);
  }
}
