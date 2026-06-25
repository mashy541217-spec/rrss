import { ICommand } from '@rrss-auto/application';
export class PauseCampaignCommand implements ICommand {
  constructor(public readonly campaignId: string) {}
}