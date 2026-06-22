import { ValueObject } from '@rrss-auto/domain';

interface ReservationTimeoutProps {
  seconds: number;
}

export class ReservationTimeout extends ValueObject<ReservationTimeoutProps> {
  private constructor(props: ReservationTimeoutProps) {
    super(props);
  }

  get seconds(): number {
    return this.props.seconds;
  }

  public static create(seconds: number): ReservationTimeout {
    if (seconds <= 0) throw new Error('ReservationTimeout must be greater than 0');
    return new ReservationTimeout({ seconds });
  }
}
