import { ValueObject } from '@rrss-auto/domain';
import { InvalidWorkspaceIdException } from '../exceptions/InvalidWorkspaceIdException';

export interface WorkspaceOwnerIdProps {
  value: string;
}

export class WorkspaceOwnerId extends ValueObject<WorkspaceOwnerIdProps> {
  private constructor(props: WorkspaceOwnerIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): WorkspaceOwnerId {
    if (!value || value.trim().length === 0) {
      throw new InvalidWorkspaceIdException('Workspace owner ID cannot be empty');
    }
    
    return new WorkspaceOwnerId({ value: value.trim() });
  }
}
