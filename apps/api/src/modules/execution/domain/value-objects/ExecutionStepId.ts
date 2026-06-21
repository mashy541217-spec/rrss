import { ValueObject } from '@rrss-auto/domain';

export interface ExecutionStepIdProps { value: string; }

export class ExecutionStepId extends ValueObject<ExecutionStepIdProps> {
  private constructor(props: ExecutionStepIdProps) { super(props); }

  get value(): string { return this.props.value; }

  public static create(value: string): ExecutionStepId {
    if (!value || value.trim().length === 0) {
      throw new Error('ExecutionStepId cannot be empty');
    }
    return new ExecutionStepId({ value: value.trim() });
  }
}
