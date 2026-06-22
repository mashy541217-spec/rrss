import { ValueObject } from '@rrss-auto/domain';

interface AllocationPriorityProps {
  level: number;
}

export class AllocationPriority extends ValueObject<AllocationPriorityProps> {
  public static readonly LOW = new AllocationPriority({ level: 10 });
  public static readonly NORMAL = new AllocationPriority({ level: 50 });
  public static readonly HIGH = new AllocationPriority({ level: 90 });
  public static readonly CRITICAL = new AllocationPriority({ level: 100 });

  private constructor(props: AllocationPriorityProps) {
    super(props);
  }

  get level(): number {
    return this.props.level;
  }

  public static create(level: number): AllocationPriority {
    if (level < 0 || level > 100) throw new Error('AllocationPriority must be between 0 and 100');
    return new AllocationPriority({ level });
  }
}
