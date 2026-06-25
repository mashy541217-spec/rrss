import { PrismaExecutionRepository } from '../database/repositories/PrismaExecutionRepository';
import { ExecutionMapper } from '../database/mappers/ExecutionMapper';
import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';
import { Execution } from '../../domain/aggregates/Execution';
import { ExecutionId } from '../../domain/value-objects/ExecutionId';
import { ExecutionContext } from '../../domain/value-objects/ExecutionContext';
import { WorkspaceRef } from '../../domain/value-objects/WorkspaceRef';
import { IdempotencyKey } from '../../domain/value-objects/IdempotencyKey';
import { ExecutionPriority } from '../../domain/enums/ExecutionPriority';
import { RetryPolicy } from '../../domain/value-objects/RetryPolicy';
import { TransactionScope } from '../../../../infrastructure/database/uow/TransactionScope';
import { ConcurrencyException } from '../../../../infrastructure/database/exceptions/ConcurrencyException';
import { ExecutionStatus } from '../../domain/enums/ExecutionStatus';

describe('PrismaExecutionRepository Integration', () => {
  let prisma: PrismaService;
  let repository: PrismaExecutionRepository;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    const mapper = new ExecutionMapper();
    repository = new PrismaExecutionRepository(prisma, mapper);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.execution.deleteMany();
    await prisma.outboxMessage.deleteMany();
  });

  it('should persist a new Execution and its domain events to the outbox', async () => {
    const id = ExecutionId.create(crypto.randomUUID());
    
    const context = ExecutionContext.create({
      actor: 'user-1',
      intent: 'test-execution',
      priority: ExecutionPriority.Standard,
      workspaceRef: 'ws-1'
    });

    const execution = Execution.request({
      context,
      workspaceRef: WorkspaceRef.create('ws-1'),
      idempotencyKey: IdempotencyKey.create('idemp-1'),
      retryPolicy: RetryPolicy.create({ maxAttempts: 3, baseBackoffMs: 1000, maxBackoffMs: 30000, jitterMs: 500, retryWindowMs: 0 }),
      capabilities: []
    }, id);

    const txScope = new TransactionScope(prisma);
    await repository.save(execution, txScope);

    // Verify it was persisted
    const saved = await repository.findById(id);
    expect(saved).not.toBeNull();
    expect(saved!.status).toBe(ExecutionStatus.Requested);
    expect(saved!.context.actor).toBe('user-1');

    // Verify OutboxMessage
    const outboxEvents = await prisma.outboxMessage.findMany({
      where: { aggregateId: id.value }
    });
    expect(outboxEvents.length).toBeGreaterThan(0);
    expect(outboxEvents[0].eventType).toBe('ExecutionRequested');
  });

  it('should enforce optimistic locking', async () => {
    const id = ExecutionId.create(crypto.randomUUID());
    const context = ExecutionContext.create({
      actor: 'u1', intent: 'i1', priority: ExecutionPriority.Standard, workspaceRef: 'ws-1'
    });

    const execution = Execution.request({
      context,
      workspaceRef: WorkspaceRef.create('ws-1'),
      idempotencyKey: IdempotencyKey.create('idemp-2'),
      retryPolicy: RetryPolicy.create({ maxAttempts: 3, baseBackoffMs: 1000, maxBackoffMs: 30000, jitterMs: 500, retryWindowMs: 0 }),
      capabilities: []
    }, id);

    const txScope = new TransactionScope(prisma);
    await repository.save(execution, txScope); // version 1

    const copy1 = await repository.findById(id);
    const copy2 = await repository.findById(id);

    // Modify copy 1
    copy1!.accept();
    await repository.save(copy1!, txScope); // saves to version 2

    // Modify copy 2 (has version 1)
    copy2!.accept(); // Valid transition logically, but database version is stale
    
    // Attempting to save copy2 should throw ConcurrencyException
    await expect(repository.save(copy2!, txScope)).rejects.toThrow(ConcurrencyException);
  });
});
