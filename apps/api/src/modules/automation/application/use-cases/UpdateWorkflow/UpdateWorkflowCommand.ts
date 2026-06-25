import { ICommand } from '@rrss-auto/application';

export interface WorkflowNodeDto {
  id: string;
  name: string;
  type: 'Trigger' | 'Condition' | 'Action';
  config: any;
  positionX?: number;
  positionY?: number;
}

export interface WorkflowConnectionDto {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
  targetHandle?: string;
  condition?: string;
}

export class UpdateWorkflowCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly nodes: WorkflowNodeDto[],
    public readonly connections: WorkflowConnectionDto[]
  ) {}
}
