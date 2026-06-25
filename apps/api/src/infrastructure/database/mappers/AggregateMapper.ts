import { AggregateRoot, ValueObject } from '@rrss-auto/domain';

/**
 * Defines the contract for mapping a persistence model (DTO/Database Entity)
 * back into a rich Domain Aggregate.
 */
export interface AggregateMapper<
  Aggregate extends AggregateRoot<any, ID>,
  ID extends ValueObject<any>,
  Model
> {
  toDomain(model: Model): Aggregate;
}
