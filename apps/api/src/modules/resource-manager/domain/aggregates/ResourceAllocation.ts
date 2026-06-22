import { Entity } from '@rrss-auto/domain';
import { ResourceId } from '../value-objects/ResourceId';

export interface ResourceAllocationProps {
  executionId: string;
  assignedAt: Date;
}

export class ResourceAllocation extends Entity<ResourceAllocationProps, ResourceId> {
  private constructor(props: ResourceAllocationProps, id: ResourceId) {
    super(props, id);
  }

  get executionId(): string { return this.props.executionId; }
  get assignedAt(): Date { return this.props.assignedAt; }

  public static create(executionId: string, id: ResourceId): ResourceAllocation {
    return new ResourceAllocation({ executionId, assignedAt: new Date() }, id);
  }
}
