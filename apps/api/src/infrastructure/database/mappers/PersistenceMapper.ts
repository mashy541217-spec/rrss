import { AggregateRoot, ValueObject } from '@rrss-auto/domain';

/**
 * Defines the contract for mapping a rich Domain Aggregate 
 * into a persistence model (DTO/Database Entity).
 */
export interface PersistenceMapper<
  Aggregate extends AggregateRoot<any, ID>,
  ID extends ValueObject<any>,
  Model
> {
  toPersistence(aggregate: Aggregate): Model;
}
