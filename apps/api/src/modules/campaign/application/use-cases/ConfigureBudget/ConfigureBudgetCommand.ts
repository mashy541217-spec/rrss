import { ICommand } from '@rrss-auto/application';
export class ConfigureBudgetCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly limitAmount: number,
    public readonly currency: string,
    public readonly budgetType: 'DAILY' | 'TOTAL'
  ) {}
}