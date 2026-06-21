import { ValueObject } from '@rrss-auto/domain';
import { InvalidWorkspaceNameException } from '../exceptions/InvalidWorkspaceNameException';

export interface WorkspaceNameProps {
  value: string;
}

export class WorkspaceName extends ValueObject<WorkspaceNameProps> {
  private constructor(props: WorkspaceNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): WorkspaceName {
    if (!value) {
      throw new InvalidWorkspaceNameException('Workspace name cannot be null or undefined');
    }
    
    const trimmedValue = value.trim();
    
    if (trimmedValue.length < 3 || trimmedValue.length > 100) {
      throw new InvalidWorkspaceNameException('Workspace name must be between 3 and 100 characters');
    }
    
    return new WorkspaceName({ value: trimmedValue });
  }
}
