import { ValueObject } from '@rrss-auto/domain';
import { InvalidWorkspaceSlugException } from '../exceptions/InvalidWorkspaceSlugException';

export interface WorkspaceSlugProps {
  value: string;
}

export class WorkspaceSlug extends ValueObject<WorkspaceSlugProps> {
  private constructor(props: WorkspaceSlugProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): WorkspaceSlug {
    if (!value) {
      throw new InvalidWorkspaceSlugException('Workspace slug cannot be empty');
    }
    
    const trimmedValue = value.trim();
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    
    if (!slugRegex.test(trimmedValue)) {
      throw new InvalidWorkspaceSlugException(`Slug '${trimmedValue}' is invalid. It must be lowercase, alphanumeric, and may contain hyphens.`);
    }

    return new WorkspaceSlug({ value: trimmedValue });
  }
}
