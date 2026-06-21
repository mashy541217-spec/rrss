import { ILogContext } from './ILogContext';

/**
 * Core logging contract for the RRSS AUTO platform.
 *
 * All modules MUST depend on this interface – never on
 * a concrete logger implementation. Concrete adapters
 * (Pino, Winston, CloudWatch, etc.) will implement this
 * interface in the infrastructure layer.
 */
export interface ILogger {
  /**
   * Log a debug-level message.
   * Use for verbose diagnostic information during development.
   */
  debug(message: string, context?: ILogContext): void;

  /**
   * Log an informational message.
   * Use for general operational information.
   */
  info(message: string, context?: ILogContext): void;

  /**
   * Log a warning message.
   * Use for potential issues that deserve attention.
   */
  warn(message: string, context?: ILogContext): void;

  /**
   * Log an error message with an optional Error object.
   * Use for errors that still allow the application to continue.
   */
  error(message: string, error?: Error, context?: ILogContext): void;

  /**
   * Log a fatal message with an optional Error object.
   * Use for critical failures that require immediate intervention.
   */
  fatal(message: string, error?: Error, context?: ILogContext): void;
}
