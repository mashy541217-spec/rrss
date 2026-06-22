import { ValueObject } from '@rrss-auto/domain';
import { HeartbeatInterval } from '../value-objects/HeartbeatInterval';

interface HeartbeatPolicyProps {
  interval: HeartbeatInterval;
  missedBeatsToOffline: number;
}

export class HeartbeatPolicy extends ValueObject<HeartbeatPolicyProps> {
  private constructor(props: HeartbeatPolicyProps) {
    super(props);
  }

  get interval(): HeartbeatInterval { return this.props.interval; }
  get missedBeatsToOffline(): number { return this.props.missedBeatsToOffline; }

  public static create(props: HeartbeatPolicyProps): HeartbeatPolicy {
    if (props.missedBeatsToOffline <= 0) throw new Error('Missed beats threshold must be greater than 0');
    return new HeartbeatPolicy(props);
  }
}
