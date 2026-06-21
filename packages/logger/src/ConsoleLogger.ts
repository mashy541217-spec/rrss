import { ILogger } from './ILogger';
import { ILogContext } from './ILogContext';
import { LogLevel, LOG_LEVELS } from './LogLevel';
import { ILogEntry } from './ILogEntry';

/**
 * Structured console logger for development and debugging environments.
 *
 * Outputs JSON-formatted log entries to the standard console.
 * Supports minimum-level filtering via the constructor.
 *
 * **Not intended for production use.** Production loggers
 * should be provided by concrete infrastructure adapters.
 */
export class ConsoleLogger implements ILogger {
  private readonly minLevelIndex: number;

  constructor(minLevel: LogLevel = 'debug') {
    this.minLevelIndex = LOG_LEVELS.indexOf(minLevel);
  }

  debug(message: string, context?: ILogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: ILogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: ILogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: ILogContext): void {
    this.log('error', message, context, error);
  }

  fatal(message: string, error?: Error, context?: ILogContext): void {
    this.log('fatal', message, context, error);
  }

  private log(
    level: LogLevel,
    message: string,
    context?: ILogContext,
    error?: Error,
  ): void {
    if (LOG_LEVELS.indexOf(level) < this.minLevelIndex) {
      return;
    }

    const entry: ILogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context ? { context } : {}),
      ...(error ? { error } : {}),
    };

    switch (level) {
      case 'debug':
        console.debug(JSON.stringify(entry));
        break;
      case 'info':
        console.info(JSON.stringify(entry));
        break;
      case 'warn':
        console.warn(JSON.stringify(entry));
        break;
      case 'error':
        console.error(JSON.stringify(entry));
        break;
      case 'fatal':
        console.error(JSON.stringify(entry));
        break;
    }
  }
}
