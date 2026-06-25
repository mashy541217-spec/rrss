import { ICommand } from '@rrss-auto/application';
export class GeneratePublicationCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly contentId: string,
    public readonly format: string,
    public readonly publishAt?: Date
  ) {}
}