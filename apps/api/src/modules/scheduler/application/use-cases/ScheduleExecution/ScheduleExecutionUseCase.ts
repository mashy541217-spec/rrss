import { IEventBus } from '@rrss-auto/application';
import { ISchedulerRepository } from '../../../domain/repositories/ISchedulerRepository';
import { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';
import { SchedulerId } from '../../../domain/value-objects/SchedulerId';
import { ScheduleId } from '../../../domain/value-objects/ScheduleId';
import { SchedulerNotFoundException } from '../../../domain/exceptions/SchedulerNotFoundException';
import { ScheduleNotFoundException } from '../../../domain/exceptions/ScheduleNotFoundException';
import { DispatchResult } from '../../../domain/enums/DispatchResult';
import { ExecutionScheduled } from '../../../domain/domain-events/ExecutionScheduled';
import { ExecutionDeferred } from '../../../domain/domain-events/ExecutionDeferred';

export interface ScheduleExecutionCommand {
  schedulerId: string;
  scheduleId: string;
  executionId: string;
  currentActiveCount: number;
}

export class ScheduleExecutionUseCase {
  constructor(
    private readonly schedulerRepository: ISchedulerRepository,
    private readonly scheduleRepository: IScheduleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ScheduleExecutionCommand): Promise<void> {
    const scheduler = await this.schedulerRepository.findById(SchedulerId.create(command.schedulerId));
    if (!scheduler) throw new SchedulerNotFoundException(`Scheduler not found: ${command.schedulerId}`);

    const schedule = await this.scheduleRepository.findById(ScheduleId.create(command.scheduleId));
    if (!schedule) throw new ScheduleNotFoundException(`Schedule not found: ${command.scheduleId}`);

    const decision = scheduler.evaluateExecution(command.executionId, command.currentActiveCount);

    if (decision.result === DispatchResult.Dispatched) {
      schedule.recordRun(new Date());
      await this.scheduleRepository.save(schedule);
      
      // Emit ExecutionScheduled domain event
      await this.eventBus.publish(new ExecutionScheduled(schedule.id, command.executionId, decision.plan!.scheduledAt));
    } else if (decision.result === DispatchResult.Deferred) {
      await this.eventBus.publish(new ExecutionDeferred(schedule.id, command.executionId, decision.reason));
    }

    await this.eventBus.publishAll(scheduler.domainEvents);
    scheduler.clearDomainEvents();
  }
}
