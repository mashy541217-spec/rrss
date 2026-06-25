import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus, ApplicationException } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { AddLocalizationCommand } from './AddLocalizationCommand';
import { IContentRepository } from '../../../domain/repositories/IContentRepository';
import { ContentId } from '../../../domain/value-objects/ContentId';
import { LanguageCode } from '../../../domain/value-objects/LanguageCode';
import { Caption } from '../../../domain/value-objects/Caption';

@Injectable()
@CommandHandler(AddLocalizationCommand)
export class AddLocalizationUseCase
  implements IUseCase<AddLocalizationCommand, void>, ICommandHandler<AddLocalizationCommand, void>
{
  constructor(
    @Inject('IContentRepository') private readonly repository: IContentRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: AddLocalizationCommand): Promise<void> {
    const contentId = ContentId.create(command.contentId);
    const content = await this.repository.findById(contentId);

    if (!content || content.isDeleted) {
      throw new ApplicationException(`Content ${command.contentId} not found`, 'CONTENT_NOT_FOUND');
    }

    const localizationId = this.identifierProvider.nextId();
    const languageCode = LanguageCode.create(command.languageCode);
    const caption = Caption.create(command.caption);

    content.addLocalization(localizationId, languageCode, caption, command.addedBy, command.title, command.body);

    await this.repository.save(content);
    await this.eventBus.publishAll(content.domainEvents);
    content.clearDomainEvents();
  }
}
