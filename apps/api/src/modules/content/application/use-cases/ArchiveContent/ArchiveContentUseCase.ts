import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { ArchiveContentCommand } from './ArchiveContentCommand';
import { IContentRepository } from '../../../domain/repositories/IContentRepository';
import { ContentId } from '../../../domain/value-objects/ContentId';

@Injectable()
@CommandHandler(ArchiveContentCommand)
export class ArchiveContentUseCase
  implements IUseCase<ArchiveContentCommand, void>, ICommandHandler<ArchiveContentCommand, void>
{
  constructor(
    @Inject('IContentRepository') private readonly repository: IContentRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: ArchiveContentCommand): Promise<void> {
    const contentId = ContentId.create(command.contentId);
    const content = await this.repository.findById(contentId);

    if (!content || content.isDeleted) {
      throw new ApplicationException(`Content ${command.contentId} not found`, 'CONTENT_NOT_FOUND');
    }

    content.archive(command.archivedBy);

    await this.repository.save(content);
    await this.eventBus.publishAll(content.domainEvents);
    content.clearDomainEvents();
  }
}
