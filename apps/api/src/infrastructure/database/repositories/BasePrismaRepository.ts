import { AggregateRoot, ValueObject } from '@rrss-auto/domain';
import { AggregateMapper } from '../mappers/AggregateMapper';
import { PersistenceMapper } from '../mappers/PersistenceMapper';
import { TransactionScope } from '../uow/TransactionScope';
import { OutboxPublisher } from '../outbox/OutboxPublisher';

/**
 * The core foundation repository that every domain repository will inherit.
 * Provides generic methods to save and delete aggregates securely.
 */
export abstract class BasePrismaRepository<
  Aggregate extends AggregateRoot<any, ID>,
  ID extends ValueObject<any>,
  Model
> {
  constructor(
    protected readonly aggregateMapper: AggregateMapper<Aggregate, ID, Model>,
    protected readonly persistenceMapper: PersistenceMapper<Aggregate, ID, Model>
  ) {}

  /**
   * Saves the aggregate using the provided Prisma transaction scope.
   * Also publishes any domain events to the outbox inside the same transaction.
   * @param aggregate The domain aggregate to persist
   * @param scope The transaction scope
   * @param saveFn The concrete implementation for persisting the model using prisma
   */
  protected async saveWithEvents(
    aggregate: Aggregate,
    scope: TransactionScope,
    saveFn: (tx: any, model: Model) => Promise<void>
  ): Promise<void> {
    const model = this.persistenceMapper.toPersistence(aggregate);
    
    // 1. Save state
    await saveFn(scope.client, model);

    // 2. Publish Domain Events via Outbox
    await OutboxPublisher.publish(aggregate, scope);
  }
}
