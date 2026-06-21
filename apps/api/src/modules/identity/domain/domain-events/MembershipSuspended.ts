import { IDomainEvent } from '@rrss-auto/domain';
import { MembershipId } from '../value-objects/MembershipId';

export class MembershipSuspended implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly membershipId: MembershipId,
    public readonly reason: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): MembershipId {
    return this.membershipId;
  }
}
