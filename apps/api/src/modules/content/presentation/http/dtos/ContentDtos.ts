import { IsString, IsOptional, IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaCategory } from '../../../domain/enums/MediaCategory';
import { AssetVisibility } from '../../../domain/enums/AssetVisibility';

export class CreateContentDto {
  @ApiProperty() @IsString() @IsNotEmpty() workspaceRef: string;
  @ApiProperty() @IsString() @IsNotEmpty() createdBy: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() body?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() templateId?: string;
}

export class UploadMediaDto {
  @ApiProperty() @IsString() @IsNotEmpty() workspaceRef: string;
  @ApiProperty() @IsString() @IsNotEmpty() uploadedBy: string;
  @ApiProperty({ enum: MediaCategory }) @IsEnum(MediaCategory) mediaCategory: MediaCategory;
  @ApiProperty() @IsString() @IsNotEmpty() mimeType: string;
  @ApiProperty() @IsNumber() fileSizeBytes: number;
  @ApiProperty() @IsString() @IsNotEmpty() url: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bucket?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() storageKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checksum?: string;
  @ApiPropertyOptional({ enum: AssetVisibility }) @IsOptional() @IsEnum(AssetVisibility) visibility?: AssetVisibility;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}

export class AddLocalizationDto {
  @ApiProperty() @IsString() @IsNotEmpty() languageCode: string;
  @ApiProperty() @IsString() caption: string;
  @ApiProperty() @IsString() @IsNotEmpty() addedBy: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() body?: string;
}

export class UpdateMetadataDto {
  @ApiProperty() @IsString() @IsNotEmpty() updatedBy: string;
  @ApiPropertyOptional() @IsOptional() @IsString() caption?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) hashtags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() seoTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() seoDescription?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() thumbnailAssetId?: string;
}

export class GeneratePublicationProfileDto {
  @ApiProperty() @IsString() @IsNotEmpty() workspaceRef: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() createdBy: string;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) platforms: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() defaultFormat?: string;
}

export class ArchiveContentDto {
  @ApiProperty() @IsString() @IsNotEmpty() archivedBy: string;
}

export class DuplicateContentDto {
  @ApiProperty() @IsString() @IsNotEmpty() workspaceRef: string;
  @ApiProperty() @IsString() @IsNotEmpty() duplicatedBy: string;
  @ApiPropertyOptional() @IsOptional() @IsString() newTitle?: string;
}
