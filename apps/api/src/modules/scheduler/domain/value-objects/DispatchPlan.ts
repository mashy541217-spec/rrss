import { ValueObject } from '@rrss-auto/domain';
import { DispatchPriority } from './DispatchPriority';

export interface DispatchPlanProps {
  executionId: string;
  workerId?: string; // Optional if targeting a queue instead of specific worker
  priority: DispatchPriority;
  scheduledAt: Date;
}

export class DispatchPlan extends ValueObject<DispatchPlanProps> {
  private constructor(props: DispatchPlanProps) {
    super(props);
  }

  get executionId(): string { return this.props.executionId; }
  get workerId(): string | undefined { return this.props.workerId; }
  get priority(): DispatchPriority { return this.props.priority; }
  get scheduledAt(): Date { return this.props.scheduledAt; }

  public static create(props: DispatchPlanProps): DispatchPlan {
    if (!props.executionId) throw new Error('ExecutionId is required in DispatchPlan');
    return new DispatchPlan(props);
  }
}
