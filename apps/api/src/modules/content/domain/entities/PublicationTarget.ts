import { Entity } from '@rrss-auto/domain';
import { PublicationFormat } from '../value-objects/PublicationFormat';
import { PublicationStatus } from '../enums/PublicationStatus';

export interface PublicationTargetProps {
  id: string;
  profileId: string;
  platformType: string; // e.g. "INSTAGRAM", "TIKTOK" — set by adapter, not hardcoded here
  format: PublicationFormat;
  status: PublicationStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  externalRef?: string; // Platform post ID after publishing
  errorMessage?: string;
}

export class PublicationTarget extends Entity<PublicationTargetProps, any> {
  public get id(): string { return this.props.id; }
  public get profileId(): string { return this.props.profileId; }
  public get platformType(): string { return this.props.platformType; }
  public get format(): PublicationFormat { return this.props.format; }
  public get status(): PublicationStatus { return this.props.status; }
  public get scheduledAt(): Date | undefined { return this.props.scheduledAt; }
  public get publishedAt(): Date | undefined { return this.props.publishedAt; }
  public get externalRef(): string | undefined { return this.props.externalRef; }
  public get errorMessage(): string | undefined { return this.props.errorMessage; }
  public get isPublished(): boolean { return this.props.status === PublicationStatus.PUBLISHED; }

  private constructor(props: PublicationTargetProps) {
    super(props, props.id as any);
  }

  public static create(props: PublicationTargetProps): PublicationTarget {
    return new PublicationTarget(props);
  }

  public markPublished(externalRef: string): void {
    this.props.status = PublicationStatus.PUBLISHED;
    this.props.publishedAt = new Date();
    this.props.externalRef = externalRef;
  }

  public markFailed(errorMessage: string): void {
    this.props.status = PublicationStatus.FAILED;
    this.props.errorMessage = errorMessage;
  }
}
