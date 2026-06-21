import { ValueObject } from '../value-object/ValueObject';

export interface IDomainEvent {
  readonly occurredAt: Date;
  getAggregateId(): ValueObject<any>;
}
