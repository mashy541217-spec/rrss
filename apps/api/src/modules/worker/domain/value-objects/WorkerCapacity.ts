import { ValueObject } from '@rrss-auto/domain';

interface WorkerCapacityProps {
  maxConcurrentExecutions: number;
}

export class WorkerCapacity extends ValueObject<WorkerCapacityProps> {
  private constructor(props: WorkerCapacityProps) {
    super(props);
  }

  get maxConcurrentExecutions(): number { return this.props.maxConcurrentExecutions; }

  public static create(maxConcurrentExecutions: number): WorkerCapacity {
    if (maxConcurrentExecutions < 1) throw new Error('WorkerCapacity must be at least 1');
    return new WorkerCapacity({ maxConcurrentExecutions });
  }
}
