import { ValueObject } from '@rrss-auto/domain';
interface ExecutionPlanIdProps { value: string; }
export class ExecutionPlanId extends ValueObject<ExecutionPlanIdProps> {
  private constructor(props: ExecutionPlanIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): ExecutionPlanId {
    if (!value || value.trim().length === 0) throw new Error('ExecutionPlanId cannot be empty');
    return new ExecutionPlanId({ value });
  }
}
