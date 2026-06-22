import { IEventBus } from '@rrss-auto/application';
import { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';
import { ScheduleId } from '../../../domain/value-objects/ScheduleId';
import { ScheduleNotFoundException } from '../../../domain/exceptions/ScheduleNotFoundException';

export interface CancelScheduleCommand {
  scheduleId: string;
  reason: string;
}

export class CancelScheduleUseCase {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CancelScheduleCommand): Promise<void> {
    const schedule = await this.scheduleRepository.findById(ScheduleId.create(command.scheduleId));
    if (!schedule) throw new ScheduleNotFoundException(`Schedule not found: ${command.scheduleId}`);

    schedule.cancel();

    await this.scheduleRepository.save(schedule);
    await this.eventBus.publishAll(schedule.domainEvents);
    schedule.clearDomainEvents();
  }
}
