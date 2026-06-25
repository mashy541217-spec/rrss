import { ICommand } from '@rrss-auto/application';
import { ExecutionStrategy } from '../../../domain/enums/ExecutionStrategy';

export class GenerateExecutionPlanCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly strategy?: ExecutionStrategy
  ) {}
}
