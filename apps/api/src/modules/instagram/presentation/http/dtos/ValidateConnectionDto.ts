import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateConnectionDto {
  @ApiProperty({ description: 'The access token to validate' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
