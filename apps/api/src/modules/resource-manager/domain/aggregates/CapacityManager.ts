import { AggregateRoot, ValueObject } from '@rrss-auto/domain';
import { CapacityPolicy } from '../policies/CapacityPolicy';
import { ResourcePool } from './ResourcePool';

export interface CapacityManagerProps {
  policy: CapacityPolicy;
}

export class CapacityManager extends AggregateRoot<CapacityManagerProps, ValueObject<any>> {
  private constructor(props: CapacityManagerProps, id: ValueObject<any>) {
    super(props, id);
  }

  get policy(): CapacityPolicy { return this.props.policy; }

  public static create(policy: CapacityPolicy, id: ValueObject<any>): CapacityManager {
    return new CapacityManager({ policy }, id);
  }

  public evaluatePool(pool: ResourcePool): void {
    const usagePercentage = (pool.usedCapacity / pool.totalCapacity.total) * 100;
    
    if (usagePercentage >= this.policy.alertThresholdPercentage) {
      // Potentially emit an event: CapacityAlertTriggered
    }

    if (pool.usedCapacity > this.policy.maxCapacity.total) {
      // Exceeds max global policy
      throw new Error(`Pool ${pool.type.type} exceeds global capacity policy limits`);
    }
  }
}
