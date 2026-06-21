import { AggregateRoot, ValueObject, IRepository } from '@rrss-auto/domain';
import { DataMapper } from '../mapper/DataMapper';

export abstract class BaseRepository<
  TDomainEntity extends AggregateRoot<any, TID>,
  TID extends ValueObject<any>,
  TOrmEntity
> implements IRepository<TDomainEntity, TID> {
  
  constructor(protected readonly mapper: DataMapper<TDomainEntity, TOrmEntity>) {}

  public abstract save(entity: TDomainEntity): Promise<void>;
  public abstract findById(id: TID): Promise<TDomainEntity | null>;
  public abstract delete(id: TID): Promise<void>;
}
