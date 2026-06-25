import { Injectable } from '@nestjs/common';
import { AggregateMapper } from './AggregateMapper';
import { PersistenceMapper } from './PersistenceMapper';
import { AggregateRoot, ValueObject } from '@rrss-auto/domain';

/**
 * Central registry for looking up mappers by Aggregate type.
 * Useful for generic factories and dynamic resolution.
 */
@Injectable()
export class MapperRegistry {
  private aggregateMappers = new Map<string, AggregateMapper<any, any, any>>();
  private persistenceMappers = new Map<string, PersistenceMapper<any, any, any>>();

  public registerAggregateMapper(aggregateName: string, mapper: AggregateMapper<any, any, any>): void {
    this.aggregateMappers.set(aggregateName, mapper);
  }

  public registerPersistenceMapper(aggregateName: string, mapper: PersistenceMapper<any, any, any>): void {
    this.persistenceMappers.set(aggregateName, mapper);
  }

  public getAggregateMapper<
    Aggregate extends AggregateRoot<any, ID>,
    ID extends ValueObject<any>,
    Model
  >(aggregateName: string): AggregateMapper<Aggregate, ID, Model> {
    const mapper = this.aggregateMappers.get(aggregateName);
    if (!mapper) {
      throw new Error(`No AggregateMapper registered for ${aggregateName}`);
    }
    return mapper;
  }

  public getPersistenceMapper<
    Aggregate extends AggregateRoot<any, ID>,
    ID extends ValueObject<any>,
    Model
  >(aggregateName: string): PersistenceMapper<Aggregate, ID, Model> {
    const mapper = this.persistenceMappers.get(aggregateName);
    if (!mapper) {
      throw new Error(`No PersistenceMapper registered for ${aggregateName}`);
    }
    return mapper;
  }
}
