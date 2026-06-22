import { Entity, ValueObject } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';
import { AssignmentStatus } from '../enums/AssignmentStatus';

export interface ExecutionAssignmentProps {
  executionId: string;
  slotId: number;
  status: AssignmentStatus;
  assignedAt: Date;
  completedAt: Date | null;
  errorReason: string | null;
}

export class ExecutionAssignment extends Entity<ExecutionAssignmentProps, ValueObject<any>> {
  private constructor(props: ExecutionAssignmentProps, id: ValueObject<any>) {
    super(props, id);
  }

  get executionId(): string { return this.props.executionId; }
  get slotId(): number { return this.props.slotId; }
  get status(): AssignmentStatus { return this.props.status; }
  get assignedAt(): Date { return this.props.assignedAt; }
  get completedAt(): Date | null { return this.props.completedAt; }
  get errorReason(): string | null { return this.props.errorReason; }

  public static create(executionId: string, slotId: number): ExecutionAssignment {
    return new ExecutionAssignment({
      executionId,
      slotId,
      status: AssignmentStatus.Assigned,
      assignedAt: new Date(),
      completedAt: null,
      errorReason: null
    }, { value: executionId } as any); // Using executionId as identity since it's unique per worker
  }

  public markProcessing(): void {
    if (this.props.status !== AssignmentStatus.Assigned) return;
    this.props.status = AssignmentStatus.Processing;
  }

  public markCompleted(): void {
    this.props.status = AssignmentStatus.Completed;
    this.props.completedAt = new Date();
  }

  public markFailed(reason: string): void {
    this.props.status = AssignmentStatus.Failed;
    this.props.completedAt = new Date();
    this.props.errorReason = reason;
  }
}
