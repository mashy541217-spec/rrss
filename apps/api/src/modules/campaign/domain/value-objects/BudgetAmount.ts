import { ValueObject } from '@rrss-auto/domain';
import { Money } from './Money';
interface BudgetAmountProps { limit: Money; type: 'DAILY' | 'TOTAL'; }
export class BudgetAmount extends ValueObject<BudgetAmountProps> {
  private constructor(props: BudgetAmountProps) { super(props); }
  get limit(): Money { return this.props.limit; }
  get type(): 'DAILY' | 'TOTAL' { return this.props.type; }
  public static create(limit: Money, type: 'DAILY' | 'TOTAL'): BudgetAmount {
    return new BudgetAmount({ limit, type });
  }
}