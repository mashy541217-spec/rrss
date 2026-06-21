import { IDomainEvent } from '@rrss-auto/domain';
import { MembershipId } from '../value-objects/MembershipId';

export class MembershipRevoked implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly membershipId: MembershipId,
    public readonly workspaceId: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): MembershipId {
    return this.membershipId;
  }
}
