import { ValueObject } from '@rrss-auto/domain';
import { ExecutionPriority } from '../enums/ExecutionPriority';

/**
 * ExecutionContext – immutable contextual information supplied at request time.
 * Groups workspace, actor, priority, policy reference, and optional schedule.
 */
export interface ExecutionContextProps {
  workspaceRef: string;
  actor: string;
  priority: ExecutionPriority;
  policyRef?: string;
  scheduledFor?: Date;
  intent: string;
}

export class ExecutionContext extends ValueObject<ExecutionContextProps> {
  private constructor(props: ExecutionContextProps) { super(props); }

  get workspaceRef(): string { return this.props.workspaceRef; }
  get actor(): string { return this.props.actor; }
  get priority(): ExecutionPriority { return this.props.priority; }
  get policyRef(): string | undefined { return this.props.policyRef; }
  get scheduledFor(): Date | undefined { return this.props.scheduledFor; }
  get intent(): string { return this.props.intent; }

  public static create(props: ExecutionContextProps): ExecutionContext {
    if (!props.workspaceRef?.trim()) throw new Error('ExecutionContext workspaceRef cannot be empty');
    if (!props.actor?.trim()) throw new Error('ExecutionContext actor cannot be empty');
    if (!props.intent?.trim()) throw new Error('ExecutionContext intent cannot be empty');
    return new ExecutionContext(props);
  }
}
