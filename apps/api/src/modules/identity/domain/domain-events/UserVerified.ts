import { IDomainEvent } from '@rrss-auto/domain';
import { UserId } from '../value-objects/UserId';

export class UserVerified implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly userId: UserId) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UserId {
    return this.userId;
  }
}
