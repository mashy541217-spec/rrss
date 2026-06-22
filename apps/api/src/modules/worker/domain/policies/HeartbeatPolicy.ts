import { ValueObject } from '@rrss-auto/domain';
import { HeartbeatInterval } from '../value-objects/HeartbeatInterval';

interface HeartbeatPolicyProps {
  interval: HeartbeatInterval;
  missedThresholdToDegraded: number;
  missedThresholdToUnresponsive: number;
}

export class HeartbeatPolicy extends ValueObject<HeartbeatPolicyProps> {
  private constructor(props: HeartbeatPolicyProps) {
    super(props);
  }

  get interval(): HeartbeatInterval { return this.props.interval; }
  get missedThresholdToDegraded(): number { return this.props.missedThresholdToDegraded; }
  get missedThresholdToUnresponsive(): number { return this.props.missedThresholdToUnresponsive; }

  public static create(
    interval: HeartbeatInterval, 
    missedThresholdToDegraded: number, 
    missedThresholdToUnresponsive: number
  ): HeartbeatPolicy {
    return new HeartbeatPolicy({ interval, missedThresholdToDegraded, missedThresholdToUnresponsive });
  }
}
