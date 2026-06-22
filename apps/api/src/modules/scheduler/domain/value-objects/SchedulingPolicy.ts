import { ValueObject } from '@rrss-auto/domain';
import { SchedulingStrategy } from '../enums/SchedulingStrategy';
import { SchedulingWindow } from './SchedulingWindow';
import { SchedulingConstraints } from './SchedulingConstraints';

export interface SchedulingPolicyProps {
  strategy: SchedulingStrategy;
  expression?: string; // e.g. cron expression
  window?: SchedulingWindow;
  constraints: SchedulingConstraints;
}

export class SchedulingPolicy extends ValueObject<SchedulingPolicyProps> {
  private constructor(props: SchedulingPolicyProps) {
    super(props);
  }

  get strategy(): SchedulingStrategy { return this.props.strategy; }
  get expression(): string | undefined { return this.props.expression; }
  get window(): SchedulingWindow | undefined { return this.props.window; }
  get constraints(): SchedulingConstraints { return this.props.constraints; }

  public static createImmediate(): SchedulingPolicy {
    return new SchedulingPolicy({
      strategy: SchedulingStrategy.Immediate,
      constraints: SchedulingConstraints.create({}),
    });
  }

  public static createCron(expression: string, window?: SchedulingWindow, constraints?: SchedulingConstraints): SchedulingPolicy {
    if (!expression || expression.trim().length === 0) throw new Error('Cron expression required');
    return new SchedulingPolicy({
      strategy: SchedulingStrategy.Cron,
      expression,
      window,
      constraints: constraints ?? SchedulingConstraints.create({}),
    });
  }
}
