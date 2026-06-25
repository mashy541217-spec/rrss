import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateCredentialMetadataDto {
  @ApiProperty()
  @IsObject()
  metadata!: Record<string, any>;
}
