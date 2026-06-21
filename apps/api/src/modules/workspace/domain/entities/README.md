# Entities (Workspace Domain)

## WorkspaceSettings
**Why it exists:** Contiene preferencias operacionales y de configuración del Workspace que pueden cambiar con el tiempo sin afectar la identidad principal del Workspace.
- Responsabilidades: Manejar timezone preferida, idioma (locale) por defecto y opciones de retención de auditoría.

## WorkspaceLimits
**Why it exists:** Controla las cuotas operativas asociadas a un Workspace específico, previniendo el abuso de recursos y garantizando la viabilidad del tenant.
- Responsabilidades: Definir número máximo de negocios, límite de ejecuciones concurrentes y número máximo de proxies/VMs permitidos.

## WorkspaceOwner (Ref)
**Why it exists:** Identifica al creador o propietario principal dentro del Workspace para propósitos de facturación o responsabilidad legal.
- Responsabilidades: Mantener el contacto principal del Workspace. *(Nota: El Membership detallado y los roles pertenecen al Bounded Context 'Access & Membership', pero la entidad Workspace mantiene una referencia al dueño principal)*.
