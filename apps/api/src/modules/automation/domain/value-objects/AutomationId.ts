import { ValueObject } from '@rrss-auto/domain';
interface AutomationIdProps { value: string; }
export class AutomationId extends ValueObject<AutomationIdProps> {
  private constructor(props: AutomationIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): AutomationId {
    if (!value || value.trim().length === 0) throw new Error('AutomationId cannot be empty');
    return new AutomationId({ value });
  }
}
