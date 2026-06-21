/**
 * Log severity levels ordered from lowest to highest priority.
 *
 * - `debug`  – Verbose diagnostic information for development.
 * - `info`   – General informational messages.
 * - `warn`   – Potential issues that deserve attention.
 * - `error`  – Errors that still allow the application to continue.
 * - `fatal`  – Critical failures that require immediate attention.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Ordered list of log levels from lowest to highest severity.
 * Useful for filtering and comparison.
 */
export const LOG_LEVELS: readonly LogLevel[] = [
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
] as const;
