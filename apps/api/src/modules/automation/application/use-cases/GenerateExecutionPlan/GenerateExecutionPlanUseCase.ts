import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { GenerateExecutionPlanCommand } from './GenerateExecutionPlanCommand';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { AutomationId } from '../../../domain/value-objects/AutomationId';
import { ExecutionStrategy } from '../../../domain/enums/ExecutionStrategy';

@Injectable()
@CommandHandler(GenerateExecutionPlanCommand)
export class GenerateExecutionPlanUseCase implements IUseCase<GenerateExecutionPlanCommand, any>, ICommandHandler<GenerateExecutionPlanCommand, any> {
  constructor(
    @Inject('IAutomationRepository') private readonly repository: IAutomationRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: GenerateExecutionPlanCommand): Promise<any> {
    const automationId = AutomationId.create(command.id);
    const automation = await this.repository.findById(automationId);
    if (!automation) throw new Error('Automation not found');

    const plan = automation.generateExecutionPlan(command.strategy || ExecutionStrategy.Sequential);

    await this.repository.save(automation);
    await this.eventBus.publishAll(automation.domainEvents);
    automation.clearDomainEvents();

    return plan;
  }
}
