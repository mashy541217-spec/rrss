import { ICommand } from '@rrss-auto/application';
export class UpdateAudienceCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly name: string,
    public readonly segments: string[],
    public readonly rules: Record<string, unknown>
  ) {}
}