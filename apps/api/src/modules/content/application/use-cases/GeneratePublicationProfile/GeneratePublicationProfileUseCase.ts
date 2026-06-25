import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { GeneratePublicationProfileCommand } from './GeneratePublicationProfileCommand';
import { PublicationProfile } from '../../../domain/aggregate/PublicationProfile';
import { PublicationFormat } from '../../../domain/value-objects/PublicationFormat';

export interface IPublicationProfileRepository {
  save(profile: PublicationProfile): Promise<void>;
  findById(id: string): Promise<PublicationProfile | null>;
}

@Injectable()
@CommandHandler(GeneratePublicationProfileCommand)
export class GeneratePublicationProfileUseCase
  implements
    IUseCase<GeneratePublicationProfileCommand, string>,
    ICommandHandler<GeneratePublicationProfileCommand, string>
{
  constructor(
    @Inject('IPublicationProfileRepository') private readonly repository: IPublicationProfileRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: GeneratePublicationProfileCommand): Promise<string> {
    const profileId = this.identifierProvider.nextId();

    const profile = PublicationProfile.create({
      id: profileId,
      workspaceRef: command.workspaceRef,
      name: command.name,
      createdBy: command.createdBy,
      settings: {
        defaultFormat: command.defaultFormat,
        platformSettings: {},
      },
    });

    // Add a generic target for each platform — formats and specifics are set by adapters
    const defaultFormat = command.defaultFormat
      ? PublicationFormat.create(command.defaultFormat)
      : PublicationFormat.create('DEFAULT');

    for (const platformType of command.platforms) {
      const targetId = this.identifierProvider.nextId();
      profile.addTarget(targetId, platformType, defaultFormat);
    }

    await this.repository.save(profile);
    await this.eventBus.publishAll(profile.domainEvents);
    profile.clearDomainEvents();

    return profileId;
  }
}
