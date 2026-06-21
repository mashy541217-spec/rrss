# Testing SDK (`@rrss-auto/testing`)

Centralized testing utilities and shared SDK for RRSS AUTO.

## Structure

- `src/builders/`: Fluent builders for domain aggregates, entities, and value objects.
- `src/fakes/`: Memory-backed fakes implementing domain/application contracts (e.g. repositories, clocks).
- `src/events/`: Mock and fake event bus definitions.
- `src/assertions/`: Custom assertions for testing patterns (e.g. domain event assertion).
