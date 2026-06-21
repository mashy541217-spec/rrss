import { ValueObject } from '@rrss-auto/domain';
import { ExecutionStatus } from '../enums/ExecutionStatus';

/**
 * TimelineEntry – immutable record of a single state transition event.
 * Embedded in ExecutionTimeline for audit trail.
 */
export interface TimelineEntryProps {
  status: ExecutionStatus;
  occurredAt: Date;
  message: string;
  actor?: string;
}

export class TimelineEntry extends ValueObject<TimelineEntryProps> {
  private constructor(props: TimelineEntryProps) { super(props); }

  get status(): ExecutionStatus { return this.props.status; }
  get occurredAt(): Date { return this.props.occurredAt; }
  get message(): string { return this.props.message; }
  get actor(): string | undefined { return this.props.actor; }

  public static create(props: TimelineEntryProps): TimelineEntry {
    if (!props.message || props.message.trim().length === 0) {
      throw new Error('TimelineEntry message cannot be empty');
    }
    return new TimelineEntry({ ...props, occurredAt: props.occurredAt ?? new Date() });
  }
}
