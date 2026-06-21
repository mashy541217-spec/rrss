import { IDomainEvent } from '@rrss-auto/domain';
import { UserId } from '../value-objects/UserId';

export class UserRegistered implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly userId: UserId,
    public readonly email: string,
    public readonly displayName: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): UserId {
    return this.userId;
  }
}
