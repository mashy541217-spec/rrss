import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RotateCredentialDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plainTextSecret!: string;
}
