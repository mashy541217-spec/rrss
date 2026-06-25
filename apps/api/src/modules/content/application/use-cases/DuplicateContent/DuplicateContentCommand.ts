import { ICommand } from '@rrss-auto/application';

export class DuplicateContentCommand implements ICommand {
  constructor(
    public readonly sourceContentId: string,
    public readonly workspaceRef: string,
    public readonly duplicatedBy: string,
    public readonly newTitle?: string,
  ) {}
}
