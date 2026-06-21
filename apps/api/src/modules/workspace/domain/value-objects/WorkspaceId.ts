import { ValueObject } from '@rrss-auto/domain';
import { InvalidWorkspaceIdException } from '../exceptions/InvalidWorkspaceIdException';

export interface WorkspaceIdProps {
  value: string;
}

export class WorkspaceId extends ValueObject<WorkspaceIdProps> {
  private constructor(props: WorkspaceIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): WorkspaceId {
    if (!value || value.trim().length === 0) {
      throw new InvalidWorkspaceIdException('Workspace ID cannot be empty');
    }
    
    return new WorkspaceId({ value: value.trim() });
  }
}
