import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsObject, ValidateNested, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CredentialProvider } from '../../../domain/enums/CredentialProvider';
import { CredentialScope } from '../../../domain/enums/CredentialScope';
import { RotationPolicy } from '../../../domain/enums/RotationPolicy';

class CredentialPolicyDto {
  @ApiProperty({ enum: RotationPolicy })
  @IsEnum(RotationPolicy)
  rotationPolicy!: RotationPolicy;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  requiresMfa?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}

export class CreateCredentialDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ enum: CredentialProvider })
  @IsEnum(CredentialProvider)
  provider!: CredentialProvider;

  @ApiProperty({ enum: CredentialScope })
  @IsEnum(CredentialScope)
  scope!: CredentialScope;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plainTextSecret!: string;

  @ApiProperty({ type: Object })
  @IsObject()
  metadata!: Record<string, any>;

  @ApiProperty({ type: CredentialPolicyDto })
  @ValidateNested()
  @Type(() => CredentialPolicyDto)
  policy!: CredentialPolicyDto;
}
