import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { RemoveActionCommand } from './RemoveActionCommand';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { AutomationId } from '../../../domain/value-objects/AutomationId';

@Injectable()
@CommandHandler(RemoveActionCommand)
export class RemoveActionUseCase implements IUseCase<RemoveActionCommand, void>, ICommandHandler<RemoveActionCommand, void> {
  constructor(
    @Inject('IAutomationRepository') private readonly repository: IAutomationRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RemoveActionCommand): Promise<void> {
    const automationId = AutomationId.create(command.id);
    const automation = await this.repository.findById(automationId);
    if (!automation) throw new Error('Automation not found');

    automation.removeAction();

    await this.repository.save(automation);
    await this.eventBus.publishAll(automation.domainEvents);
    automation.clearDomainEvents();
  }
}
