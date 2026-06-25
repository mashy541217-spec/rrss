import { ICommand } from '@rrss-auto/application';
export class CompleteCampaignCommand implements ICommand {
  constructor(public readonly campaignId: string) {}
}