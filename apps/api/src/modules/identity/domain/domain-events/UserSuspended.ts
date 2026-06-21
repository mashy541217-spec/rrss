import { IDomainEvent } from '@rrss-auto/domain';
import { UserId } from '../value-objects/UserId';

export class UserSuspended implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly userId: UserId,
    public readonly reason: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UserId {
    return this.userId;
  }
}
