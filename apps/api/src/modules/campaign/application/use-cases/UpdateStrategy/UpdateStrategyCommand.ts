import { ICommand } from '@rrss-auto/application';
import { PublicationStrategy } from '../../../domain/enums/PublicationStrategy';
export class UpdateStrategyCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly strategy: PublicationStrategy
  ) {}
}