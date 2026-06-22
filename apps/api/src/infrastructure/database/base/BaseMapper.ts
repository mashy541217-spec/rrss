import { AggregateRoot, ValueObject } from '@rrss-auto/domain';

export abstract class BaseMapper<Entity extends AggregateRoot<any, any>, Model> {
  abstract toPersistence(entity: Entity): Model;
  abstract toDomain(model: Model): Entity;
}
