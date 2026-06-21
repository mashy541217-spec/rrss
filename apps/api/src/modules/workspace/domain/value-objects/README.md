# Value Objects (Workspace Domain)

## Immutability
Todos los Value Objects en este dominio son inmutables. Si sus valores cambian, se crea una nueva instancia del objeto.

## WorkspaceId
- **Definition:** Identificador único y estable del Workspace.
- **Validation Rules:** Debe ser un UUID/ULID válido o un identificador alfanumérico que cumpla con el estándar de la plataforma. No puede ser vacío o nulo.

## WorkspaceName
- **Definition:** El nombre visible comercialmente del Workspace.
- **Validation Rules:** Longitud mínima de 3 caracteres, máxima de 100 caracteres. No puede estar vacío ni contener solo espacios.

## WorkspaceStatus
- **Definition:** Representa el estado en la máquina de estados operativa del Workspace.
- **Validation Rules:** Solo puede tomar valores predefinidos (CreationRequested, Active, Suspended, Archived, etc.).

## Timezone
- **Definition:** La zona horaria predeterminada para las automatizaciones operadas dentro del Workspace.
- **Validation Rules:** Debe ser un identificador válido de zona horaria IANA (ej. `America/Santiago`).

## WorkspacePlan
- **Definition:** Representa la categoría o tier comercial asignado al Workspace.
- **Validation Rules:** Debe coincidir con los planes soportados de la plataforma (ej. Starter, Pro, Enterprise).

## LimitValue
- **Definition:** Encapsula un valor numérico para una cuota operativa (ej. max concurrent executions).
- **Validation Rules:** Debe ser un entero positivo o cero.
