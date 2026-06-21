import { IIdentifierProvider } from '@rrss-auto/domain';
import { IEventBus } from '@rrss-auto/application';
import { RequestExecutionCommand } from './RequestExecutionCommand';
import { ExecutionFactory } from '../../../domain/factories/ExecutionFactory';
import { IExecutionRepository } from '../../../domain/repositories/IExecutionRepository';
import { IdempotencyKey } from '../../../domain/value-objects/IdempotencyKey';
import { IdempotencyConflictException } from '../../../domain/exceptions/IdempotencyConflictException';

export class RequestExecutionUseCase {
  constructor(
    private readonly executionRepository: IExecutionRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: RequestExecutionCommand): Promise<string> {
    const idempotencyKey = IdempotencyKey.create(command.idempotencyKey);
    const existing = await this.executionRepository.findByIdempotencyKey(idempotencyKey);
    
    if (existing) {
      if (existing.workspaceRef.value !== command.workspaceRef || existing.context.intent !== command.intent) {
        throw new IdempotencyConflictException('Idempotency key already in use for a different execution context');
      }
      return existing.id.value; // Return existing ID if exact duplicate request
    }

    const execution = ExecutionFactory.create({
      workspaceRef: command.workspaceRef,
      actor: command.actor,
      intent: command.intent,
      priority: command.priority,
      idempotencyKey: command.idempotencyKey,
      capabilities: command.capabilities,
      policyRef: command.policyRef,
      scheduledFor: command.scheduledFor,
    }, this.identifierProvider);

    await this.executionRepository.save(execution);
    await this.eventBus.publishAll(execution.domainEvents);
    execution.clearDomainEvents();

    return execution.id.value;
  }
}
