import { ValueObject } from '@rrss-auto/domain';

interface HeartbeatIntervalProps {
  seconds: number;
}

export class HeartbeatInterval extends ValueObject<HeartbeatIntervalProps> {
  private constructor(props: HeartbeatIntervalProps) {
    super(props);
  }

  get seconds(): number { return this.props.seconds; }

  public static create(seconds: number): HeartbeatInterval {
    if (seconds <= 0) throw new Error('HeartbeatInterval must be greater than 0');
    return new HeartbeatInterval({ seconds });
  }
}
