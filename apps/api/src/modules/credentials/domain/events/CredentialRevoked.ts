import { IDomainEvent } from '@rrss-auto/domain';
import { CredentialId } from '../value-objects/CredentialId';

export class CredentialRevoked implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly credentialId: string,
    public readonly reason?: string
  ) {
    this.occurredAt = new Date();
  }

  public getAggregateId(): CredentialId {
    return CredentialId.create(this.credentialId);
  }
}
