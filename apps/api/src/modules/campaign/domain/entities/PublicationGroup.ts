import { Entity, ValueObject } from '@rrss-auto/domain';
import { PublicationId } from '../value-objects/PublicationId';
import { PublicationStatus } from '../enums/PublicationStatus';


export enum PublicationGroupStatus {
  Pending = 'Pending',
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
}

export interface PublicationGroupProps {
  campaignId: string;
  status: PublicationGroupStatus;
  publicationIds: string[]; // Store IDs of publications in this group
  startedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export class PublicationGroupId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): PublicationGroupId { return new PublicationGroupId({ value }); }
}

export class PublicationGroup extends Entity<PublicationGroupProps, PublicationGroupId> {
  private constructor(props: PublicationGroupProps, id: PublicationGroupId) { super(props, id); }

  get campaignId(): string { return this.props.campaignId; }
  get status(): PublicationGroupStatus { return this.props.status; }
  get publicationIds(): string[] { return this.props.publicationIds; }
  get startedAt(): Date | undefined { return this.props.startedAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }
  get metadata(): Record<string, any> { return this.props.metadata || {}; }

  public static create(props: PublicationGroupProps, id: PublicationGroupId): PublicationGroup {
    return new PublicationGroup({ ...props, status: props.status || PublicationGroupStatus.Pending }, id);
  }

  public start(): void {
    this.props.status = PublicationGroupStatus.Running;
    this.props.startedAt = new Date();
  }

  public complete(): void {
    this.props.status = PublicationGroupStatus.Completed;
    this.props.completedAt = new Date();
  }

  public fail(): void {
    this.props.status = PublicationGroupStatus.Failed;
  }

  public cancel(): void {
    this.props.status = PublicationGroupStatus.Cancelled;
  }

  public getProgress(publicationsStatusMap: Map<string, PublicationStatus>): number {
    if (this.publicationIds.length === 0) return 0;
    
    let completed = 0;
    for (const id of this.publicationIds) {
      if (publicationsStatusMap.get(id) === PublicationStatus.Published) {
        completed++;
      }
    }
    return (completed / this.publicationIds.length) * 100;
  }
}
