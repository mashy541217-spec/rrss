import { Entity } from '@rrss-auto/domain';

export interface CampaignExecutionProps {
  campaignId: string;
  executionId: string;
  publicationId?: string;
  status: string;
  triggeredAt: Date;
}

export class CampaignExecution extends Entity<CampaignExecutionProps, any> {
  private constructor(props: CampaignExecutionProps, id: string) { super(props, id); }
  get campaignId(): string { return this.props.campaignId; }
  get executionId(): string { return this.props.executionId; }
  get publicationId(): string | undefined { return this.props.publicationId; }
  get status(): string { return this.props.status; }
  get triggeredAt(): Date { return this.props.triggeredAt; }

  public static create(props: CampaignExecutionProps, id: string): CampaignExecution {
    return new CampaignExecution(props, id);
  }
}