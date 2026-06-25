import { ICommand } from '@rrss-auto/application';

export class AddLocalizationCommand implements ICommand {
  constructor(
    public readonly contentId: string,
    public readonly languageCode: string,
    public readonly caption: string,
    public readonly addedBy: string,
    public readonly title?: string,
    public readonly body?: string,
  ) {}
}
