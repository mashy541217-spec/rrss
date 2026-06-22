import { AggregateRoot } from '@rrss-auto/domain';
import { LeaseId } from '../value-objects/LeaseId';
import { ResourceId } from '../value-objects/ResourceId';
import { LeaseStatus } from '../enums/LeaseStatus';
import { LeaseCreated } from '../domain-events/LeaseCreated';
import { LeaseExpired } from '../domain-events/LeaseExpired';
import { ResourceReleased } from '../domain-events/ResourceReleased';

export interface ResourceLeaseProps {
  resourceId: ResourceId;
  executionId: string;
  status: LeaseStatus;
  createdAt: Date;
  expiresAt: Date;
}

export class ResourceLease extends AggregateRoot<ResourceLeaseProps, LeaseId> {
  private constructor(props: ResourceLeaseProps, id: LeaseId) {
    super(props, id);
  }

  get resourceId(): ResourceId { return this.props.resourceId; }
  get executionId(): string { return this.props.executionId; }
  get status(): LeaseStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get expiresAt(): Date { return this.props.expiresAt; }

  public static create(resourceId: ResourceId, executionId: string, durationSeconds: number, id: LeaseId): ResourceLease {
    const expiresAt = new Date(Date.now() + durationSeconds * 1000);
    const lease = new ResourceLease({
      resourceId,
      executionId,
      status: LeaseStatus.Active,
      createdAt: new Date(),
      expiresAt,
    }, id);

    lease.addDomainEvent(new LeaseCreated(id, resourceId, expiresAt));
    return lease;
  }

  public renew(durationSeconds: number): void {
    if (this.props.status !== LeaseStatus.Active && this.props.status !== LeaseStatus.Renewed) {
      throw new Error('Cannot renew an inactive lease');
    }
    this.props.expiresAt = new Date(Date.now() + durationSeconds * 1000);
    this.props.status = LeaseStatus.Renewed;
  }

  public expire(): void {
    if (this.props.status === LeaseStatus.Expired || this.props.status === LeaseStatus.Released) return;
    this.props.status = LeaseStatus.Expired;
    this.addDomainEvent(new LeaseExpired(this.id, this.resourceId));
    this.addDomainEvent(new ResourceReleased(this.resourceId, 'Lease expired'));
  }

  public release(reason: string): void {
    if (this.props.status === LeaseStatus.Released) return;
    this.props.status = LeaseStatus.Released;
    this.addDomainEvent(new ResourceReleased(this.resourceId, reason));
  }
}
