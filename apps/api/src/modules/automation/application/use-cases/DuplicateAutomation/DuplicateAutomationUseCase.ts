import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { DuplicateAutomationCommand } from './DuplicateAutomationCommand';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { AutomationId } from '../../../domain/value-objects/AutomationId';

@Injectable()
@CommandHandler(DuplicateAutomationCommand)
export class DuplicateAutomationUseCase implements IUseCase<DuplicateAutomationCommand, string>, ICommandHandler<DuplicateAutomationCommand, string> {
  constructor(
    @Inject('IAutomationRepository') private readonly repository: IAutomationRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: DuplicateAutomationCommand): Promise<string> {
    const sourceId = AutomationId.create(command.sourceId);
    const source = await this.repository.findById(sourceId);
    if (!source) throw new Error('Source automation not found');

    const newId = AutomationId.create(this.idProvider.nextId());
    const duplicate = source.duplicate(newId, command.newName);

    await this.repository.save(duplicate);
    await this.eventBus.publishAll(duplicate.domainEvents);
    duplicate.clearDomainEvents();

    return newId.value;
  }
}
