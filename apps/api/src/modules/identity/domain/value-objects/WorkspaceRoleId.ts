import { ValueObject } from '@rrss-auto/domain';
import { InvalidWorkspaceRoleIdException } from '../exceptions/InvalidWorkspaceRoleIdException';

export interface WorkspaceRoleIdProps {
  value: string;
}

export class WorkspaceRoleId extends ValueObject<WorkspaceRoleIdProps> {
  private constructor(props: WorkspaceRoleIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): WorkspaceRoleId {
    if (!value || value.trim().length === 0) {
      throw new InvalidWorkspaceRoleIdException('WorkspaceRole ID cannot be empty');
    }
    return new WorkspaceRoleId({ value: value.trim() });
  }
}
