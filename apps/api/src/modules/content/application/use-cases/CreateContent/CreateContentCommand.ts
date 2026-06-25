import { ICommand } from '@rrss-auto/application';

export class CreateContentCommand implements ICommand {
  constructor(
    public readonly workspaceRef: string,
    public readonly createdBy: string,
    public readonly title?: string,
    public readonly body?: string,
    public readonly templateId?: string,
  ) {}
}
