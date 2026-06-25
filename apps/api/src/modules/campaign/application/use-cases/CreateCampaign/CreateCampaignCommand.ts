import { ICommand } from '@rrss-auto/application';
export class CreateCampaignCommand implements ICommand {
  constructor(
    public readonly workspaceRef: string,
    public readonly name: string,
    public readonly priority: 'Low' | 'Medium' | 'High' | 'Critical',
    public readonly objective: 'Engagement' | 'Traffic' | 'Conversions' | 'BrandAwareness',
    public readonly strategy: 'Manual' | 'Scheduled' | 'Triggered',
    public readonly tags: string[],
    public readonly budgetLimit: number,
    public readonly budgetCurrency: string,
    public readonly budgetType: 'DAILY' | 'TOTAL',
    public readonly description?: string
  ) {}
}