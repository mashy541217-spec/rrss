import { ValueObject } from '@rrss-auto/domain';
import { Currency } from './Currency';
interface MoneyProps { amount: number; currency: Currency; }
export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) { super(props); }
  get amount(): number { return this.props.amount; }
  get currency(): Currency { return this.props.currency; }
  public static create(amount: number, currency: Currency): Money {
    if (amount < 0) throw new Error('Money amount cannot be negative');
    return new Money({ amount, currency });
  }
}