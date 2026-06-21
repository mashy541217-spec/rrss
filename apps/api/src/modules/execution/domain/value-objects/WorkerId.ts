import { ValueObject } from '@rrss-auto/domain';

export interface WorkerIdProps { value: string; }

export class WorkerId extends ValueObject<WorkerIdProps> {
  private constructor(props: WorkerIdProps) { super(props); }

  get value(): string { return this.props.value; }

  public static create(value: string): WorkerId {
    if (!value || value.trim().length === 0) {
      throw new Error('WorkerId cannot be empty');
    }
    return new WorkerId({ value: value.trim() });
  }
}
