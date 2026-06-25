import { IDomainEvent } from './DomainEvent';

export interface IEventBus {
  /**
   * Publishes an event to all registered handlers
   */
  publish(event: IDomainEvent | any): Promise<void>;
  
  /**
   * Publishes multiple events
   */
  publishAll(events: (IDomainEvent | any)[]): Promise<void>;
}
