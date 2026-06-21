/**
 * Domain-specific exception for configuration errors.
 *
 * Thrown when a configuration key is missing, invalid,
 * or cannot be parsed to the expected type.
 */
export class ConfigurationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationException';
    Object.setPrototypeOf(this, ConfigurationException.prototype);
  }
}
