import { ValueObject } from '@rrss-auto/domain';

interface AssignmentPolicyProps {
  maxExecutionTimeSeconds: number;
  allowParallelProcessing: boolean;
}

export class AssignmentPolicy extends ValueObject<AssignmentPolicyProps> {
  private constructor(props: AssignmentPolicyProps) {
    super(props);
  }

  get maxExecutionTimeSeconds(): number { return this.props.maxExecutionTimeSeconds; }
  get allowParallelProcessing(): boolean { return this.props.allowParallelProcessing; }

  public static create(maxExecutionTimeSeconds: number, allowParallelProcessing: boolean): AssignmentPolicy {
    return new AssignmentPolicy({ maxExecutionTimeSeconds, allowParallelProcessing });
  }
}
