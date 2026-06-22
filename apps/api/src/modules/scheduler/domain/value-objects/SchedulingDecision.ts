import { ValueObject } from '@rrss-auto/domain';
import { DispatchResult } from '../enums/DispatchResult';
import { DispatchPlan } from './DispatchPlan';

export interface SchedulingDecisionProps {
  result: DispatchResult;
  reason: string;
  plan?: DispatchPlan;
}

export class SchedulingDecision extends ValueObject<SchedulingDecisionProps> {
  private constructor(props: SchedulingDecisionProps) {
    super(props);
  }

  get result(): DispatchResult { return this.props.result; }
  get reason(): string { return this.props.reason; }
  get plan(): DispatchPlan | undefined { return this.props.plan; }

  public static dispatch(plan: DispatchPlan, reason: string = 'Capacity available'): SchedulingDecision {
    return new SchedulingDecision({ result: DispatchResult.Dispatched, reason, plan });
  }

  public static defer(reason: string): SchedulingDecision {
    return new SchedulingDecision({ result: DispatchResult.Deferred, reason });
  }

  public static cancel(reason: string): SchedulingDecision {
    return new SchedulingDecision({ result: DispatchResult.Cancelled, reason });
  }
}
