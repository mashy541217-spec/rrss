import { AggregateRoot } from '@rrss-auto/domain';
import { TransactionScope } from '../uow/TransactionScope';

/**
 * Responsible for publishing domain events from an aggregate
 * into the OutboxMessage table within the same transaction scope.
 */
export class OutboxPublisher {
  static async publish(aggregate: AggregateRoot<any, any>, scope: TransactionScope): Promise<void> {
    const events = aggregate.domainEvents;
    
    if (events.length === 0) return;

    const tx = scope.client;

    const outboxMessages = events.map(event => ({
      aggregateType: aggregate.constructor.name,
      aggregateId: event.getAggregateId().toString(),
      eventType: event.constructor.name,
      payload: JSON.parse(JSON.stringify(event)), // Serialize
      status: 'PENDING'
    }));

    await tx.outboxMessage.createMany({
      data: outboxMessages
    });

    aggregate.clearDomainEvents();
  }
}
