import { IEventBus } from '@rrss-auto/application';
import { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';
import { ScheduleId } from '../../../domain/value-objects/ScheduleId';
import { ScheduleNotFoundException } from '../../../domain/exceptions/ScheduleNotFoundException';
import { ExecutionScheduled } from '../../../domain/domain-events/ExecutionScheduled';

export interface RescheduleExecutionCommand {
  scheduleId: string;
  executionId: string;
  newScheduledFor: Date;
  reason: string;
}

export class RescheduleExecutionUseCase {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RescheduleExecutionCommand): Promise<void> {
    const schedule = await this.scheduleRepository.findById(ScheduleId.create(command.scheduleId));
    if (!schedule) throw new ScheduleNotFoundException(`Schedule not found: ${command.scheduleId}`);

    // In a full implementation, we'd adjust the scheduling window or nextRunAt here.
    // For this domain foundation, we emit the event directly to notify the queue layer.
    
    await this.eventBus.publish(new ExecutionScheduled(schedule.id, command.executionId, command.newScheduledFor));

    await this.eventBus.publishAll(schedule.domainEvents);
    schedule.clearDomainEvents();
  }
}
