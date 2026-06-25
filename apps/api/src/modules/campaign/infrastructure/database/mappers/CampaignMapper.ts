import { Injectable } from '@nestjs/common';
import { Campaign as PrismaCampaign } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Campaign } from '../../../domain/aggregate/Campaign';
import { CampaignId } from '../../../domain/value-objects/CampaignId';
import { CampaignName } from '../../../domain/value-objects/CampaignName';
import { CampaignDescription } from '../../../domain/value-objects/CampaignDescription';
import { CampaignStatus } from '../../../domain/value-objects/CampaignStatus';
import { CampaignPriority } from '../../../domain/value-objects/CampaignPriority';
import { CampaignStrategy } from '../../../domain/value-objects/CampaignStrategy';
import { CampaignObjective } from '../../../domain/value-objects/CampaignObjective';
import { CampaignPeriod } from '../../../domain/value-objects/CampaignPeriod';
import { CampaignTag } from '../../../domain/value-objects/CampaignTag';
import { Money } from '../../../domain/value-objects/Money';
import { Currency } from '../../../domain/value-objects/Currency';
import { BudgetAmount } from '../../../domain/value-objects/BudgetAmount';

import { Budget } from '../../../domain/entities/Budget';
import { Schedule } from '../../../domain/entities/Schedule';
import { Audience } from '../../../domain/entities/Audience';
import { Goal } from '../../../domain/entities/Goal';
import { CampaignAnalytics } from '../../../domain/entities/CampaignAnalytics';
import { Publication } from '../../../domain/entities/Publication';
import { CampaignChannel } from '../../../domain/entities/CampaignChannel';
import { CampaignContent } from '../../../domain/entities/CampaignContent';
import { CampaignExecution } from '../../../domain/entities/CampaignExecution';
import { CampaignMetricSnapshot } from '../../../domain/entities/CampaignMetricSnapshot';

import { CampaignState } from '../../../domain/enums/CampaignState';
import { PublicationStatus } from '../../../domain/enums/PublicationStatus';
import { CampaignPriority as CampaignPriorityEnum } from '../../../domain/enums/CampaignPriority';
import { PublicationStrategy } from '../../../domain/enums/PublicationStrategy';
import { CampaignObjective as CampaignObjectiveEnum } from '../../../domain/enums/CampaignObjective';
import { ChannelType } from '../../../domain/enums/ChannelType';

