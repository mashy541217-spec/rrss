# Domain Services (Workspace Domain)

## Purpose
Los Domain Services se utilizan cuando una lógica de negocio involucra la orquestación de múltiples políticas, agregados o repositorios, que no puede residir naturalmente dentro del `Workspace` Aggregate Root.

## WorkspaceOnboardingService
**Propósito:** Orquestar el flujo inicial y validación transversal en la creación de un Workspace (ref: Blueprint-0001).
- **Responsabilidades:** Valida duplicidad en el `IWorkspaceRepository`, evalúa `WorkspaceCreationPolicy`, utiliza la `WorkspaceFactory` para crear el agregado, y persiste la entidad.

## WorkspaceSuspensionService
**Propósito:** Encapsular la lógica de suspensión, que va más allá de cambiar el estado de la entidad.
- **Responsabilidades:** Evalúa si el `Workspace` se puede suspender. Cambia el estado del Workspace a `Suspended`.
- *(Nota: Las acciones colaterales como detener las ejecuciones se manejarán mediante el consumo de eventos `WorkspaceSuspended` en los contextos correspondientes como `Automation Orchestration` y `Resource Manager`, respetando el aislamiento)*.
