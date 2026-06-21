import { IEventBus } from '@rrss-auto/application';
import { StartExecutionStepCommand } from './StartExecutionStepCommand';
import { IExecutionRepository } from '../../../domain/repositories/IExecutionRepository';
import { IExecutionStepRepository } from '../../../domain/repositories/IExecutionStepRepository';
import { ExecutionId } from '../../../domain/value-objects/ExecutionId';
import { ExecutionStepId } from '../../../domain/value-objects/ExecutionStepId';
import { ExecutionNotFoundException } from '../../../domain/exceptions/ExecutionNotFoundException';
import { ExecutionStepNotFoundException } from '../../../domain/exceptions/ExecutionStepNotFoundException';
import { ExecutionStatus } from '../../../domain/enums/ExecutionStatus';

export class StartExecutionStepUseCase {
  constructor(
    private readonly executionRepository: IExecutionRepository,
    private readonly stepRepository: IExecutionStepRepository,
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: StartExecutionStepCommand): Promise<void> {
    const executionId = ExecutionId.create(command.executionId);
    const execution = await this.executionRepository.findById(executionId);
    if (!execution) {
      throw new ExecutionNotFoundException(`Execution not found: ${command.executionId}`);
    }

    const stepId = ExecutionStepId.create(command.stepId);
    const step = await this.stepRepository.findById(stepId);
    if (!step) {
      throw new ExecutionStepNotFoundException(`Step not found: ${command.stepId}`);
    }

    if (execution.status === ExecutionStatus.Queued || execution.status === ExecutionStatus.LeasingResources) {
      execution.start(command.workerId);
    }

    step.start();

    await this.stepRepository.save(step);
    await this.executionRepository.save(execution);

    await this.eventBus.publishAll(step.domainEvents);
    await this.eventBus.publishAll(execution.domainEvents);

    step.clearDomainEvents();
    execution.clearDomainEvents();
  }
}
