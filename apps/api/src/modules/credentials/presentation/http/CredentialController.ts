import { Controller, Post, Body, HttpCode, HttpStatus, Param, Delete, Patch, Get, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCredentialDto } from './dtos/CreateCredentialDto';
import { RotateCredentialDto } from './dtos/RotateCredentialDto';
import { RevokeCredentialDto } from './dtos/RevokeCredentialDto';
import { UpdateCredentialMetadataDto } from './dtos/UpdateCredentialMetadataDto';
import { CreateCredentialCommand } from '../../application/use-cases/CreateCredential/CreateCredentialCommand';
import { RotateCredentialCommand } from '../../application/use-cases/RotateCredential/RotateCredentialCommand';
import { RevokeCredentialCommand } from '../../application/use-cases/RevokeCredential/RevokeCredentialCommand';
import { UpdateCredentialMetadataCommand } from '../../application/use-cases/UpdateCredentialMetadata/UpdateCredentialMetadataCommand';
import { ReadCredentialQuery } from '../../application/use-cases/ReadCredential/ReadCredentialQuery';

import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';

@ApiTags('Credentials')
@Controller('credentials')
export class CredentialController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all credentials metadata' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Credentials retrieved successfully' })
  public async list() {
    return this.prisma.credential.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        provider: true,
        scope: true,
        ownerId: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new credential' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Credential created' })
  public async create(@Body() dto: CreateCredentialDto) {
    const command = new CreateCredentialCommand(
      dto.name,
      dto.type,
      dto.provider,
      dto.scope,
      dto.ownerId,
      dto.plainTextSecret,
      dto.metadata,
      dto.policy
    );
    const id = await this.commandBus.execute(command);
    return { id };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Read a credential' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Credential retrieved successfully' })
  public async read(@Param('id') id: string, @Query('accessorId') accessorId: string) {
    const query = new ReadCredentialQuery(id, accessorId);
    return await this.queryBus.execute(query);
  }

  @Post(':id/rotate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate a credential secret' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Credential secret rotated' })
  public async rotate(@Param('id') id: string, @Body() dto: RotateCredentialDto) {
    const command = new RotateCredentialCommand(id, dto.plainTextSecret);
    await this.commandBus.execute(command);
    return { success: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke a credential' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Credential revoked' })
  public async revoke(@Param('id') id: string, @Body() dto: RevokeCredentialDto) {
    const command = new RevokeCredentialCommand(id, dto.reason);
    await this.commandBus.execute(command);
    return { success: true };
  }

  @Patch(':id/metadata')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update credential metadata' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Metadata updated' })
  public async updateMetadata(@Param('id') id: string, @Body() dto: UpdateCredentialMetadataDto) {
    const command = new UpdateCredentialMetadataCommand(id, dto.metadata);
    await this.commandBus.execute(command);
    return { success: true };
  }
}
