import { IDomainEvent } from '@rrss-auto/domain';
import { MembershipId } from '../value-objects/MembershipId';

export class MemberRoleChanged implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly membershipId: MembershipId,
    public readonly previousRoleId: string,
    public readonly newRoleId: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): MembershipId {
    return this.membershipId;
  }
}
