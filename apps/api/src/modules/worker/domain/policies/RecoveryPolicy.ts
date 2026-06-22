import { ValueObject } from '@rrss-auto/domain';

interface RecoveryPolicyProps {
  autoRestartAllowed: boolean;
  maxRestartsBeforeTermination: number;
}

export class RecoveryPolicy extends ValueObject<RecoveryPolicyProps> {
  private constructor(props: RecoveryPolicyProps) {
    super(props);
  }

  get autoRestartAllowed(): boolean { return this.props.autoRestartAllowed; }
  get maxRestartsBeforeTermination(): number { return this.props.maxRestartsBeforeTermination; }

  public static create(autoRestartAllowed: boolean, maxRestartsBeforeTermination: number): RecoveryPolicy {
    return new RecoveryPolicy({ autoRestartAllowed, maxRestartsBeforeTermination });
  }
}
