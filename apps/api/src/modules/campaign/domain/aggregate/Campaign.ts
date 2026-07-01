import { AggregateRoot } from '@rrss-auto/domain';
import { CampaignId } from '../value-objects/CampaignId';
import { CampaignName } from '../value-objects/CampaignName';
import { CampaignDescription } from '../value-objects/CampaignDescription';
import { CampaignStatus } from '../value-objects/CampaignStatus';
import { CampaignPriority } from '../value-objects/CampaignPriority';
import { CampaignStrategy } from '../value-objects/CampaignStrategy';
import { CampaignObjective } from '../value-objects/CampaignObjective';
import { CampaignPeriod } from '../value-objects/CampaignPeriod';
import { CampaignTag } from '../value-objects/CampaignTag';
import { Money } from '../value-objects/Money';
import { Budget } from '../entities/Budget';
import { Schedule } from '../entities/Schedule';
import { Audience } from '../entities/Audience';
import { Goal } from '../entities/Goal';
import { CampaignAnalytics } from '../entities/CampaignAnalytics';
import { Publication } from '../entities/Publication';
import { CampaignChannel } from '../entities/CampaignChannel';
import { CampaignContent } from '../entities/CampaignContent';
import { CampaignExecution } from '../entities/CampaignExecution';
import { CampaignMetricSnapshot } from '../entities/CampaignMetricSnapshot';

import { CampaignState } from '../enums/CampaignState';
import { PublicationStatus } from '../enums/PublicationStatus';
import { CampaignPriority as CampaignPriorityEnum } from '../enums/CampaignPriority';
import { PublicationStrategy } from '../enums/PublicationStrategy';
import { CampaignObjective as CampaignObjectiveEnum } from '../enums/CampaignObjective';
import { ChannelType } from '../enums/ChannelType';
import { ExecutionStrategy } from '../enums/ExecutionStrategy';

import {
  CampaignCreated,
  CampaignActivated,
  CampaignPaused,
  CampaignCompleted,
  CampaignArchived,
  PublicationCreated,
  PublicationScheduled,
  PublicationCancelled,
  ContentAttached,
  ChannelAdded,
  BudgetExceeded,
  CampaignMetricsUpdated,
} from '../events/CampaignEvents';

import { CampaignReadySpecification } from '../specifications/CampaignReadySpecification';

export interface CampaignProps {
  id: CampaignId;
  workspaceRef: string;
  name: CampaignName;
  description: CampaignDescription;
  status: CampaignStatus;
  priority: CampaignPriority;
  objective: CampaignObjective;
  strategy: CampaignStrategy;
  executionStrategy?: ExecutionStrategy;
  publicationGroupId?: string;
  tags: CampaignTag[];
  budget: Budget;
  schedule?: Schedule;
  audience?: Audience;
  goals: Goal[];
  analytics: CampaignAnalytics;

  publications: Publication[];
  channels: CampaignChannel[];
  contents: CampaignContent[];
  executions: CampaignExecution[];
  metricSnapshots: CampaignMetricSnapshot[];

