import { ValueObject } from '@rrss-auto/domain';

interface ReleasePolicyProps {
  gracePeriodSeconds: number;
  forceReleaseOnFailure: boolean;
}

export class ReleasePolicy extends ValueObject<ReleasePolicyProps> {
  private constructor(props: ReleasePolicyProps) {
    super(props);
  }

  get gracePeriodSeconds(): number { return this.props.gracePeriodSeconds; }
  get forceReleaseOnFailure(): boolean { return this.props.forceReleaseOnFailure; }

  public static create(props: ReleasePolicyProps): ReleasePolicy {
    if (props.gracePeriodSeconds < 0) throw new Error('Grace period cannot be negative');
    return new ReleasePolicy(props);
  }
}
