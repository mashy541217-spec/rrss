import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { GeneratePublicationCommand } from './GeneratePublicationCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';

@Injectable()
@CommandHandler(GeneratePublicationCommand)
export class GeneratePublicationUseCase implements IUseCase<GeneratePublicationCommand, string>, ICommandHandler<GeneratePublicationCommand, string> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: GeneratePublicationCommand): Promise<string> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    const publicationId = this.idProvider.nextId();
    campaign.generatePublication(publicationId, command.contentId, command.format, command.publishAt);

    await this.repository.save(campaign);
    await this.eventBus.publishAll(campaign.domainEvents);
    campaign.clearDomainEvents();

    return publicationId;
  }
}