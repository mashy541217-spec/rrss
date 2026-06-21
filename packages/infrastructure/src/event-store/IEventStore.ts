import { IDomainEvent } from '@rrss-auto/domain';

export interface IEventStore {
  append(aggregateId: string, events: IDomainEvent[]): Promise<void>;
  getEventsForAggregate(aggregateId: string): Promise<IDomainEvent[]>;
}
