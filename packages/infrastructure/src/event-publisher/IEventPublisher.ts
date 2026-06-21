import { IDomainEvent } from '@rrss-auto/domain';

export interface IEventPublisher {
  publish(event: IDomainEvent): Promise<void>;
  publishAll(events: IDomainEvent[]): Promise<void>;
}
