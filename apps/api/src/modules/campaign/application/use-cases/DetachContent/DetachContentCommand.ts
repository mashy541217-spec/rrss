import { ICommand } from '@rrss-auto/application';
export class DetachContentCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly contentId: string
  ) {}
}