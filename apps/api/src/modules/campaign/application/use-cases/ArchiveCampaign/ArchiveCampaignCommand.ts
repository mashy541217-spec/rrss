import { ICommand } from '@rrss-auto/application';
export class ArchiveCampaignCommand implements ICommand {
  constructor(public readonly campaignId: string) {}
}