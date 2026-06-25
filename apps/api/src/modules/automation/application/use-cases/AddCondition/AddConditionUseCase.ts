import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { AddConditionCommand } from './AddConditionCommand';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { AutomationId } from '../../../domain/value-objects/AutomationId';

@Injectable()
@CommandHandler(AddConditionCommand)
export class AddConditionUseCase implements IUseCase<AddConditionCommand, void>, ICommandHandler<AddConditionCommand, void> {
  constructor(
    @Inject('IAutomationRepository') private readonly repository: IAutomationRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AddConditionCommand): Promise<void> {
    const automationId = AutomationId.create(command.id);
    const automation = await this.repository.findById(automationId);
    if (!automation) throw new Error('Automation not found');

    automation.addCondition({
      type: command.type,
      expression: command.expression,
      configuration: command.configuration,
    });

    await this.repository.save(automation);
    await this.eventBus.publishAll(automation.domainEvents);
    automation.clearDomainEvents();
  }
}
