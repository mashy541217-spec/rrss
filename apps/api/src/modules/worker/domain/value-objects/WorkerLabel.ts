import { ValueObject } from '@rrss-auto/domain';

interface WorkerLabelProps {
  key: string;
  value: string;
}

export class WorkerLabel extends ValueObject<WorkerLabelProps> {
  private constructor(props: WorkerLabelProps) {
    super(props);
  }

  get key(): string { return this.props.key; }
  get value(): string { return this.props.value; }

  public static create(key: string, value: string): WorkerLabel {
    if (!key || key.trim().length === 0) throw new Error('WorkerLabel key cannot be empty');
    return new WorkerLabel({ key, value });
  }
}
