/**
 * @deprecated Import directly from '@rrss-auto/configuration' instead.
 * Re-exported here for backward compatibility only.
 */
export {
  IConfigurationProvider,
  Environment,
  ConfigurationKey,
  ConfigurationSection,
  ConfigurationException,
} from '@rrss-auto/configuration';

/**
 * Backward-compatible alias.
 * @deprecated Use {@link IConfigurationProvider} from '@rrss-auto/configuration' instead.
 */
import { IConfigurationProvider } from '@rrss-auto/configuration';
export type IConfigProvider = IConfigurationProvider;
