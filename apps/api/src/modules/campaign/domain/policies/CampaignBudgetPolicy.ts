import { Budget } from '../entities/Budget';
import { Money } from '../value-objects/Money';

export class CampaignBudgetPolicy {
  public static isBudgetAvailable(budget: Budget): boolean {
    return budget.spent.amount < budget.amount.limit.amount;
  }

  public static willExceedBudget(budget: Budget, addition: Money): boolean {
    if (!budget.spent.currency.equals(addition.currency)) {
      throw new Error('Currency mismatch');
    }
    return (budget.spent.amount + addition.amount) > budget.amount.limit.amount;
  }
}