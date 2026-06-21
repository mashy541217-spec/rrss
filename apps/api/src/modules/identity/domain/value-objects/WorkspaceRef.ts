import { ValueObject } from '@rrss-auto/domain';

export interface WorkspaceRefProps {
  value: string;
}

/**
 * Cross-context reference to a Workspace identity.
 *
 * The Identity bounded context does not own Workspace.
 * This Value Object holds an opaque Workspace ID string for
 * cross-aggregate referencing without creating coupling to the
 * Workspace module.
 *
 * Per DDD: aggregates in different bounded contexts reference each other by ID only.
 */
export class WorkspaceRef extends ValueObject<WorkspaceRefProps> {
  private constructor(props: WorkspaceRefProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(workspaceId: string): WorkspaceRef {
    if (!workspaceId || workspaceId.trim().length === 0) {
      throw new Error('WorkspaceRef: workspace ID cannot be empty');
    }
    return new WorkspaceRef({ value: workspaceId.trim() });
  }
}
