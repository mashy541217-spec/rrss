import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { CreateCampaignCommand } from './CreateCampaignCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { Campaign } from '../../../domain/aggregate/Campaign';
import { CampaignId } from '../../../domain/value-objects/CampaignId';
import { CampaignName } from '../../../domain/value-objects/CampaignName';
import { CampaignDescription } from '../../../domain/value-objects/CampaignDescription';
import { CampaignPriority } from '../../../domain/value-objects/CampaignPriority';
import { CampaignObjective } from '../../../domain/value-objects/CampaignObjective';
import { CampaignStrategy } from '../../../domain/value-objects/CampaignStrategy';
import { CampaignTag } from '../../../domain/value-objects/CampaignTag';
import { Currency } from '../../../domain/value-objects/Currency';
import { Money } from '../../../domain/value-objects/Money';
import { BudgetAmount } from '../../../domain/value-objects/BudgetAmount';
import { Budget } from '../../../domain/entities/Budget';
import { CampaignPriority as CampaignPriorityEnum } from '../../../domain/enums/CampaignPriority';
import { CampaignObjective as CampaignObjectiveEnum } from '../../../domain/enums/CampaignObjective';
import { PublicationStrategy } from '../../../domain/enums/PublicationStrategy';

@Injectable()
@CommandHandler(CreateCampaignCommand)
export class CreateCampaignUseCase implements IUseCase<CreateCampaignCommand, string>, ICommandHandler<CreateCampaignCommand, string> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: CreateCampaignCommand): Promise<string> {
    const id = CampaignId.create(this.idProvider.nextId());
    const budgetCurrency = Currency.create(command.budgetCurrency);
    const limitMoney = Money.create(command.budgetLimit, budgetCurrency);
    const budgetAmount = BudgetAmount.create(limitMoney, command.budgetType);
    const spentMoney = Money.create(0, budgetCurrency);

    const budget = Budget.create({
      amount: budgetAmount,
      spent: spentMoney
    }, id.value);

    const campaign = Campaign.create({
      id,
      workspaceRef: command.workspaceRef,
      name: CampaignName.create(command.name),
      description: CampaignDescription.create(command.description),
      priority: CampaignPriority.create(command.priority as CampaignPriorityEnum),
      objective: CampaignObjective.create(command.objective as CampaignObjectiveEnum),
      strategy: CampaignStrategy.create(command.strategy as PublicationStrategy),
      tags: command.tags.map(t => CampaignTag.create(t)),
      budget
    });

    await this.repository.save(campaign);
    await this.eventBus.publishAll(campaign.domainEvents);
    campaign.clearDomainEvents();

    return id.value;
  }
}