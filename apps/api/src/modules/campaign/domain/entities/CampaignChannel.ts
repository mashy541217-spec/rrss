import { Entity } from '@rrss-auto/domain';
import { ChannelId } from '../value-objects/ChannelId';
import { TargetPlatform } from '../value-objects/TargetPlatform';
import { ChannelType } from '../enums/ChannelType';

export interface CampaignChannelProps {
  campaignId: string;
  platform: TargetPlatform;
  type: ChannelType;
  configuration: Record<string, unknown>;
  createdAt?: Date;
}

export class CampaignChannel extends Entity<CampaignChannelProps, ChannelId> {
  private constructor(props: CampaignChannelProps, id: ChannelId) { super(props, id); }
  get campaignId(): string { return this.props.campaignId; }
  get platform(): TargetPlatform { return this.props.platform; }
  get type(): ChannelType { return this.props.type; }
  get configuration(): Record<string, unknown> { return this.props.configuration; }
  get createdAt(): Date { return this.props.createdAt || new Date(); }

  public static create(props: CampaignChannelProps, id: ChannelId): CampaignChannel {
    return new CampaignChannel(props, id);
  }
}