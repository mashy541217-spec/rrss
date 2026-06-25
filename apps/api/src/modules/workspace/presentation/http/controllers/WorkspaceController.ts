import { Controller, Post, Get, Patch, Body, Param, HttpCode, HttpStatus, NotFoundException, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateWorkspaceDto } from '../dto/CreateWorkspaceDto';
import { UpdateWorkspaceSettingsDto } from '../dto/UpdateWorkspaceSettingsDto';
import { CreateWorkspaceCommand } from '../../../application/use-cases/CreateWorkspace/CreateWorkspaceCommand';
import { UpdateWorkspaceSettingsCommand } from '../../../application/use-cases/UpdateWorkspaceSettings/UpdateWorkspaceSettingsCommand';
import { ILogger } from '@rrss-auto/logger';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject('ILogger') private readonly logger: ILogger,
    private readonly prisma: PrismaService // For the direct query
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all workspaces' })
  @ApiResponse({ status: 200, description: 'Workspaces listed successfully' })
  async listWorkspaces(): Promise<any[]> {
    this.logger.info('Received request to list workspaces');
    return this.prisma.workspace.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'Workspace successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createWorkspace(@Body() dto: CreateWorkspaceDto): Promise<void> {
    this.logger.info(`Received request to create workspace: ${dto.slug}`);
    
    const command = new CreateWorkspaceCommand(
      dto.name,
      dto.slug,
      dto.timezone,
      dto.locale,
      dto.ownerId,
      dto.limits
    );

    await this.commandBus.execute(command);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get workspace details by ID' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({ status: 200, description: 'Workspace found' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async getWorkspaceById(@Param('id') id: string): Promise<any> {
    this.logger.info(`Received request to get workspace: ${id}`);
    
    // Using Prisma directly as per CQRS read-model principles for simple queries
    const workspace = await this.prisma.workspace.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        settings: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with id ${id} not found`);
    }

    return workspace;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update workspace settings' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiResponse({ status: 200, description: 'Workspace settings successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async updateWorkspaceSettings(
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceSettingsDto
  ): Promise<void> {
    this.logger.info(`Received request to update workspace settings: ${id}`);
    
    const command = new UpdateWorkspaceSettingsCommand(
      id,
      dto.timezone,
      dto.locale
    );

    await this.commandBus.execute(command);
  }
}
