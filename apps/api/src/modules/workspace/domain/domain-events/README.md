# Domain Events (Workspace Domain)

Los eventos se publican internamente en el momento en que se procesan comandos en la capa de dominio, indicando que ocurrió un hecho relevante y auditable.

## WorkspaceCreated
- **When it occurs:** Cuando un nuevo Workspace ha pasado todas las validaciones, se han asignado sus políticas base y ha entrado en estado operativo.
- **Published by:** `WorkspaceFactory` o `WorkspaceDomainService` tras persistir el agregado en el repositorio.
- **Consumed by:** 
  - `Audit & Observability` (para iniciar el timeline).
  - `Access & Membership` (para crear el propietario inicial).
  - `Credential Governance` (para preparar bóvedas de secretos).

## WorkspaceSuspended
- **When it occurs:** Cuando un administrador o sistema automatizado suspende un Workspace por riesgo comercial o impago.
- **Published by:** `Workspace` Aggregate Root al cambiar su estado a Suspended.
- **Consumed by:**
  - `Automation Orchestration` (para detener ejecuciones futuras o cancelar las activas).
  - `Execution Resources` (para liberar VMs, proxies, y otros recursos).

## WorkspaceArchived
- **When it occurs:** Cuando el Workspace se retira definitivamente.
- **Published by:** `Workspace` Aggregate Root al cambiar su estado a Archived.
- **Consumed by:** Todas las capas operativas para realizar limpieza o congelamiento de información.

## WorkspaceSettingsUpdated
- **When it occurs:** Cuando el administrador modifica las configuraciones base como la zona horaria.
- **Published by:** `Workspace` Aggregate Root.
- **Consumed by:** `Scheduler` (si la zona horaria afecta la planificación de ejecuciones) y `Audit`.
