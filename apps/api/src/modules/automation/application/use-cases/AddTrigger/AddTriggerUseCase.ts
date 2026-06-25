import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { AddTriggerCommand } from './AddTriggerCommand';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { AutomationId } from '../../../domain/value-objects/AutomationId';
import { TriggerDefinition } from '../../../domain/entities/TriggerDefinition';

@Injectable()
@CommandHandler(AddTriggerCommand)
export class AddTriggerUseCase implements IUseCase<AddTriggerCommand, void>, ICommandHandler<AddTriggerCommand, void> {
  constructor(
    @Inject('IAutomationRepository') private readonly repository: IAutomationRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AddTriggerCommand): Promise<void> {
    const automationId = AutomationId.create(command.id);
    const automation = await this.repository.findById(automationId);
    if (!automation) throw new Error('Automation not found');

    const trigger = TriggerDefinition.create(command.type, command.configuration);
    automation.addTrigger(trigger);

    await this.repository.save(automation);
    await this.eventBus.publishAll(automation.domainEvents);
    automation.clearDomainEvents();
  }
}
