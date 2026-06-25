import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { UploadMediaCommand } from './UploadMediaCommand';
import { IAssetRepository } from '../../../domain/repositories/IAssetRepository';
import { Asset } from '../../../domain/aggregate/Asset';
import { AssetId } from '../../../domain/value-objects/AssetId';
import { MediaId } from '../../../domain/value-objects/MediaId';
import { MediaType } from '../../../domain/value-objects/MediaType';
import { MimeType } from '../../../domain/value-objects/MimeType';
import { FileSize } from '../../../domain/value-objects/FileSize';
import { Checksum } from '../../../domain/value-objects/Checksum';
import { MediaFile } from '../../../domain/entities/MediaFile';
import { EncryptedSecret } from '../../../../credentials/domain/value-objects/EncryptedSecret';

@Injectable()
@CommandHandler(UploadMediaCommand)
export class UploadMediaUseCase
  implements IUseCase<UploadMediaCommand, string>, ICommandHandler<UploadMediaCommand, string>
{
  constructor(
    @Inject('IAssetRepository') private readonly assetRepository: IAssetRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: UploadMediaCommand): Promise<string> {
    const assetId = AssetId.create(this.identifierProvider.nextId());
    const mediaId = MediaId.create(this.identifierProvider.nextId());

    const asset = Asset.create({
      id: assetId,
      workspaceRef: command.workspaceRef,
      uploadedBy: command.uploadedBy,
      mediaType: MediaType.create(command.mediaCategory),
      mimeType: MimeType.create(command.mimeType),
      fileSize: FileSize.create(command.fileSizeBytes),
      checksum: command.checksum ? Checksum.create(command.checksum) : undefined,
      visibility: command.visibility,
      tags: command.tags,
    });

    const mediaFile = MediaFile.create({
      id: mediaId,
      assetId,
      url: command.url,
      bucket: command.bucket,
      storageKey: command.storageKey,
      mimeType: MimeType.create(command.mimeType),
      fileSize: FileSize.create(command.fileSizeBytes),
      checksum: command.checksum ? Checksum.create(command.checksum) : undefined,
      createdAt: new Date(),
    });

    asset.addMediaFile(mediaFile);
    asset.markReady(); // Optimistic: mark ready immediately; real processing pipeline would do this async

    await this.assetRepository.save(asset);
    await this.eventBus.publishAll(asset.domainEvents);
    asset.clearDomainEvents();

    return assetId.value;
  }
}
