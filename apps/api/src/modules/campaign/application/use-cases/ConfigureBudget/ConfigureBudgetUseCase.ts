import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase } from '@rrss-auto/application';
import { ConfigureBudgetCommand } from './ConfigureBudgetCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';
import { Budget } from '../../../domain/entities/Budget';
import { Currency } from '../../../domain/value-objects/Currency';
import { Money } from '../../../domain/value-objects/Money';
import { BudgetAmount } from '../../../domain/value-objects/BudgetAmount';

@Injectable()
@CommandHandler(ConfigureBudgetCommand)
export class ConfigureBudgetUseCase implements IUseCase<ConfigureBudgetCommand, void>, ICommandHandler<ConfigureBudgetCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository
  ) {}

  public async execute(command: ConfigureBudgetCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    const currency = Currency.create(command.currency);
    const budget = Budget.create({
      amount: BudgetAmount.create(Money.create(command.limitAmount, currency), command.budgetType),
      spent: Money.create(0, currency)
    }, campaign.id.value);

    campaign.updateBudget(budget);

    await this.repository.save(campaign);
  }
}