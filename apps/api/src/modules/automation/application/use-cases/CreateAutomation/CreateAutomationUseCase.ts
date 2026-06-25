import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { CreateAutomationCommand } from './CreateAutomationCommand';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { Automation } from '../../../domain/aggregate/Automation';
import { AutomationId } from '../../../domain/value-objects/AutomationId';

@Injectable()
@CommandHandler(CreateAutomationCommand)
export class CreateAutomationUseCase implements IUseCase<CreateAutomationCommand, string>, ICommandHandler<CreateAutomationCommand, string> {
  constructor(
    @Inject('IAutomationRepository') private readonly repository: IAutomationRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: CreateAutomationCommand): Promise<string> {
    const id = AutomationId.create(this.idProvider.nextId());
    const automation = Automation.create(id, {
      workspaceRef: command.workspaceRef,
      name: command.name,
      description: command.description,
    });

    await this.repository.save(automation);
    await this.eventBus.publishAll(automation.domainEvents);
    automation.clearDomainEvents();

    return id.value;
  }
}
