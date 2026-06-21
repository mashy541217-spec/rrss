import { ValueObject } from '@rrss-auto/domain';

/**
 * WorkspaceRef – execution-scoped cross-context reference (ID only).
 * Keeps the Execution bounded context decoupled from the Workspace aggregate.
 */
export interface WorkspaceRefProps { value: string; }

export class WorkspaceRef extends ValueObject<WorkspaceRefProps> {
  private constructor(props: WorkspaceRefProps) { super(props); }

  get value(): string { return this.props.value; }

  public static create(value: string): WorkspaceRef {
    if (!value || value.trim().length === 0) {
      throw new Error('WorkspaceRef cannot be empty');
    }
    return new WorkspaceRef({ value: value.trim() });
  }
}
