import { ValueObject } from '@rrss-auto/domain';
import { WorkerCapacity } from '../value-objects/WorkerCapacity';

interface WorkerCapacityPolicyProps {
  maxSlots: WorkerCapacity;
  overcommitRatio: number;
}

export class WorkerCapacityPolicy extends ValueObject<WorkerCapacityPolicyProps> {
  private constructor(props: WorkerCapacityPolicyProps) {
    super(props);
  }

  get maxSlots(): WorkerCapacity { return this.props.maxSlots; }
  get overcommitRatio(): number { return this.props.overcommitRatio; }

  public static create(maxSlots: WorkerCapacity, overcommitRatio: number = 1.0): WorkerCapacityPolicy {
    if (overcommitRatio < 1.0) throw new Error('Overcommit ratio cannot be less than 1.0');
    return new WorkerCapacityPolicy({ maxSlots, overcommitRatio });
  }
}
