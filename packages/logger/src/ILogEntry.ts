import { LogLevel } from './LogLevel';
import { ILogContext } from './ILogContext';

/**
 * Represents a single immutable log record.
 *
 * Used by advanced loggers and transports that need
 * to serialize or forward structured log data.
 */
export interface ILogEntry {
  /** Severity level of this log entry. */
  readonly level: LogLevel;

  /** Human-readable log message. */
  readonly message: string;

  /** ISO-8601 timestamp of when the entry was created. */
  readonly timestamp: string;

  /** Optional structured context metadata. */
  readonly context?: ILogContext;

  /** Optional error attached to this entry. */
  readonly error?: Error;
}
