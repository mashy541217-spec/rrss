import { ILogger } from './ILogger';
import { ILogContext } from './ILogContext';

/**
 * No-operation logger that silently discards all log messages.
 *
 * Useful for:
 * - Unit tests where logging output is undesirable.
 * - Silent/headless mode in production.
 * - Default fallback when no logger has been configured.
 */
export class NullLogger implements ILogger {
  debug(_message: string, _context?: ILogContext): void {
    // intentionally empty
  }

  info(_message: string, _context?: ILogContext): void {
    // intentionally empty
  }

  warn(_message: string, _context?: ILogContext): void {
    // intentionally empty
  }

  error(_message: string, _error?: Error, _context?: ILogContext): void {
    // intentionally empty
  }

  fatal(_message: string, _error?: Error, _context?: ILogContext): void {
    // intentionally empty
  }
}
