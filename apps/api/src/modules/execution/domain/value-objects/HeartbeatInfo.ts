import { ValueObject } from '@rrss-auto/domain';

/**
 * HeartbeatInfo – tracks when a Worker last reported health.
 * A missed heartbeat beyond the interval is used to detect dead workers.
 */
export interface HeartbeatInfoProps {
  lastHeartbeatAt: Date;
  intervalMs: number;
}

export class HeartbeatInfo extends ValueObject<HeartbeatInfoProps> {
  private constructor(props: HeartbeatInfoProps) { super(props); }

  get lastHeartbeatAt(): Date { return this.props.lastHeartbeatAt; }
  get intervalMs(): number { return this.props.intervalMs; }

  public static create(lastHeartbeatAt: Date, intervalMs: number = 30_000): HeartbeatInfo {
    if (intervalMs <= 0) {
      throw new Error('HeartbeatInfo intervalMs must be positive');
    }
    return new HeartbeatInfo({ lastHeartbeatAt, intervalMs });
  }

  public renew(now: Date = new Date()): HeartbeatInfo {
    return new HeartbeatInfo({ ...this.props, lastHeartbeatAt: now });
  }

  public isMissed(now: Date = new Date(), graceFactor = 2): boolean {
    const elapsed = now.getTime() - this.props.lastHeartbeatAt.getTime();
    return elapsed > this.props.intervalMs * graceFactor;
  }
}
