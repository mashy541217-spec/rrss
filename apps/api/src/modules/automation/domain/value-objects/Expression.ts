import { ValueObject } from '@rrss-auto/domain';
interface ExpressionProps { value: string; }
export class Expression extends ValueObject<ExpressionProps> {
  private constructor(props: ExpressionProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): Expression {
    return new Expression({ value: value || '' });
  }
}
