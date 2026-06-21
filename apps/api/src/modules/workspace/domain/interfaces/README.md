# Interfaces (Workspace Domain)

## Purpose
Definir contratos de dominio adicionales que no corresponden a repositorios, pero que deben ser implementados.

## Responsibilities
- Declarar dependencias abstractas que el dominio requiere (por ejemplo, generadores de IDs si se inyectan).
- Modelar polimorfismo dentro del dominio.

## What belongs there
- Contratos (interfaces en TypeScript) usados por agregados o servicios de dominio.

## What does NOT belong there
- Interfaces de servicios de infraestructura.
- Interfaces de casos de uso (van en `application`).

## Dependencies
- Depende del contrato, típicamente `value-objects`.

## Examples
- `IWorkspaceIdentityGenerator`: Interfaz de dominio para generar un identificador de Workspace.
