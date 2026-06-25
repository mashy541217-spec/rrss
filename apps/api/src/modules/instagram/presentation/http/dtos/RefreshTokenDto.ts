import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'The OAuth refresh token string' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
