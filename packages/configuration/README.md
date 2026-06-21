# @rrss-auto/configuration

Shared Configuration SDK for **RRSS AUTO**.

## Purpose

Provides framework-agnostic, pure TypeScript configuration abstractions for the platform. No external dependencies (Dotenv, AWS SSM, etc.). Concrete providers will be implemented in the infrastructure layer.

## Exports

| Export                     | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| `Environment`              | Enum of standard runtime environments                |
| `ConfigurationKey`         | Value object for validated configuration key strings  |
| `ConfigurationSection`     | Namespace-aware configuration section                 |
| `ConfigurationException`   | Domain-specific exception for configuration errors    |
| `IConfigurationProvider`   | Core contract for configuration providers             |

## Usage

```typescript
import { IConfigurationProvider, Environment } from '@rrss-auto/configuration';

class AppBootstrap {
  constructor(private readonly config: IConfigurationProvider) {}

  start(): void {
    const port = this.config.getNumber('APP_PORT');
    const env = this.config.getEnvironment();

    if (env === Environment.Production) {
      // production-specific setup
    }
  }
}
```
