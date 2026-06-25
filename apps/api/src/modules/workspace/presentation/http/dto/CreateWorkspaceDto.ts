import { IsNotEmpty, IsString, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceLimitsDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  maxBusinesses: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  maxConcurrentExecutions: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  maxProxies: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  maxVms: number;
}

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'My Agency Workspace' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'my-agency' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'America/New_York' })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiProperty({ example: 'en-US' })
  @IsString()
  @IsNotEmpty()
  locale: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({ type: WorkspaceLimitsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => WorkspaceLimitsDto)
  limits: WorkspaceLimitsDto;
}
