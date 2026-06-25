import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RevokeCredentialDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
