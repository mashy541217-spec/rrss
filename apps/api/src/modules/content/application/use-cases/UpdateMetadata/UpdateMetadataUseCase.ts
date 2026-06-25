import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { UpdateMetadataCommand } from './UpdateMetadataCommand';
import { IContentRepository } from '../../../domain/repositories/IContentRepository';
import { ContentId } from '../../../domain/value-objects/ContentId';
import { ContentMetadata } from '../../../domain/entities/ContentMetadata';
import { Caption } from '../../../domain/value-objects/Caption';
import { Hashtag } from '../../../domain/value-objects/Hashtag';
import { SeoTitle } from '../../../domain/value-objects/SeoTitle';
import { SeoDescription } from '../../../domain/value-objects/SeoDescription';
import { ThumbnailReference } from '../../../domain/value-objects/ThumbnailReference';

@Injectable()
@CommandHandler(UpdateMetadataCommand)
export class UpdateMetadataUseCase
  implements IUseCase<UpdateMetadataCommand, void>, ICommandHandler<UpdateMetadataCommand, void>
{
  constructor(
    @Inject('IContentRepository') private readonly repository: IContentRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: UpdateMetadataCommand): Promise<void> {
    const contentId = ContentId.create(command.contentId);
    const content = await this.repository.findById(contentId);

    if (!content || content.isDeleted) {
      throw new ApplicationException(`Content ${command.contentId} not found`, 'CONTENT_NOT_FOUND');
    }

    const current = content.metadata;

    const newMetadata = ContentMetadata.create({
      id: current.id,
      caption: command.caption !== undefined ? Caption.create(command.caption) : current.caption,
      hashtags: command.hashtags !== undefined
        ? command.hashtags.map(h => Hashtag.create(h))
        : current.hashtags,
      seoTitle: command.seoTitle !== undefined ? SeoTitle.create(command.seoTitle) : current.seoTitle,
      seoDescription: command.seoDescription !== undefined
        ? SeoDescription.create(command.seoDescription)
        : current.seoDescription,
      thumbnail: command.thumbnailAssetId !== undefined
        ? ThumbnailReference.create(command.thumbnailAssetId)
        : current.thumbnail,
      tags: command.tags !== undefined ? command.tags : current.tags,
      customFields: command.customFields !== undefined
        ? (command.customFields as any as Record<string, unknown>)
        : current.customFields,
    });

    content.updateMetadata(newMetadata);

    await this.repository.save(content);
    await this.eventBus.publishAll(content.domainEvents);
    content.clearDomainEvents();
  }
}
