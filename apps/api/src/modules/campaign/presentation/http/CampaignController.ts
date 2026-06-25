import { Controller, Post, Delete, Body, Param, Patch, HttpStatus, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  CreateCampaignDto,
  AttachContentDto,
  AddChannelDto,
  ConfigureBudgetDto,
  ScheduleCampaignDto,
  UpdateAudienceDto,
  UpdateStrategyDto,
  GeneratePublicationDto,
} from './dtos/CampaignDtos';

import { CreateCampaignCommand } from '../../application/use-cases/CreateCampaign/CreateCampaignCommand';
import { ActivateCampaignCommand } from '../../application/use-cases/ActivateCampaign/ActivateCampaignCommand';
import { PauseCampaignCommand } from '../../application/use-cases/PauseCampaign/PauseCampaignCommand';
import { CompleteCampaignCommand } from '../../application/use-cases/CompleteCampaign/CompleteCampaignCommand';
import { ArchiveCampaignCommand } from '../../application/use-cases/ArchiveCampaign/ArchiveCampaignCommand';
import { AttachContentCommand } from '../../application/use-cases/AttachContent/AttachContentCommand';
import { DetachContentCommand } from '../../application/use-cases/DetachContent/DetachContentCommand';
import { AddChannelCommand } from '../../application/use-cases/AddChannel/AddChannelCommand';
import { RemoveChannelCommand } from '../../application/use-cases/RemoveChannel/RemoveChannelCommand';
import { ConfigureBudgetCommand } from '../../application/use-cases/ConfigureBudget/ConfigureBudgetCommand';
import { ScheduleCampaignCommand } from '../../application/use-cases/ScheduleCampaign/ScheduleCampaignCommand';
import { UpdateAudienceCommand } from '../../application/use-cases/UpdateAudience/UpdateAudienceCommand';
import { UpdateStrategyCommand } from '../../application/use-cases/UpdateStrategy/UpdateStrategyCommand';
import { GeneratePublicationCommand } from '../../application/use-cases/GeneratePublication/GeneratePublicationCommand';

@ApiTags('Campaign Platform')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create new campaign' })
  public async createCampaign(@Body() dto: CreateCampaignDto) {
    const id = await this.commandBus.execute(
      new CreateCampaignCommand(
        dto.workspaceRef,
        dto.name,
        dto.priority,
        dto.objective,
        dto.strategy,
        dto.tags,
        dto.budgetLimit,
        dto.budgetCurrency,
        dto.budgetType,
        dto.description
      )
    );
    return { id };
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate campaign' })
  public async activateCampaign(@Param('id') id: string) {
    await this.commandBus.execute(new ActivateCampaignCommand(id));
    return { success: true };
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause campaign' })
  public async pauseCampaign(@Param('id') id: string) {
    await this.commandBus.execute(new PauseCampaignCommand(id));
    return { success: true };
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete campaign' })
  public async completeCampaign(@Param('id') id: string) {
    await this.commandBus.execute(new CompleteCampaignCommand(id));
    return { success: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive campaign' })
  public async archiveCampaign(@Param('id') id: string) {
    await this.commandBus.execute(new ArchiveCampaignCommand(id));
    return { success: true };
  }

  @Post(':id/contents')
  @ApiOperation({ summary: 'Attach content to campaign' })
  public async attachContent(@Param('id') id: string, @Body() dto: AttachContentDto) {
    await this.commandBus.execute(new AttachContentCommand(id, dto.contentId, dto.attachedBy));
    return { success: true };
  }

  @Delete(':id/contents/:contentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detach content from campaign' })
  public async detachContent(@Param('id') id: string, @Param('contentId') contentId: string) {
    await this.commandBus.execute(new DetachContentCommand(id, contentId));
    return { success: true };
  }

  @Post(':id/channels')
  @ApiOperation({ summary: 'Add publication channel to campaign' })
  public async addChannel(@Param('id') id: string, @Body() dto: AddChannelDto) {
    const channelId = await this.commandBus.execute(new AddChannelCommand(id, dto.platform, dto.type, dto.configuration));
    return { id: channelId };
  }

  @Delete(':id/channels/:channelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove publication channel from campaign' })
  public async removeChannel(@Param('id') id: string, @Param('channelId') channelId: string) {
    await this.commandBus.execute(new RemoveChannelCommand(id, channelId));
    return { success: true };
  }

  @Post(':id/budget')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Configure campaign budget' })
  public async configureBudget(@Param('id') id: string, @Body() dto: ConfigureBudgetDto) {
    await this.commandBus.execute(new ConfigureBudgetCommand(id, dto.limitAmount, dto.currency, dto.budgetType));
    return { success: true };
  }

  @Post(':id/schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule campaign period' })
  public async scheduleCampaign(@Param('id') id: string, @Body() dto: ScheduleCampaignDto) {
    await this.commandBus.execute(new ScheduleCampaignCommand(id, new Date(dto.startDate), dto.endDate ? new Date(dto.endDate) : undefined, dto.cron, dto.timezone));
    return { success: true };
  }

  @Post(':id/audience')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update campaign audience' })
  public async updateAudience(@Param('id') id: string, @Body() dto: UpdateAudienceDto) {
    await this.commandBus.execute(new UpdateAudienceCommand(id, dto.name, dto.segments, dto.rules));
    return { success: true };
  }

  @Patch(':id/strategy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update campaign publication strategy' })
  public async updateStrategy(@Param('id') id: string, @Body() dto: UpdateStrategyDto) {
    await this.commandBus.execute(new UpdateStrategyCommand(id, dto.strategy));
    return { success: true };
  }

  @Post(':id/publications')
  @ApiOperation({ summary: 'Generate platform-independent publication from campaign' })
  public async generatePublication(@Param('id') id: string, @Body() dto: GeneratePublicationDto) {
    const publicationId = await this.commandBus.execute(
      new GeneratePublicationCommand(id, dto.contentId, dto.format, dto.publishAt ? new Date(dto.publishAt) : undefined)
    );
    return { id: publicationId };
  }
}
