import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { ConcurrencyException } from '../../../../../infrastructure/database/traits/OptimisticLock';
import { Campaign } from '../../../domain/aggregate/Campaign';
import { CampaignId } from '../../../domain/value-objects/CampaignId';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignMapper } from '../mappers/CampaignMapper';

@Injectable()
export class PrismaCampaignRepository
  extends BasePrismaRepository<Campaign, CampaignId, any>
  implements ICampaignRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: CampaignMapper
  ) {
    super(mapper, mapper);
  }

  public async save(campaign: Campaign): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const scope = new TransactionScope(tx);

      await this.saveWithEvents(campaign, scope, async (transactionClient, model) => {
        const existing = await transactionClient.campaign.findUnique({
          where: { id: model.id },
        });

        if (!existing) {
          // Create campaign
          await transactionClient.campaign.create({
            data: {
              id: model.id,
              workspaceRef: model.workspaceRef,
              name: model.name,
              description: model.description,
              status: model.status,
              priority: model.priority,
              objective: model.objective,
              strategy: model.strategy,
              tags: model.tags,
              budget: model.budget,
              schedule: model.schedule,
              audience: model.audience,
              goals: model.goals,
              analytics: model.analytics,
              version: model.version,
              isDeleted: model.isDeleted,
              createdAt: model.createdAt,
              updatedAt: model.updatedAt,
            },
          });
        } else {
          // Concurrency lock check
          if (existing.version !== model.version) {
            throw new ConcurrencyException('Campaign', model.id);
          }

          // Update campaign
          const updatedVersion = model.version + 1;
          await transactionClient.campaign.update({
            where: { id: model.id, version: model.version },
            data: {
              name: model.name,
              description: model.description,
              status: model.status,
              priority: model.priority,
              objective: model.objective,
              strategy: model.strategy,
              tags: model.tags,
              budget: model.budget,
              schedule: model.schedule,
              audience: model.audience,
              goals: model.goals,
              analytics: model.analytics,
              version: updatedVersion,
              isDeleted: model.isDeleted,
              deletedAt: model.deletedAt,
              updatedAt: new Date(),
            },
          });

          (campaign as any)['_version'] = updatedVersion;
        }

        // Sync publications
        await transactionClient.publication.deleteMany({
          where: { campaignId: campaign.id.value },
        });
        for (const pub of campaign.publications) {
          await transactionClient.publication.create({
            data: {
              id: pub.id.value,
              campaignId: campaign.id.value,
              status: pub.status.value,
              format: pub.format.value,
              contentId: pub.contentId,
              publishAt: pub.publishAt || null,
              publishedAt: pub.publishedAt || null,
              url: pub.url || null,
              externalId: pub.externalId || null,
              metadata: pub.metadata,
              createdAt: pub.createdAt,
              updatedAt: pub.updatedAt,
            },
          });
        }

        // Sync channels
        await transactionClient.campaignChannel.deleteMany({
          where: { campaignId: campaign.id.value },
        });
        for (const ch of campaign.channels) {
          await transactionClient.campaignChannel.create({
            data: {
              id: ch.id.value,
              campaignId: campaign.id.value,
              platform: ch.platform.value,
              type: ch.type,
              configuration: ch.configuration,
              createdAt: ch.createdAt,
            },
          });
        }

        // Sync contents
        await transactionClient.campaignContent.deleteMany({
          where: { campaignId: campaign.id.value },
        });
        for (const content of campaign.contents) {
          await transactionClient.campaignContent.create({
            data: {
              id: content.id,
              campaignId: campaign.id.value,
              contentId: content.contentId,
              attachedAt: content.attachedAt,
              attachedBy: content.attachedBy,
            },
          });
        }

        // Sync executions
        await transactionClient.campaignExecution.deleteMany({
          where: { campaignId: campaign.id.value },
        });
        for (const exec of campaign.executions) {
          await transactionClient.campaignExecution.create({
            data: {
              id: exec.id,
              campaignId: campaign.id.value,
              executionId: exec.executionId,
              publicationId: exec.publicationId || null,
              status: exec.status,
              triggeredAt: exec.triggeredAt,
            },
          });
        }

        // Sync metric snapshots
        await transactionClient.campaignMetricSnapshot.deleteMany({
          where: { campaignId: campaign.id.value },
        });
        for (const m of campaign.metricSnapshots) {
          await transactionClient.campaignMetricSnapshot.create({
            data: {
              id: m.id,
              campaignId: campaign.id.value,
              recordedAt: m.recordedAt,
              metrics: m.metrics,
            },
          });
        }
      });
    });
  }

  public async findById(id: CampaignId): Promise<Campaign | null> {
    const raw = await this.prisma.campaign.findFirst({
      where: { id: id.value, isDeleted: false },
      include: {
        publications: true,
        channels: true,
        contents: true,
        executions: true,
        metricSnapshots: true,
      },
    });

    if (!raw) return null;
    return this.aggregateMapper.toDomain(raw);
  }

  public async findByWorkspace(workspaceRef: string): Promise<Campaign[]> {
    const raws = await this.prisma.campaign.findMany({
      where: { workspaceRef, isDeleted: false },
      include: {
        publications: true,
        channels: true,
        contents: true,
        executions: true,
        metricSnapshots: true,
      },
    });

    return raws.map((r) => this.aggregateMapper.toDomain(r));
  }

  public async delete(id: CampaignId): Promise<void> {
    await this.prisma.campaign.update({
      where: { id: id.value },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
