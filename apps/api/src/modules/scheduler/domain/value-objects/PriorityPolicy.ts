import { ValueObject } from '@rrss-auto/domain';
import { DispatchPriority } from './DispatchPriority';

export interface PriorityPolicyProps {
  basePriority: DispatchPriority;
  boostOnRetry: boolean;
}

export class PriorityPolicy extends ValueObject<PriorityPolicyProps> {
  private constructor(props: PriorityPolicyProps) {
    super(props);
  }

  get basePriority(): DispatchPriority { return this.props.basePriority; }
  get boostOnRetry(): boolean { return this.props.boostOnRetry; }

  public static create(basePriority: DispatchPriority, boostOnRetry: boolean = false): PriorityPolicy {
    return new PriorityPolicy({ basePriority, boostOnRetry });
  }
}
