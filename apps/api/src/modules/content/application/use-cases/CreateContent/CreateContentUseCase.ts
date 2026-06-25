import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { CreateContentCommand } from './CreateContentCommand';
import { IContentRepository } from '../../../domain/repositories/IContentRepository';
import { Content } from '../../../domain/aggregate/Content';
import { ContentId } from '../../../domain/value-objects/ContentId';

@Injectable()
@CommandHandler(CreateContentCommand)
export class CreateContentUseCase
  implements IUseCase<CreateContentCommand, string>, ICommandHandler<CreateContentCommand, string>
{
  constructor(
    @Inject('IContentRepository') private readonly repository: IContentRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: CreateContentCommand): Promise<string> {
    const id = ContentId.create(this.identifierProvider.nextId());

    const content = Content.create({
      id,
      workspaceRef: command.workspaceRef,
      createdBy: command.createdBy,
      title: command.title,
      body: command.body,
      templateId: command.templateId,
    });

    await this.repository.save(content);
    await this.eventBus.publishAll(content.domainEvents);
    content.clearDomainEvents();

    return id.value;
  }
}
