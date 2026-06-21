import { ILogger } from './ILogger';
import { NullLogger } from './NullLogger';

/**
 * Global registry for the active {@link ILogger} instance.
 *
 * Provides a centralized way to register and retrieve the
 * platform-wide logger without coupling consumers to a
 * specific implementation.
 *
 * Defaults to {@link NullLogger} when no logger has been set.
 */
export class LoggerFactory {
  private static instance: ILogger = new NullLogger();

  /**
   * Register the logger implementation to be used platform-wide.
   *
   * @param logger - The logger implementation to use.
   */
  static setLogger(logger: ILogger): void {
    LoggerFactory.instance = logger;
  }

  /**
   * Retrieve the currently registered logger.
   * Returns a {@link NullLogger} if no logger has been registered.
   */
  static getLogger(): ILogger {
    return LoggerFactory.instance;
  }

  /**
   * Reset the factory to its default state (NullLogger).
   * Primarily useful in test teardown.
   */
  static reset(): void {
    LoggerFactory.instance = new NullLogger();
  }
}
