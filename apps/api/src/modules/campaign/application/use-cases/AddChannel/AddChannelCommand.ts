import { ICommand } from '@rrss-auto/application';
import { ChannelType } from '../../../domain/enums/ChannelType';
export class AddChannelCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly platform: string,
    public readonly type: ChannelType,
    public readonly configuration: Record<string, unknown>
  ) {}
}