import { ValueObject } from '@rrss-auto/domain';

export interface DispatchPriorityProps {
  level: number;
}

export class DispatchPriority extends ValueObject<DispatchPriorityProps> {
  public static readonly LOW = new DispatchPriority({ level: 10 });
  public static readonly NORMAL = new DispatchPriority({ level: 50 });
  public static readonly HIGH = new DispatchPriority({ level: 100 });
  public static readonly CRITICAL = new DispatchPriority({ level: 255 });

  private constructor(props: DispatchPriorityProps) {
    super(props);
  }

  get level(): number {
    return this.props.level;
  }

  public static create(level: number): DispatchPriority {
    if (level < 0 || level > 255) {
      throw new Error('Priority level must be between 0 and 255');
    }
    return new DispatchPriority({ level });
  }
}
