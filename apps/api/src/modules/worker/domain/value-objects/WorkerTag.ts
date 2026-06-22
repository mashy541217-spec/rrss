import { ValueObject } from '@rrss-auto/domain';

interface WorkerTagProps {
  name: string;
}

export class WorkerTag extends ValueObject<WorkerTagProps> {
  private constructor(props: WorkerTagProps) {
    super(props);
  }

  get name(): string { return this.props.name; }

  public static create(name: string): WorkerTag {
    if (!name || name.trim().length === 0) throw new Error('WorkerTag name cannot be empty');
    return new WorkerTag({ name });
  }
}
