import { ValueObject } from '@rrss-auto/domain';
import { ReservationTimeout } from '../value-objects/ReservationTimeout';

interface ReservationPolicyProps {
  timeout: ReservationTimeout;
  allowQueuing: boolean;
}

export class ReservationPolicy extends ValueObject<ReservationPolicyProps> {
  private constructor(props: ReservationPolicyProps) {
    super(props);
  }

  get timeout(): ReservationTimeout { return this.props.timeout; }
  get allowQueuing(): boolean { return this.props.allowQueuing; }

  public static create(props: ReservationPolicyProps): ReservationPolicy {
    return new ReservationPolicy(props);
  }
}
