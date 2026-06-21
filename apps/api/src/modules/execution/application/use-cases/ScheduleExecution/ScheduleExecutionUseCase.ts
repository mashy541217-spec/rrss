import { IIdentifierProvider } from '@rrss-auto/domain';
import { IEventBus } from '@rrss-auto/application';
import { ScheduleExecutionCommand } from './ScheduleExecutionCommand';
import { IExecutionRepository } from '../../../domain/repositories/IExecutionRepository';
import { IJobRepository } from '../../../domain/repositories/IJobRepository';
import { JobFactory } from '../../../domain/factories/JobFactory';
import { ExecutionId } from '../../../domain/value-objects/ExecutionId';
import { ExecutionNotFoundException } from '../../../domain/exceptions/ExecutionNotFoundException';

export class ScheduleExecutionUseCase {
  constructor(
    private readonly executionRepository: IExecutionRepository,
    private readonly jobRepository: IJobRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: ScheduleExecutionCommand): Promise<string> {
    const id = ExecutionId.create(command.executionId);
    const execution = await this.executionRepository.findById(id);

    if (!execution) {
      throw new ExecutionNotFoundException(`Execution not found: ${command.executionId}`);
    }

    execution.schedule(command.scheduledFor);

    // Create a Job to orchestrate the entire Execution
    const job = JobFactory.create({
      rawId: this.identifierProvider.nextId(),
      executionId: command.executionId,
      workspaceRef: execution.workspaceRef.value,
      priority: execution.context.priority,
      queue: 'default-execution-queue', // Should be configured based on capabilities
    });
    
    // In a real scheduler, if scheduledFor is in the future, the job stays in Created
    // until a timer triggers it. For now, we'll enqueue if it's meant for now.
    if (!command.scheduledFor || command.scheduledFor <= new Date()) {
      job.ready();
      job.enqueue();
      execution.enqueue();
    }

    await this.jobRepository.save(job);
    await this.executionRepository.save(execution);
    
    await this.eventBus.publishAll(execution.domainEvents);
    await this.eventBus.publishAll(job.domainEvents);
    
    execution.clearDomainEvents();
    job.clearDomainEvents();

    return job.id.value;
  }
}
