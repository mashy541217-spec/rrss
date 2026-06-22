import { ValueObject } from '@rrss-auto/domain';

interface RecoveryPolicyProps {
  autoRecover: boolean;
  maxRecoveryAttempts: number;
}

export class RecoveryPolicy extends ValueObject<RecoveryPolicyProps> {
  private constructor(props: RecoveryPolicyProps) {
    super(props);
  }

  get autoRecover(): boolean { return this.props.autoRecover; }
  get maxRecoveryAttempts(): number { return this.props.maxRecoveryAttempts; }

  public static create(props: RecoveryPolicyProps): RecoveryPolicy {
    if (props.maxRecoveryAttempts < 0) throw new Error('Max recovery attempts cannot be negative');
    return new RecoveryPolicy(props);
  }
}
