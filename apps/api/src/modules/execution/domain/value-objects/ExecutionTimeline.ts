import { ValueObject } from '@rrss-auto/domain';
import { TimelineEntry } from './TimelineEntry';
import { ExecutionStatus } from '../enums/ExecutionStatus';

/**
 * ExecutionTimeline – immutable, append-only ordered log of timeline entries.
 *
 * RFC-0001: "Each Execution must produce a timeline" answering who, what,
 * when, which worker, which resources, which steps, and what failed.
 */
export interface ExecutionTimelineProps {
  entries: ReadonlyArray<TimelineEntry>;
}

export class ExecutionTimeline extends ValueObject<ExecutionTimelineProps> {
  public static readonly EMPTY = new ExecutionTimeline({ entries: [] });

  private constructor(props: ExecutionTimelineProps) { super(props); }

  get entries(): ReadonlyArray<TimelineEntry> { return this.props.entries; }

  get length(): number { return this.props.entries.length; }

  public append(entry: TimelineEntry): ExecutionTimeline {
    return new ExecutionTimeline({ entries: [...this.props.entries, entry] });
  }

  public lastEntry(): TimelineEntry | undefined {
    return this.props.entries[this.props.entries.length - 1];
  }

  public entriesForStatus(status: ExecutionStatus): ReadonlyArray<TimelineEntry> {
    return this.props.entries.filter((e) => e.status === status);
  }

  public static create(entries: TimelineEntry[] = []): ExecutionTimeline {
    return new ExecutionTimeline({ entries });
  }
}
