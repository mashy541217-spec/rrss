import { Entity } from '@rrss-auto/domain';
import { CampaignObjective } from '../value-objects/CampaignObjective';

export interface GoalProps {
  objective: CampaignObjective;
  metric: string;
  targetValue: number;
  currentValue: number;
}

export class Goal extends Entity<GoalProps, any> {
  private constructor(props: GoalProps, id: string) { super(props, id); }
  get objective(): CampaignObjective { return this.props.objective; }
  get metric(): string { return this.props.metric; }
  get targetValue(): number { return this.props.targetValue; }
  get currentValue(): number { return this.props.currentValue; }

  public static create(props: GoalProps, id: string): Goal {
    return new Goal(props, id);
  }
}