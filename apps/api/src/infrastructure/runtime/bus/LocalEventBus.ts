import { Injectable, Logger } from '@nestjs/common';
import { IEventBus, IDomainEvent } from '@rrss-auto/domain';
import { EventHandlerRegistry } from './EventHandlerRegistry';

@Injectable()
export class LocalEventBus implements IEventBus {
  private readonly logger = new Logger(LocalEventBus.name);

  constructor(private readonly registry: EventHandlerRegistry) {}

  async publish(event: IDomainEvent | any): Promise<void> {
    let eventType = event.eventType;
    if (!eventType && event.constructor && event.constructor.name !== 'Object') {
      eventType = event.constructor.name;
    }

    if (!eventType) {
      this.logger.warn('Event without type could not be dispatched.');
      return;
    }

    const handlers = this.registry.getHandlers(eventType);
    
    if (handlers.length === 0) {
      this.logger.debug(`No handlers registered for event type: ${eventType}`);
      return;
    }

    // Execute handlers sequentially (could be parallelized based on requirements)
    for (const handler of handlers) {
      try {
        await handler.handle(event);
      } catch (error) {
        this.logger.error(`Handler ${handler.constructor.name} failed for event ${eventType}`, error);
        throw error;
      }
    }
  }

  async publishAll(events: (IDomainEvent | any)[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
