import { ValueObject } from '@rrss-auto/domain';
import { ResourceType } from '../value-objects/ResourceType';

interface AllocationPolicyProps {
  requiredResourceType: ResourceType;
  mustBeHealthy: boolean;
  requiresExclusiveAccess: boolean;
}

export class AllocationPolicy extends ValueObject<AllocationPolicyProps> {
  private constructor(props: AllocationPolicyProps) {
    super(props);
  }

  get requiredResourceType(): ResourceType { return this.props.requiredResourceType; }
  get mustBeHealthy(): boolean { return this.props.mustBeHealthy; }
  get requiresExclusiveAccess(): boolean { return this.props.requiresExclusiveAccess; }

  public static create(props: AllocationPolicyProps): AllocationPolicy {
    return new AllocationPolicy(props);
  }
}
