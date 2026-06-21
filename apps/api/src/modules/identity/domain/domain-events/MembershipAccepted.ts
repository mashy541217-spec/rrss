import { IDomainEvent } from '@rrss-auto/domain';
import { MembershipId } from '../value-objects/MembershipId';

export class MembershipAccepted implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly membershipId: MembershipId,
    public readonly userId: string,
    public readonly workspaceId: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): MembershipId {
    return this.membershipId;
  }
}
