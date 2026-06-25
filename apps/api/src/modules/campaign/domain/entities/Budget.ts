import { Entity } from '@rrss-auto/domain';
import { BudgetAmount } from '../value-objects/BudgetAmount';
import { Money } from '../value-objects/Money';

export interface BudgetProps {
  amount: BudgetAmount;
  spent: Money;
}

export class Budget extends Entity<BudgetProps, any> {
  private constructor(props: BudgetProps, id: string) { super(props, id); }
  get amount(): BudgetAmount { return this.props.amount; }
  get spent(): Money { return this.props.spent; }

  public static create(props: BudgetProps, id: string): Budget {
    return new Budget(props, id);
  }

  public incrementSpent(amount: Money): void {
    if (!amount.currency.equals(this.props.spent.currency)) {
      throw new Error('Currency mismatch when updating budget');
    }
    const newSpentAmount = this.props.spent.amount + amount.amount;
    this.props.spent = Money.create(newSpentAmount, this.props.spent.currency);
  }
}