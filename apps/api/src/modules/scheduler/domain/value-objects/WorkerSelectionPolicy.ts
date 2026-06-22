import { ValueObject } from '@rrss-auto/domain';
import { WorkerSelectionStrategy } from '../enums/WorkerSelectionStrategy';

export interface WorkerSelectionPolicyProps {
  strategy: WorkerSelectionStrategy;
  preferredWorkerIds: string[];
  requiredWorkerTags: string[];
}

export class WorkerSelectionPolicy extends ValueObject<WorkerSelectionPolicyProps> {
  private constructor(props: WorkerSelectionPolicyProps) {
    super(props);
  }

  get strategy(): WorkerSelectionStrategy { return this.props.strategy; }
  get preferredWorkerIds(): ReadonlyArray<string> { return this.props.preferredWorkerIds; }
  get requiredWorkerTags(): ReadonlyArray<string> { return this.props.requiredWorkerTags; }

  public static create(props: Partial<WorkerSelectionPolicyProps> & { strategy: WorkerSelectionStrategy }): WorkerSelectionPolicy {
    return new WorkerSelectionPolicy({
      strategy: props.strategy,
      preferredWorkerIds: props.preferredWorkerIds ?? [],
      requiredWorkerTags: props.requiredWorkerTags ?? [],
    });
  }
}
