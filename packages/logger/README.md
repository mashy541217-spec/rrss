# @rrss-auto/logger

Shared Logger SDK for **RRSS AUTO**.

## Purpose

Provides framework-agnostic, pure TypeScript logging abstractions for the entire platform. No external dependencies (Pino, Winston, etc.). Concrete implementations will be provided by infrastructure adapters.

## Exports

| Export           | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `LogLevel`       | String union type for log severity levels               |
| `ILogContext`    | Interface for structured contextual metadata            |
| `ILogEntry`      | Data entry structure for a single log record            |
| `ILogger`        | Core logging contract consumed by all modules           |
| `NullLogger`     | No-op logger implementation (testing / silent mode)     |
| `ConsoleLogger`  | Structured console logger for development environments  |
| `LoggerFactory`  | Global registry for managing the active logger instance |

## Usage

```typescript
import { ILogger, LoggerFactory, ConsoleLogger } from '@rrss-auto/logger';

// Register a logger implementation
LoggerFactory.setLogger(new ConsoleLogger());

// Retrieve the global logger
const logger: ILogger = LoggerFactory.getLogger();

logger.info('Application started', { module: 'bootstrap' });
```