@Injectable()
export class CampaignMapper
  implements
    AggregateMapper<Campaign, CampaignId, any>,
    PersistenceMapper<Campaign, CampaignId, any>
{
  public toDomain(model: any): Campaign {
    const rawBudget = model.budget as any;
    const currency = Currency.create(rawBudget.spent.currency.code || rawBudget.spent.currency || 'USD');
    const budgetAmount = BudgetAmount.create(
      Money.create(rawBudget.amount.limit.amount, Currency.create(rawBudget.amount.limit.currency.code || 'USD')),
      rawBudget.amount.type
    );
    const budget = Budget.create({
      amount: budgetAmount,
      spent: Money.create(rawBudget.spent.amount, currency)
    }, model.id);

    let schedule: Schedule | undefined;
    if (model.schedule) {
      const rawSchedule = model.schedule as any;
      schedule = Schedule.create({
        period: CampaignPeriod.create(new Date(rawSchedule.period.startDate), rawSchedule.period.endDate ? new Date(rawSchedule.period.endDate) : undefined),
        cron: rawSchedule.cron,
        timezone: rawSchedule.timezone,
        status: rawSchedule.status
      }, model.id);
    }

    let audience: Audience | undefined;
    if (model.audience) {
      const rawAudience = model.audience as any;
      audience = Audience.create({
        name: rawAudience.name,
        segments: (rawAudience.segments || []).map((s: any) => ({ value: s.value || s }) as any),
        rules: rawAudience.rules || {}
      }, model.id);
    }

    const goals = (model.goals || []).map((g: any) => Goal.create({
      objective: { value: g.objective.value || g.objective } as any,
      metric: g.metric,
      targetValue: g.targetValue,
      currentValue: g.currentValue || 0
    }, model.id));

    let analytics: CampaignAnalytics;
    if (model.analytics) {
      const rawAnalytics = model.analytics as any;
      analytics = CampaignAnalytics.create({
        clicks: rawAnalytics.clicks || 0,
        impressions: rawAnalytics.impressions || 0,
        conversionRate: rawAnalytics.conversionRate || 0,
        engagementRate: rawAnalytics.engagementRate || 0,
        additionalMetrics: rawAnalytics.additionalMetrics || {}
      }, model.id);
    } else {
      analytics = CampaignAnalytics.empty(model.id);
    }

    const publications = (model.publications || []).map((p: any) => Publication.create({
      campaignId: model.id,
      status: { value: p.status } as any,
      format: { value: p.format } as any,
      contentId: p.contentId,
      publishAt: p.publishAt ? new Date(p.publishAt) : undefined,
      publishedAt: p.publishedAt ? new Date(p.publishedAt) : undefined,
      url: p.url || undefined,
      externalId: p.externalId || undefined,
      metadata: p.metadata || {},
    }, { value: p.id } as any));

    const channels = (model.channels || []).map((c: any) => CampaignChannel.create({
      campaignId: model.id,
      platform: { value: c.platform } as any,
      type: c.type as ChannelType,
      configuration: c.configuration || {}
    }, { value: c.id } as any));

    const contents = (model.contents || []).map((c: any) => CampaignContent.create({
      campaignId: model.id,
      contentId: c.contentId,
      attachedAt: new Date(c.attachedAt),
      attachedBy: c.attachedBy
    }, c.id));

    const executions = (model.executions || []).map((e: any) => CampaignExecution.create({
      campaignId: model.id,
      executionId: e.executionId,
      publicationId: e.publicationId || undefined,
      status: e.status,
      triggeredAt: new Date(e.triggeredAt)
    }, e.id));

    const metricSnapshots = (model.metricSnapshots || []).map((m: any) => CampaignMetricSnapshot.create({
      campaignId: model.id,
      recordedAt: new Date(m.recordedAt),
      metrics: m.metrics || {}
    }, m.id));

    const campaign = Campaign.reconstitute({
      id: CampaignId.create(model.id),
      workspaceRef: model.workspaceRef,
      name: CampaignName.create(model.name),
      description: CampaignDescription.create(model.description || undefined),
      status: CampaignStatus.create(model.status as CampaignState),
      priority: CampaignPriority.create(model.priority as CampaignPriorityEnum),
      objective: CampaignObjective.create(model.objective as CampaignObjectiveEnum),
      strategy: CampaignStrategy.create(model.strategy as PublicationStrategy),
      tags: (model.tags || []).map((t: string) => ({ value: t }) as any),
      budget,
      schedule,
      audience,
      goals,
      analytics,
      publications,
      channels,
      contents,
      executions,
      metricSnapshots,
      version: model.version,
      isDeleted: model.isDeleted,
      deletedAt: model.deletedAt ? new Date(model.deletedAt) : undefined,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
    });

    (campaign as any)['_version'] = model.version;
    campaign.clearDomainEvents();

    return campaign;
  }

  public toPersistence(aggregate: Campaign): any {
    const version = (aggregate as any)['_version'] || 1;

    const budgetPayload = {
      amount: {
        limit: {
          amount: aggregate.budget.amount.limit.amount,
          currency: { code: aggregate.budget.amount.limit.currency.code }
        },
        type: aggregate.budget.amount.type
      },
      spent: {
        amount: aggregate.budget.spent.amount,
        currency: { code: aggregate.budget.spent.currency.code }
      }
    };

    const schedulePayload = aggregate.schedule ? {
      period: {
        startDate: aggregate.schedule.period.startDate.toISOString(),
        endDate: aggregate.schedule.period.endDate ? aggregate.schedule.period.endDate.toISOString() : null
      },
      cron: aggregate.schedule.cron || null,
      timezone: aggregate.schedule.timezone,
      status: aggregate.schedule.status
    } : null;

    const audiencePayload = aggregate.audience ? {
      name: aggregate.audience.name,
      segments: aggregate.audience.segments.map(s => s.value),
      rules: aggregate.audience.rules
    } : null;

    const goalsPayload = aggregate.goals.map(g => ({
      objective: g.objective.value,
      metric: g.metric,
      targetValue: g.targetValue,
      currentValue: g.currentValue
    }));

    const analyticsPayload = {
      clicks: aggregate.analytics.clicks,
      impressions: aggregate.analytics.impressions,
      conversionRate: aggregate.analytics.conversionRate,
      engagementRate: aggregate.analytics.engagementRate,
      additionalMetrics: aggregate.analytics.additionalMetrics
    };

    return {
      id: aggregate.id.value,
      workspaceRef: aggregate.workspaceRef,
      name: aggregate.name.value,
      description: aggregate.description.value || null,
      status: aggregate.status.value,
      priority: aggregate.priority.value,
      objective: aggregate.objective.value,
      strategy: aggregate.strategy.value,
      tags: aggregate.tags.map(t => t.value),
      budget: budgetPayload,
      schedule: schedulePayload,
      audience: audiencePayload,
      goals: goalsPayload,
      analytics: analyticsPayload,
      version: version,
      isDeleted: aggregate.isDeleted,
      deletedAt: aggregate.deletedAt || null,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
