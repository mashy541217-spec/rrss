export interface DataMapper<TDomainEntity, TOrmEntity> {
  toDomain(raw: TOrmEntity): TDomainEntity;
  toPersistence(domain: TDomainEntity): TOrmEntity;
}
