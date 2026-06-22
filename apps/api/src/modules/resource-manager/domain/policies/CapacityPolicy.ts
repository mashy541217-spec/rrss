import { ValueObject } from '@rrss-auto/domain';
import { Capacity } from '../value-objects/Capacity';

interface CapacityPolicyProps {
  maxCapacity: Capacity;
  alertThresholdPercentage: number;
}

export class CapacityPolicy extends ValueObject<CapacityPolicyProps> {
  private constructor(props: CapacityPolicyProps) {
    super(props);
  }

  get maxCapacity(): Capacity { return this.props.maxCapacity; }
  get alertThresholdPercentage(): number { return this.props.alertThresholdPercentage; }

  public static create(props: CapacityPolicyProps): CapacityPolicy {
    if (props.alertThresholdPercentage <= 0 || props.alertThresholdPercentage > 100) {
      throw new Error('Alert threshold must be between 1 and 100');
    }
    return new CapacityPolicy(props);
  }
}
