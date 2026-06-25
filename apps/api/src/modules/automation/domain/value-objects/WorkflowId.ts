import { ValueObject } from '@rrss-auto/domain';
interface WorkflowIdProps { value: string; }
export class WorkflowId extends ValueObject<WorkflowIdProps> {
  private constructor(props: WorkflowIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): WorkflowId {
    if (!value || value.trim().length === 0) throw new Error('WorkflowId cannot be empty');
    return new WorkflowId({ value });
  }
}
