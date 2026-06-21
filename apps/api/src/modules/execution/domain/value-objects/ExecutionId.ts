import { ValueObject } from '@rrss-auto/domain';

export interface ExecutionIdProps { value: string; }

export class ExecutionId extends ValueObject<ExecutionIdProps> {
  private constructor(props: ExecutionIdProps) { super(props); }

  get value(): string { return this.props.value; }

  public static create(value: string): ExecutionId {
    if (!value || value.trim().length === 0) {
      throw new Error('ExecutionId cannot be empty');
    }
    return new ExecutionId({ value: value.trim() });
  }
}
