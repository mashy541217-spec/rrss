import { IDomainEvent } from '@rrss-auto/domain';

export interface IEventHandler<TEvent extends IDomainEvent> {
  handle(event: TEvent): Promise<void>;
}
