import { ValueObject } from '@rrss-auto/domain';
interface VariableNameProps { value: string; }
export class VariableName extends ValueObject<VariableNameProps> {
  private constructor(props: VariableNameProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): VariableName {
    if (!value || value.trim().length === 0) throw new Error('VariableName cannot be empty');
    return new VariableName({ value });
  }
}
