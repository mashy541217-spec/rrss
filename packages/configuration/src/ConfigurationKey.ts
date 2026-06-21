import { ConfigurationException } from './ConfigurationException';

/**
 * Value object that wraps and validates a configuration key string.
 *
 * Enforces that keys are non-empty strings composed of
 * alphanumeric characters, underscores, dots, and hyphens.
 */
export class ConfigurationKey {
  private static readonly VALID_KEY_PATTERN = /^[a-zA-Z0-9._-]+$/;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Create a new ConfigurationKey from a raw string.
   *
   * @param key - The configuration key string to validate.
   * @throws {ConfigurationException} If the key is empty or contains invalid characters.
   */
  static create(key: string): ConfigurationKey {
    if (!key || key.trim().length === 0) {
      throw new ConfigurationException('Configuration key cannot be empty.');
    }

    if (!ConfigurationKey.VALID_KEY_PATTERN.test(key)) {
      throw new ConfigurationException(
        `Configuration key "${key}" contains invalid characters. ` +
          'Only alphanumeric characters, underscores, dots, and hyphens are allowed.',
      );
    }

    return new ConfigurationKey(key);
  }

  /** Returns the raw string value of this key. */
  toString(): string {
    return this.value;
  }

  /** Equality check by value. */
  equals(other: ConfigurationKey): boolean {
    return this.value === other.value;
  }
}
