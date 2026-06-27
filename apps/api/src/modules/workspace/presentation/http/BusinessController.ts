import { Controller, Get, Post, Put, Body, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';

@Controller()
export class BusinessController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('workspaces/:workspaceId/businesses')
  async create(
    @Param('workspaceId') workspaceId: string,
    @Body() body: { name: string; category: string; logoUrl?: string; brandColor?: string; emailBrand?: any }
  ) {
    const id = `bus-${Date.now()}`;
    return this.prisma.business.create({
      data: {
        id,
        workspaceRef: workspaceId,
        name: body.name,
        category: body.category,
        logoUrl: body.logoUrl || null,
        brandColor: body.brandColor || '#8b5cf6',
        emailBrand: body.emailBrand || {}
      }
    });
  }

  @Get('workspaces/:workspaceId/businesses')
  async list(@Param('workspaceId') workspaceId: string) {
    return this.prisma.business.findMany({
      where: {
        workspaceRef: workspaceId,
        isDeleted: false
      }
    });
  }

  @Get('businesses/:businessId')
  async get(@Param('businessId') businessId: string) {
    const bus = await this.prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!bus || bus.isDeleted) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    return bus;
  }

  @Put('businesses/:businessId')
  async update(
    @Param('businessId') businessId: string,
    @Body() body: { name?: string; category?: string; logoUrl?: string; brandColor?: string; emailBrand?: any }
  ) {
    const bus = await this.prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!bus || bus.isDeleted) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    return this.prisma.business.update({
      where: { id: businessId },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        category: body.category !== undefined ? body.category : undefined,
        logoUrl: body.logoUrl !== undefined ? body.logoUrl : undefined,
        brandColor: body.brandColor !== undefined ? body.brandColor : undefined,
        emailBrand: body.emailBrand !== undefined ? body.emailBrand : undefined
      }
    });
  }
}
