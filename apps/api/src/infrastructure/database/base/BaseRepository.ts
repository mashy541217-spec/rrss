import { AggregateRoot, ValueObject } from '@rrss-auto/domain';
import { BaseMapper } from './BaseMapper';
import { PrismaService } from '../prisma/PrismaService';

export abstract class BaseRepository<
  Aggregate extends AggregateRoot<any, ID>,
  ID extends ValueObject<any>,
  Model
> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly mapper: BaseMapper<Aggregate, Model>
  ) {}

  // The Outbox pattern requires saving the aggregate and its events in a single transaction.
  // This base method handles the transaction, saving the aggregate (to be implemented by concrete classes)
  // and saving all domain events to the OutboxMessage table.
  protected async saveWithOutbox(
    aggregate: Aggregate,
    saveAggregateFn: (tx: any) => Promise<void>
  ): Promise<void> {
    const events = aggregate.domainEvents;
    
    await this.prisma.$transaction(async (tx) => {
      // 1. Save Aggregate
      await saveAggregateFn(tx);

      // 2. Save Events to Outbox
      if (events.length > 0) {
        const outboxMessages = events.map(event => ({
          aggregateType: aggregate.constructor.name,
          aggregateId: event.getAggregateId().toString(),
          eventType: event.constructor.name,
          payload: JSON.parse(JSON.stringify(event)), // Serialize event
          status: 'PENDING'
        }));

        await tx.outboxMessage.createMany({
          data: outboxMessages
        });
      }
    });

    // 3. Clear events after successful transaction
    aggregate.clearDomainEvents();
  }
}
