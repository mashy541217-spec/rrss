import { ValueObject } from '@rrss-auto/domain';
interface CurrencyProps { code: string; }
export class Currency extends ValueObject<CurrencyProps> {
  private constructor(props: CurrencyProps) { super(props); }
  get code(): string { return this.props.code; }
  public static create(code: string): Currency {
    if (!code || code.trim().length !== 3) throw new Error('Currency code must be 3 characters');
    return new Currency({ code: code.toUpperCase() });
  }
}