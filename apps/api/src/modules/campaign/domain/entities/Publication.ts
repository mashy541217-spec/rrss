import { Entity } from '@rrss-auto/domain';
import { PublicationId } from '../value-objects/PublicationId';
import { PublicationStatus } from '../value-objects/PublicationStatus';
import { PublicationFormat } from '../value-objects/PublicationFormat';
import { PublicationStatus as PublicationStatusEnum } from '../enums/PublicationStatus';

export interface PublicationMetrics {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  clicks: number;
  videoViews: number;
  engagement: number;
}

export interface PublicationProps {
  campaignId: string;
  groupId?: string;
  status: PublicationStatus;
  format: PublicationFormat;
  contentId: string;
  publishAt?: Date;
  publishedAt?: Date;
  url?: string;
  externalId?: string;
  metadata: Record<string, unknown>;
  metrics?: PublicationMetrics;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Publication extends Entity<PublicationProps, PublicationId> {
  private constructor(props: PublicationProps, id: PublicationId) { super(props, id); }
  get campaignId(): string { return this.props.campaignId; }
  get groupId(): string | undefined { return this.props.groupId; }
  get status(): PublicationStatus { return this.props.status; }
  get format(): PublicationFormat { return this.props.format; }
  get contentId(): string { return this.props.contentId; }
  get publishAt(): Date | undefined { return this.props.publishAt; }
  get publishedAt(): Date | undefined { return this.props.publishedAt; }
  get url(): string | undefined { return this.props.url; }
  get externalId(): string | undefined { return this.props.externalId; }
  get metadata(): Record<string, unknown> { return this.props.metadata; }
  get metrics(): PublicationMetrics | undefined { return this.props.metrics; }
  get createdAt(): Date { return this.props.createdAt || new Date(); }
  get updatedAt(): Date { return this.props.updatedAt || new Date(); }

  public static create(props: PublicationProps, id: PublicationId): Publication {
    return new Publication(props, id);
  }

  public cancel(): void {
    this.props.status = PublicationStatus.create(PublicationStatusEnum.Cancelled);
  }
}