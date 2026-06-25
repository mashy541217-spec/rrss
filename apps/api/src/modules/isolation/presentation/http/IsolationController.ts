import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EvaluateIsolationCommand } from '../../application/EvaluateIsolationUseCase';
import { ProvisionIsolationCommand } from '../../application/ProvisionIsolationUseCase';
import { ProvisioningStore } from '../../application/ProvisioningStore';

@ApiTags('Infrastructure Isolation')
@Controller('isolation')
export class IsolationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly store: ProvisioningStore
  ) {}

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Evaluate and allocate isolated execution environments' })
  @ApiResponse({ status: 200, description: 'Evaluation decision executed successfully' })
  public async evaluate(
    @Body() body: { workspaceId: string; provider: string; accountId: string; riskLevel?: 'high' | 'medium' | 'low' }
  ) {
    const command = new EvaluateIsolationCommand(
      body.workspaceId,
      body.provider,
      body.accountId,
      body.riskLevel
    );
    const decision = await this.commandBus.execute(command);
    return {
      accountId: decision.accountId,
      provider: decision.provider,
      workspaceId: decision.workspaceId,
      evaluatedAt: decision.evaluatedAt,
      decision: decision.result
    };
  }

  @Post('provision')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Provision isolated infrastructure for connected account' })
  @ApiResponse({ status: 202, description: 'Provisioning process initiated successfully' })
  public async provision(
    @Body() body: { workspaceId: string; provider: string; accountId: string; riskLevel?: 'high' | 'medium' | 'low' }
  ) {
    const command = new ProvisionIsolationCommand(
      body.workspaceId,
      body.provider,
      body.accountId,
      body.riskLevel
    );
    await this.commandBus.execute(command);
    return {
      status: 'INITIATED',
      accountId: body.accountId
    };
  }

  @Get('provision/status/:accountId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get status of provisioning process' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  public async getStatus(@Param('accountId') accountId: string) {
    const checklist = this.store.get(accountId);
    if (!checklist) {
      throw new NotFoundException(`Provisioning checklist for account ${accountId} not found`);
    }
    return checklist;
  }
}
