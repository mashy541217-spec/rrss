import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('analytics')
export class AnalyticsController {
  
  @Get('campaigns/:id')
  @HttpCode(HttpStatus.OK)
  getCampaignAnalytics(@Param('id') id: string) {
    return { success: true, data: { entityId: id, entityType: 'Campaign', engagementRate: 4.2 } };
  }

  @Get('businesses/:id')
  @HttpCode(HttpStatus.OK)
  getBusinessAnalytics(@Param('id') id: string) {
    return { success: true, data: { entityId: id, entityType: 'Business', reach: 150000 } };
  }

  @Get('workspaces/:id')
  @HttpCode(HttpStatus.OK)
  getWorkspaceAnalytics(@Param('id') id: string) {
    return { success: true, data: { entityId: id, entityType: 'Workspace', totalConversions: 450 } };
  }
}