  version: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Campaign extends AggregateRoot<CampaignProps, CampaignId> {
  public get id(): CampaignId { return this.props.id; }
  public get workspaceRef(): string { return this.props.workspaceRef; }
  public get name(): CampaignName { return this.props.name; }
  public get description(): CampaignDescription { return this.props.description; }
  public get status(): CampaignStatus { return this.props.status; }
  public get priority(): CampaignPriority { return this.props.priority; }
  public get objective(): CampaignObjective { return this.props.objective; }
  public get strategy(): CampaignStrategy { return this.props.strategy; }
  public get executionStrategy(): ExecutionStrategy | undefined { return this.props.executionStrategy; }
  public get publicationGroupId(): string | undefined { return this.props.publicationGroupId; }
  public get tags(): CampaignTag[] { return [...this.props.tags]; }
  public get budget(): Budget { return this.props.budget; }
  public get schedule(): Schedule | undefined { return this.props.schedule; }
  public get audience(): Audience | undefined { return this.props.audience; }
  public get goals(): Goal[] { return [...this.props.goals]; }
  public get analytics(): CampaignAnalytics { return this.props.analytics; }

  public get publications(): Publication[] { return [...this.props.publications]; }
  public get channels(): CampaignChannel[] { return [...this.props.channels]; }
  public get contents(): CampaignContent[] { return [...this.props.contents]; }
  public get executions(): CampaignExecution[] { return [...this.props.executions]; }
  public get metricSnapshots(): CampaignMetricSnapshot[] { return [...this.props.metricSnapshots]; }

  public get version(): number { return this.props.version; }
  public get isDeleted(): boolean { return this.props.isDeleted; }
  public get deletedAt(): Date | undefined { return this.props.deletedAt; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }

  private constructor(props: CampaignProps) {
    super(props, props.id);
  }

  public static create(props: {
    id: CampaignId;
    workspaceRef: string;
    name: CampaignName;
    description: CampaignDescription;
    priority: CampaignPriority;
    objective: CampaignObjective;
    strategy: CampaignStrategy;
    tags: CampaignTag[];
    budget: Budget;
  }): Campaign {
    const now = new Date();
    const campaign = new Campaign({
      ...props,
      status: CampaignStatus.create(CampaignState.Draft),
      goals: [],
      analytics: CampaignAnalytics.empty(props.id.value),
      publications: [],
      channels: [],
      contents: [],
      executions: [],
      metricSnapshots: [],
      version: 1,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    campaign.addDomainEvent(new CampaignCreated(
      campaign.id.value,
      campaign.workspaceRef,
      campaign.name.value
    ));

    return campaign;
  }

  public static reconstitute(props: CampaignProps): Campaign {
    return new Campaign(props);
  }

  private transitionTo(newState: CampaignState): void {
    const current = this.props.status.value;
    
    // Validate transitions
    const allowed = this.validateTransition(current, newState);
    if (!allowed) {
      throw new Error('Invalid campaign state transition from ' + current + ' to ' + newState);
    }

    this.props.status = CampaignStatus.create(newState);
    this.props.updatedAt = new Date();
  }

  private validateTransition(current: CampaignState, next: CampaignState): boolean {
    if (next === CampaignState.Archived) return true; // Can archive from any state
    
    switch (current) {
      case CampaignState.Draft:
        return next === CampaignState.Ready || next === CampaignState.Cancelled;
      case CampaignState.Ready:
        return next === CampaignState.Scheduled || next === CampaignState.Running || next === CampaignState.Cancelled;
      case CampaignState.Scheduled:
        return next === CampaignState.Running || next === CampaignState.Paused || next === CampaignState.Cancelled;
      case CampaignState.Running:
        return next === CampaignState.Paused || next === CampaignState.Completed || next === CampaignState.Cancelled;
      case CampaignState.Paused:
        return next === CampaignState.Running || next === CampaignState.Cancelled;
      default:
        return false;
    }
  }

  public activate(): void {
    const spec = new CampaignReadySpecification();
    if (!spec.isSatisfiedBy(this)) {
      throw new Error('Campaign is not ready for activation (requires content and channels)');
    }
    this.transitionTo(CampaignState.Ready);
    this.addDomainEvent(new CampaignActivated(this.id.value));
  }

  public pause(): void {
    this.transitionTo(CampaignState.Paused);
    this.addDomainEvent(new CampaignPaused(this.id.value));
  }

  public complete(): void {
    this.transitionTo(CampaignState.Completed);
    this.addDomainEvent(new CampaignCompleted(this.id.value));
  }

  public cancel(): void {
    this.transitionTo(CampaignState.Cancelled);
    // Cancel pending publications
    this.props.publications.forEach(pub => {
      if (pub.status.value === PublicationStatus.Scheduled || pub.status.value === PublicationStatus.Draft) {
        pub.cancel();
        this.addDomainEvent(new PublicationCancelled(pub.id.value, this.id.value));
      }
    });
  }

  public archive(): void {
    this.transitionTo(CampaignState.Archived);
    this.props.isDeleted = true;
    this.props.deletedAt = new Date();
    this.addDomainEvent(new CampaignArchived(this.id.value));
  }

  public attachContent(contentId: string, attachedBy: string): void {
    const exists = this.props.contents.some(c => c.contentId === contentId);
    if (exists) return;

    const contentEntity = CampaignContent.create({
      campaignId: this.id.value,
      contentId,
      attachedAt: new Date(),
      attachedBy,
    }, 'cc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9));

    this.props.contents.push(contentEntity);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ContentAttached(this.id.value, contentId, attachedBy));
  }

  public detachContent(contentId: string): void {
    this.props.contents = this.props.contents.filter(c => c.contentId !== contentId);
    this.props.updatedAt = new Date();
  }

  public addChannel(channelId: string, platform: string, type: ChannelType, configuration: Record<string, unknown>): void {
    const exists = this.props.channels.some(c => c.id.value === channelId);
    if (exists) return;

    const channelEntity = CampaignChannel.create({
      campaignId: this.id.value,
      platform: { value: platform } as any,
      type,
      configuration,
    }, { value: channelId } as any);

    this.props.channels.push(channelEntity);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ChannelAdded(this.id.value, channelId, platform));
  }

  public removeChannel(channelId: string): void {
    this.props.channels = this.props.channels.filter(c => c.id.value !== channelId);
    this.props.updatedAt = new Date();
  }

  public updateBudget(budget: Budget): void {
    this.props.budget = budget;
    this.props.updatedAt = new Date();
  }

  public updateSchedule(schedule: Schedule): void {
    this.props.schedule = schedule;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new PublicationScheduled(this.id.value, this.id.value, schedule.period.startDate));
  }

  public updateAudience(audience: Audience): void {
    this.props.audience = audience;
    this.props.updatedAt = new Date();
  }

  public updateStrategy(strategy: PublicationStrategy): void {
    this.props.strategy = CampaignStrategy.create(strategy);
    this.props.updatedAt = new Date();
  }

  public generatePublication(publicationId: string, contentId: string, format: string, publishAt?: Date): void {
    const pub = Publication.create({
      campaignId: this.id.value,
      status: { value: PublicationStatus.Draft } as any,
      format: { value: format } as any,
      contentId,
      publishAt,
      metadata: {},
    }, { value: publicationId } as any);

    this.props.publications.push(pub);
    this.props.updatedAt = new Date();
    
    this.addDomainEvent(new PublicationCreated(publicationId, this.id.value, contentId));
    if (publishAt) {
      this.addDomainEvent(new PublicationScheduled(publicationId, this.id.value, publishAt));
    }
  }

  public recordMetrics(clicks: number, impressions: number): void {
    const snapshot = CampaignMetricSnapshot.create({
      campaignId: this.id.value,
      recordedAt: new Date(),
      metrics: { clicks, impressions }
    }, 'cm-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9));

    this.props.metricSnapshots.push(snapshot);
    
    // Update aggregate analytics
    const newAnalytics = CampaignAnalytics.create({
      clicks: this.props.analytics.clicks + clicks,
      impressions: this.props.analytics.impressions + impressions,
      conversionRate: this.props.analytics.conversionRate,
      engagementRate: this.props.analytics.engagementRate,
      additionalMetrics: this.props.analytics.additionalMetrics
    }, this.id.value);

    this.props.analytics = newAnalytics;
    this.props.updatedAt = new Date();
    
    this.addDomainEvent(new CampaignMetricsUpdated(this.id.value, clicks, impressions));
  }
}
