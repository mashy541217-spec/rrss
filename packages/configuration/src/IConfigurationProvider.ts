import { Environment } from './Environment';

/**
 * Core contract for configuration providers in the RRSS AUTO platform.
 *
 * All modules MUST depend on this interface – never on a concrete
 * configuration implementation. Concrete adapters (DotEnv, AWS SSM,
 * Azure App Configuration, etc.) will implement this interface in
 * the infrastructure layer.
 */
export interface IConfigurationProvider {
  /**
   * Retrieve a string value by key.
   *
   * @param key - The configuration key.
   * @throws {ConfigurationException} If the key does not exist.
   */
  get(key: string): string;

  /**
   * Retrieve and parse a numeric value by key.
   *
   * @param key - The configuration key.
   * @throws {ConfigurationException} If the key does not exist or is not numeric.
   */
  getNumber(key: string): number;

  /**
   * Retrieve and parse a boolean value by key.
   *
   * Accepted truthy values: `"true"`, `"1"`, `"yes"`.
   *
   * @param key - The configuration key.
   * @throws {ConfigurationException} If the key does not exist.
   */
  getBoolean(key: string): boolean;

  /**
   * Check whether a configuration key exists.
   *
   * @param key - The configuration key.
   */
  has(key: string): boolean;

  /**
   * Retrieve the current runtime environment.
   */
  getEnvironment(): Environment;

  /**
   * Retrieve a string value by key, returning a default
   * if the key does not exist.
   *
   * @param key - The configuration key.
   * @param defaultValue - The fallback value.
   */
  getOrDefault(key: string, defaultValue: string): string;
}
