import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkspaceSettingsDto {
  @ApiProperty({ example: 'Europe/Madrid' })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiProperty({ example: 'es-ES' })
  @IsString()
  @IsNotEmpty()
  locale: string;
}
