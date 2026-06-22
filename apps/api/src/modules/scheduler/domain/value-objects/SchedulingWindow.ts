import { ValueObject } from '@rrss-auto/domain';

export interface SchedulingWindowProps {
  startHour: number;
  endHour: number;
  allowedDaysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
  timezone: string;
}

export class SchedulingWindow extends ValueObject<SchedulingWindowProps> {
  private constructor(props: SchedulingWindowProps) {
    super(props);
  }

  get startHour(): number { return this.props.startHour; }
  get endHour(): number { return this.props.endHour; }
  get allowedDaysOfWeek(): ReadonlyArray<number> { return this.props.allowedDaysOfWeek; }
  get timezone(): string { return this.props.timezone; }

  public static create(props: SchedulingWindowProps): SchedulingWindow {
    if (props.startHour < 0 || props.startHour > 23) throw new Error('Invalid start hour');
    if (props.endHour < 0 || props.endHour > 23) throw new Error('Invalid end hour');
    if (props.startHour >= props.endHour) throw new Error('Start hour must be before end hour');
    if (props.allowedDaysOfWeek.some(d => d < 0 || d > 6)) throw new Error('Invalid day of week');

    return new SchedulingWindow({
      ...props,
      allowedDaysOfWeek: [...new Set(props.allowedDaysOfWeek)].sort()
    });
  }

  public isWithinWindow(date: Date): boolean {
    const day = date.getUTCDay(); // Should ideally use timezone
    const hour = date.getUTCHours();
    if (!this.allowedDaysOfWeek.includes(day)) return false;
    return hour >= this.startHour && hour < this.endHour;
  }
}
