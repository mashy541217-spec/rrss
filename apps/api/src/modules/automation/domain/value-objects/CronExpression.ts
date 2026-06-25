import { ValueObject } from '@rrss-auto/domain';
interface CronExpressionProps { value: string; }
export class CronExpression extends ValueObject<CronExpressionProps> {
  private constructor(props: CronExpressionProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): CronExpression {
    if (!value || value.trim().length === 0) throw new Error('CronExpression cannot be empty');
    return new CronExpression({ value });
  }
}
