import { AggregateRoot } from '../aggregate-root/AggregateRoot';
import { ValueObject } from '../value-object/ValueObject';

export interface IRepository<T extends AggregateRoot<any, ID>, ID extends ValueObject<any>> {
  // Base repository interface to be extended by module repository contracts.
}
