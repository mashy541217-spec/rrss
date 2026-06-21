# Factories (Workspace Domain)

## WorkspaceFactory

### Creation Flow
La creación del Aggregate Root `Workspace` no es una simple instanciación de clase; sigue un Blueprint de dominio.

1. **Recibir solicitud:** Recibe variables primas (string para nombre, string para timezone, enum para plan).
2. **Crear Value Objects:** Instancia `WorkspaceName`, `Timezone`, `WorkspacePlan`, lanzando excepciones si alguno es inválido.
3. **Generar Identidad:** Si es un nuevo Workspace, solicita la generación de un `WorkspaceId`.
4. **Instanciar Entidades:** Crea los objetos internos como `WorkspaceSettings` (con la zona horaria provista) y `WorkspaceLimits` (basado en el plan seleccionado).
5. **Ensamblar Agregado:** Crea la instancia `Workspace` en estado `Active` o `PendingActivation` (según política).
6. **Registrar Evento:** Agrega el evento `WorkspaceCreated` al registro interno del agregado para que sea despachado al guardar en el repositorio.
