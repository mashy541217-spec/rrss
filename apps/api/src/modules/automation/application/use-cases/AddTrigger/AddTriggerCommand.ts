import { ICommand } from '@rrss-auto/application';
import { TriggerType } from '../../../domain/enums/TriggerType';

export class AddTriggerCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly type: TriggerType,
    public readonly configuration: any
  ) {}
}
