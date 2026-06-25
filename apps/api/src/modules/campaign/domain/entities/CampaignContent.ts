import { Entity } from '@rrss-auto/domain';

export interface CampaignContentProps {
  campaignId: string;
  contentId: string;
  attachedAt: Date;
  attachedBy: string;
}

export class CampaignContent extends Entity<CampaignContentProps, any> {
  private constructor(props: CampaignContentProps, id: string) { super(props, id); }
  get campaignId(): string { return this.props.campaignId; }
  get contentId(): string { return this.props.contentId; }
  get attachedAt(): Date { return this.props.attachedAt; }
  get attachedBy(): string { return this.props.attachedBy; }

  public static create(props: CampaignContentProps, id: string): CampaignContent {
    return new CampaignContent(props, id);
  }
}