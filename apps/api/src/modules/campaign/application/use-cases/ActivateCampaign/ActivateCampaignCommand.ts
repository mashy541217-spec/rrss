import { ICommand } from '@rrss-auto/application';
export class ActivateCampaignCommand implements ICommand {
  constructor(public readonly campaignId: string) {}
}