import { ValueObject } from '../value-object/ValueObject';

export interface IDomainEvent {
  readonly occurredAt: Date;
  getAggregateId(): ValueObject<any>;
}

/** @deprecated Use IDomainEvent instead */
export type DomainEvent = IDomainEvent;
