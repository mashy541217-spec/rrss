import { AggregateRoot, DomainEvent, ValueObject } from '@rrss-auto/domain';
import { UnitOfWork } from '../uow/UnitOfWork';
import { PrismaService } from '../prisma/PrismaService';
import { TransactionScope } from '../uow/TransactionScope';
import { BasePrismaRepository } from '../repositories/BasePrismaRepository';
import { AggregateMapper } from '../mappers/AggregateMapper';
import { PersistenceMapper } from '../mappers/PersistenceMapper';
import { OutboxPublisher } from '../outbox/OutboxPublisher';

// Mock Domain Event
class MockEvent implements DomainEvent {
  public occurredAt = new Date();
  constructor(public aggregateId: string, public data: string) {}
  getAggregateId(): ValueObject<any> {
    return { value: this.aggregateId, equals: () => true } as any;
  }
}

// Mock Aggregate
class MockAggregate extends AggregateRoot<any, any> {
  constructor(id: any) {
    super({}, id);
  }
  public doSomething() {
    this.addDomainEvent(new MockEvent(this.id.value, 'something happened'));
  }
}

// Mock Mappers
class MockAggregateMapper implements AggregateMapper<MockAggregate, any, any> {
  toDomain(model: any): MockAggregate {
    return new MockAggregate({ value: model.id });
  }
}
class MockPersistenceMapper implements PersistenceMapper<MockAggregate, any, any> {
  toPersistence(aggregate: MockAggregate): any {
    return { id: aggregate.id.value };
  }
}

// Mock Repository
class MockRepository extends BasePrismaRepository<MockAggregate, any, any> {
  constructor() {
    super(new MockAggregateMapper(), new MockPersistenceMapper());
  }

  async save(aggregate: MockAggregate, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(aggregate, scope, async (tx: any, model: any) => {
      // Simulate Prisma save
      tx.savedModel = model;
    });
  }
}

describe('Persistence Foundation', () => {
  let uow: UnitOfWork;
  let prismaService: any;
  let txMock: any;

  beforeEach(() => {
    txMock = {
      outboxMessage: {
        createMany: jest.fn().mockResolvedValue({ count: 1 })
      }
    };
    prismaService = {
      $transaction: jest.fn(async (callback) => {
        return await callback(txMock);
      })
    };
    uow = new UnitOfWork(prismaService as any);
  });

  it('UnitOfWork should execute operations within a transaction scope', async () => {
    const result = await uow.execute(async (scope) => {
      expect(scope.client).toBe(txMock);
      return 'success';
    });

    expect(prismaService.$transaction).toHaveBeenCalled();
    expect(result).toBe('success');
  });

  it('BasePrismaRepository should save model and publish outbox messages', async () => {
    const repo = new MockRepository();
    const aggregate = new MockAggregate({ value: 'agg-1' });
    aggregate.doSomething();

    expect(aggregate.domainEvents.length).toBe(1);

    await uow.execute(async (scope) => {
      await repo.save(aggregate, scope);
    });

    expect(txMock.savedModel).toEqual({ id: 'agg-1' });
    expect(txMock.outboxMessage.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          aggregateType: 'MockAggregate',
          aggregateId: 'agg-1',
          eventType: 'MockEvent',
          status: 'PENDING'
        })
      ])
    });
    expect(aggregate.domainEvents.length).toBe(0); // Cleared after publish
  });

  it('OutboxPublisher should not call DB if no events exist', async () => {
    const aggregate = new MockAggregate({ value: 'agg-1' });
    const scope = new TransactionScope(txMock);
    
    await OutboxPublisher.publish(aggregate, scope);

    expect(txMock.outboxMessage.createMany).not.toHaveBeenCalled();
  });
});
