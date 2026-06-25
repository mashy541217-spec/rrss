import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { AddActionCommand } from './AddActionCommand';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { AutomationId } from '../../../domain/value-objects/AutomationId';

@Injectable()
@CommandHandler(AddActionCommand)
export class AddActionUseCase implements IUseCase<AddActionCommand, void>, ICommandHandler<AddActionCommand, void> {
  constructor(
    @Inject('IAutomationRepository') private readonly repository: IAutomationRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AddActionCommand): Promise<void> {
    const automationId = AutomationId.create(command.id);
    const automation = await this.repository.findById(automationId);
    if (!automation) throw new Error('Automation not found');

    automation.addAction({
      type: command.type,
      name: command.name,
      configuration: command.configuration,
    });

    await this.repository.save(automation);
    await this.eventBus.publishAll(automation.domainEvents);
    automation.clearDomainEvents();
  }
}
