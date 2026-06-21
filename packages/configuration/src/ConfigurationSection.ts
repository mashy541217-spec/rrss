import { IConfigurationProvider } from './IConfigurationProvider';
import { ConfigurationException } from './ConfigurationException';

/**
 * Represents a namespace-scoped view of configuration values.
 *
 * Wraps an {@link IConfigurationProvider} and automatically
 * prefixes all key lookups with the configured namespace,
 * enabling modular configuration organization.
 *
 * @example
 * ```typescript
 * const dbSection = new ConfigurationSection(provider, 'database');
 * dbSection.get('host');     // resolves "database.host"
 * dbSection.getNumber('port'); // resolves "database.port"
 * ```
 */
export class ConfigurationSection {
  private readonly prefix: string;
  private readonly provider: IConfigurationProvider;

  constructor(provider: IConfigurationProvider, namespace: string) {
    if (!namespace || namespace.trim().length === 0) {
      throw new ConfigurationException(
        'ConfigurationSection namespace cannot be empty.',
      );
    }
    this.provider = provider;
    this.prefix = namespace.endsWith('.') ? namespace : `${namespace}.`;
  }

  /** Resolve the full key by prepending the namespace prefix. */
  private resolveKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /** Get a string value under this namespace. */
  get(key: string): string {
    return this.provider.get(this.resolveKey(key));
  }

  /** Get a numeric value under this namespace. */
  getNumber(key: string): number {
    return this.provider.getNumber(this.resolveKey(key));
  }

  /** Get a boolean value under this namespace. */
  getBoolean(key: string): boolean {
    return this.provider.getBoolean(this.resolveKey(key));
  }

  /** Check whether a key exists under this namespace. */
  has(key: string): boolean {
    return this.provider.has(this.resolveKey(key));
  }

  /** The namespace prefix used by this section (without trailing dot). */
  get namespace(): string {
    return this.prefix.slice(0, -1);
  }
}
