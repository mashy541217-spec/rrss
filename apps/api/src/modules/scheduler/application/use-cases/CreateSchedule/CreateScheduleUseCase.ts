import { IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';
import { ScheduleFactory } from '../../../domain/factories/ScheduleFactory';
import { SchedulingPolicy } from '../../../domain/value-objects/SchedulingPolicy';
import { PriorityPolicy } from '../../../domain/value-objects/PriorityPolicy';
import { DispatchPriority } from '../../../domain/value-objects/DispatchPriority';

export interface CreateScheduleCommand {
  workspaceRef: string;
  schedulingPolicy: SchedulingPolicy;
  priorityPolicy?: PriorityPolicy;
}

export class CreateScheduleUseCase {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider
  ) {}

  public async execute(command: CreateScheduleCommand): Promise<string> {
    const rawId = this.identifierProvider.nextId();
    
    const schedule = ScheduleFactory.create({
      workspaceRef: command.workspaceRef,
      schedulingPolicy: command.schedulingPolicy,
      priorityPolicy: command.priorityPolicy ?? PriorityPolicy.create(DispatchPriority.NORMAL),
    }, rawId);

    await this.scheduleRepository.save(schedule);
    await this.eventBus.publishAll(schedule.domainEvents);
    schedule.clearDomainEvents();

    return rawId;
  }
}
