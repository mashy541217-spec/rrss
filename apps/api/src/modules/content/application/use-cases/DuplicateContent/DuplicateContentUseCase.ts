import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { DuplicateContentCommand } from './DuplicateContentCommand';
import { IContentRepository } from '../../../domain/repositories/IContentRepository';
import { Content } from '../../../domain/aggregate/Content';
import { ContentId } from '../../../domain/value-objects/ContentId';

@Injectable()
@CommandHandler(DuplicateContentCommand)
export class DuplicateContentUseCase
  implements IUseCase<DuplicateContentCommand, string>, ICommandHandler<DuplicateContentCommand, string>
{
  constructor(
    @Inject('IContentRepository') private readonly repository: IContentRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: DuplicateContentCommand): Promise<string> {
    const sourceId = ContentId.create(command.sourceContentId);
    const source = await this.repository.findById(sourceId);

    if (!source || source.isDeleted) {
      throw new ApplicationException(`Source content ${command.sourceContentId} not found`, 'CONTENT_NOT_FOUND');
    }

    const newId = ContentId.create(this.identifierProvider.nextId());
    const copy = Content.create({
      id: newId,
      workspaceRef: command.workspaceRef,
      createdBy: command.duplicatedBy,
      title: command.newTitle ?? (source.title ? `Copy of ${source.title}` : undefined),
      body: source.body,
      templateId: source.templateId,
    });

    await this.repository.save(copy);
    await this.eventBus.publishAll(copy.domainEvents);
    copy.clearDomainEvents();

    return newId.value;
  }
}
