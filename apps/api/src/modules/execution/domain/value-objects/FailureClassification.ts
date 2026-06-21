import { ValueObject } from '@rrss-auto/domain';
import { FailureType } from '../enums/FailureType';

/**
 * FailureClassification – typed failure record per RFC-0001 recovery model.
 *
 * isRecoverable drives retry vs dead-letter decisions.
 */
export interface FailureClassificationProps {
  type: FailureType;
  reason: string;
  isRecoverable: boolean;
}

export class FailureClassification extends ValueObject<FailureClassificationProps> {
  private constructor(props: FailureClassificationProps) { super(props); }

  get type(): FailureType { return this.props.type; }
  get reason(): string { return this.props.reason; }
  get isRecoverable(): boolean { return this.props.isRecoverable; }

  public static create(props: FailureClassificationProps): FailureClassification {
    if (!props.reason || props.reason.trim().length === 0) {
      throw new Error('FailureClassification reason cannot be empty');
    }
    return new FailureClassification(props);
  }

  public static transient(reason: string): FailureClassification {
    return new FailureClassification({ type: FailureType.Transient, reason, isRecoverable: true });
  }

  public static resource(reason: string): FailureClassification {
    return new FailureClassification({ type: FailureType.Resource, reason, isRecoverable: true });
  }

  public static policy(reason: string): FailureClassification {
    return new FailureClassification({ type: FailureType.Policy, reason, isRecoverable: false });
  }

  public static external(reason: string): FailureClassification {
    return new FailureClassification({ type: FailureType.External, reason, isRecoverable: false });
  }

  public static fatal(reason: string): FailureClassification {
    return new FailureClassification({ type: FailureType.Fatal, reason, isRecoverable: false });
  }
}
