import { ICommand } from '@rrss-auto/application';

export class ArchiveContentCommand implements ICommand {
  constructor(
    public readonly contentId: string,
    public readonly archivedBy: string,
  ) {}
}
