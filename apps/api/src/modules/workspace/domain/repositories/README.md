# Repositories (Workspace Domain)

## IWorkspaceRepository
Contrato principal para recuperar y persistir el Aggregate Root `Workspace`.

### Métodos del Contrato
- `save(workspace: Workspace): Promise<void>`
  - Guarda un Workspace nuevo o actualiza uno existente. Emite internamente los Domain Events no publicados asociados al agregado.
- `findById(id: WorkspaceId): Promise<Workspace | null>`
  - Reconstruye el agregado de Workspace a partir de su ID.
- `findByName(name: WorkspaceName): Promise<Workspace | null>`
  - Busca un Workspace por su nombre, típicamente usado para validar duplicidad semántica durante la creación.
- `findActiveWorkspaces(): Promise<Workspace[]>`
  - Retorna un conjunto de Workspaces operativos (paginado conceptualmente).

*(No existe implementación concreta aquí. Las capas de `Infrastructure` proveerán los adaptadores, por ejemplo con TypeORM o Prisma)*.
