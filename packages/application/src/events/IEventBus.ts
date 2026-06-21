import { IDomainEvent } from '@rrss-auto/domain';

export interface IEventBus {
  publish(event: IDomainEvent): Promise<void>;
  publishAll(events: IDomainEvent[]): Promise<void>;
}
