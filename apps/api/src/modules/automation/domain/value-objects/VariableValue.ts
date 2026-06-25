import { ValueObject } from '@rrss-auto/domain';
interface VariableValueProps { value: any; type: string; }
export class VariableValue extends ValueObject<VariableValueProps> {
  private constructor(props: VariableValueProps) { super(props); }
  get value(): any { return this.props.value; }
  get type(): string { return this.props.type; }
  public static create(value: any, type: string): VariableValue {
    return new VariableValue({ value, type });
  }
}
