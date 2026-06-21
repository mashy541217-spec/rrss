# Policies (Workspace Domain)

## Business Rules

### WorkspaceCreationPolicy
Verifica las condiciones antes de crear un Workspace.
- No se permite crear un Workspace con un nombre que ya esté activo y pertenezca a la misma organización.
- El creador debe ser una entidad verificable (ej. no usuarios anónimos).

### WorkspaceSuspensionPolicy
Determina las reglas para la suspensión.
- Un Workspace no puede ser suspendido si pertenece al sistema core (root tenant).
- Suspender un Workspace requiere obligatoriamente proveer un `SuspensionReason` auditable.

### ResourceUsagePolicy (Conceptual limit)
Evalúa si una acción de dominio debe ser permitida basándose en `WorkspaceLimits`.
- Ejemplo: `canCreateNewBusiness(workspace: Workspace, currentBusinessCount: number): boolean`
- Regla: La cantidad actual de negocios no debe exceder el `maxBusinesses` en `WorkspaceLimits`.
