# @rrss-auto/infrastructure

This package contains the **Platform Infrastructure SDK**. It is strictly framework-agnostic and provides base abstractions, contracts, and abstract classes that all modules in RRSS AUTO must consume.

## Purpose

To establish common infrastructure patterns across the enterprise monorepo without coupling the business logic to concrete libraries (like Prisma, Redis, RabbitMQ, NestJS, etc.). Concrete implementations (adapters) must depend on these contracts.

## Contents

- **Database & Repositories:** `DataMapper`, `BaseRepository`, `IDatabaseConnection`
- **Transactions & UoW:** `BaseUnitOfWork`, `BaseTransactionManager`
- **Events & Messaging:** `IEventStore`, `IEventPublisher`, `IMessageQueue`
- **Services & Utilities:** `ICacheService`, `ILockProvider`, `IFileSystem`, `IStorageService`, `ILogger`, `IConfigProvider`, `IHealthCheck`
- **Serialization:** `ISerializer`, `IDeserializer`
- **Aliased Abstractions:** `BaseClock`, `BaseIdentifierProvider`
- **Exceptions:** `InfrastructureException`

## Rules

1. **Do not** import NestJS, Express, Prisma, or any third-party framework here.
2. **Do not** add business logic (Workspace, Authentication, Billing).
3. **Do not** duplicate domain or application abstractions.
