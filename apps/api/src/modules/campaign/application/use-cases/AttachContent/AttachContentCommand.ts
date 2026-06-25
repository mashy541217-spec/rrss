import { ICommand } from '@rrss-auto/application';
export class AttachContentCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly contentId: string,
    public readonly attachedBy: string
  ) {}
}