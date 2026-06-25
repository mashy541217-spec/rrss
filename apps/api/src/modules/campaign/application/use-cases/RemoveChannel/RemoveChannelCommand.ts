import { ICommand } from '@rrss-auto/application';
export class RemoveChannelCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly channelId: string
  ) {}
}