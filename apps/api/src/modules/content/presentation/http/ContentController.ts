import {
  Controller, Post, Body, Param, Patch, Delete, Get, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateContentDto,
  UploadMediaDto,
  AddLocalizationDto,
  UpdateMetadataDto,
  GeneratePublicationProfileDto,
  ArchiveContentDto,
  DuplicateContentDto,
} from './dtos/ContentDtos';
import { CreateContentCommand } from '../../application/use-cases/CreateContent/CreateContentCommand';
import { UploadMediaCommand } from '../../application/use-cases/UploadMedia/UploadMediaCommand';
import { ArchiveContentCommand } from '../../application/use-cases/ArchiveContent/ArchiveContentCommand';
import { AddLocalizationCommand } from '../../application/use-cases/AddLocalization/AddLocalizationCommand';
import { UpdateMetadataCommand } from '../../application/use-cases/UpdateMetadata/UpdateMetadataCommand';
import { DuplicateContentCommand } from '../../application/use-cases/DuplicateContent/DuplicateContentCommand';
import { GeneratePublicationProfileCommand } from '../../application/use-cases/GeneratePublicationProfile/GeneratePublicationProfileCommand';

@ApiTags('Content Platform')
@Controller('content')
export class ContentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content ID' })
  public async createContent(@Body() dto: CreateContentDto) {
    const id = await this.commandBus.execute(
      new CreateContentCommand(dto.workspaceRef, dto.createdBy, dto.title, dto.body, dto.templateId),
    );
    return { id };
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive content' })
  public async archiveContent(@Param('id') id: string, @Body() dto: ArchiveContentDto) {
    await this.commandBus.execute(new ArchiveContentCommand(id, dto.archivedBy));
    return { success: true };
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate content' })
  public async duplicateContent(@Param('id') id: string, @Body() dto: DuplicateContentDto) {
    const newId = await this.commandBus.execute(
      new DuplicateContentCommand(id, dto.workspaceRef, dto.duplicatedBy, dto.newTitle),
    );
    return { id: newId };
  }

  @Post(':id/localizations')
  @ApiOperation({ summary: 'Add localization to content' })
  public async addLocalization(@Param('id') id: string, @Body() dto: AddLocalizationDto) {
    await this.commandBus.execute(
      new AddLocalizationCommand(id, dto.languageCode, dto.caption, dto.addedBy, dto.title, dto.body),
    );
    return { success: true };
  }

  @Patch(':id/metadata')
  @ApiOperation({ summary: 'Update content metadata' })
  public async updateMetadata(@Param('id') id: string, @Body() dto: UpdateMetadataDto) {
    await this.commandBus.execute(
      new UpdateMetadataCommand(id, dto.updatedBy, dto.caption, dto.hashtags, dto.seoTitle, dto.seoDescription, dto.tags, dto.thumbnailAssetId),
    );
    return { success: true };
  }
}

@ApiTags('Content Platform')
@Controller('assets')
export class AssetController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Upload media asset' })
  @ApiResponse({ status: 201, description: 'Asset ID' })
  public async uploadMedia(@Body() dto: UploadMediaDto) {
    const id = await this.commandBus.execute(
      new UploadMediaCommand(
        dto.workspaceRef,
        dto.uploadedBy,
        dto.mediaCategory,
        dto.mimeType,
        dto.fileSizeBytes,
        dto.url,
        dto.bucket,
        dto.storageKey,
        dto.checksum,
        dto.visibility,
        dto.tags,
      ),
    );
    return { id };
  }
}

@ApiTags('Content Platform')
@Controller('publication-profiles')
export class PublicationProfileController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Generate a publication profile' })
  public async generateProfile(@Body() dto: GeneratePublicationProfileDto) {
    const id = await this.commandBus.execute(
      new GeneratePublicationProfileCommand(
        dto.workspaceRef,
        dto.name,
        dto.createdBy,
        dto.platforms,
        dto.defaultFormat,
      ),
    );
    return { id };
  }
}
