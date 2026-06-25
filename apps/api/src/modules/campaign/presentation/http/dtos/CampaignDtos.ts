import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignPriority } from '../../../domain/enums/CampaignPriority';
import { CampaignObjective } from '../../../domain/enums/CampaignObjective';
import { PublicationStrategy } from '../../../domain/enums/PublicationStrategy';
import { ChannelType } from '../../../domain/enums/ChannelType';

export class CreateCampaignDto {
  @ApiProperty() @IsString() @IsNotEmpty() workspaceRef: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: CampaignPriority }) @IsEnum(CampaignPriority) priority: CampaignPriority;
  @ApiProperty({ enum: CampaignObjective }) @IsEnum(CampaignObjective) objective: CampaignObjective;
  @ApiProperty({ enum: PublicationStrategy }) @IsEnum(PublicationStrategy) strategy: PublicationStrategy;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) tags: string[];
  @ApiProperty() @IsNumber() budgetLimit: number;
  @ApiProperty() @IsString() @IsNotEmpty() budgetCurrency: string;
  @ApiProperty() @IsString() @IsNotEmpty() budgetType: 'DAILY' | 'TOTAL';
}

export class AttachContentDto {
  @ApiProperty() @IsString() @IsNotEmpty() contentId: string;
  @ApiProperty() @IsString() @IsNotEmpty() attachedBy: string;
}

export class AddChannelDto {
  @ApiProperty() @IsString() @IsNotEmpty() platform: string;
  @ApiProperty({ enum: ChannelType }) @IsEnum(ChannelType) type: ChannelType;
  @ApiProperty() @IsObject() configuration: Record<string, any>;
}

export class ConfigureBudgetDto {
  @ApiProperty() @IsNumber() limitAmount: number;
  @ApiProperty() @IsString() @IsNotEmpty() currency: string;
  @ApiProperty() @IsString() @IsNotEmpty() budgetType: 'DAILY' | 'TOTAL';
}

export class ScheduleCampaignDto {
  @ApiProperty() @IsString() @IsNotEmpty() startDate: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cron?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
}

export class UpdateAudienceDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) segments: string[];
  @ApiProperty() @IsObject() rules: Record<string, any>;
}

export class UpdateStrategyDto {
  @ApiProperty({ enum: PublicationStrategy }) @IsEnum(PublicationStrategy) strategy: PublicationStrategy;
}

export class GeneratePublicationDto {
  @ApiProperty() @IsString() @IsNotEmpty() contentId: string;
  @ApiProperty() @IsString() @IsNotEmpty() format: string;
  @ApiPropertyOptional() @IsOptional() @IsString() publishAt?: string;
}
