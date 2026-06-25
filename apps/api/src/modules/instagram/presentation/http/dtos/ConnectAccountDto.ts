import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class ConnectAccountDto {
  @ApiProperty({ description: 'The workspace reference id' })
  @IsString()
  @IsNotEmpty()
  workspaceId!: string;

  @ApiProperty({ description: 'Display name for the connection link' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Long-lived or short-lived Facebook token' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ description: 'Connection page or configuration metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
