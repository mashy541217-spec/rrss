# Exceptions (Workspace Domain)

Las excepciones representan fallos de invariantes o violaciones de reglas de negocio. Todas extienden conceptualmente de una excepción base de dominio.

## Lista de Excepciones

- **InvalidWorkspaceNameException**: Se lanza cuando el nombre proporcionado no cumple con el formato o longitud esperada.
- **InvalidTimezoneException**: Se lanza cuando la zona horaria provista no es un IANA timezone válido.
- **WorkspaceAlreadyExistsException**: Se lanza cuando se intenta crear un Workspace con un nombre o identificador ya activo en el sistema provocando un conflicto comercial.
- **WorkspaceSuspendedException**: Se lanza cuando se intenta realizar una operación que muta estado sobre un Workspace que se encuentra suspendido.
- **WorkspaceArchivedException**: Se lanza cuando se interactúa operativamente con un Workspace cerrado definitivamente.
- **QuotaExceededException**: Se lanza (a menudo apoyado por el Resource Manager) si el límite definido en `WorkspaceLimits` ha sido rebasado.
- **InvalidWorkspaceTransitionException**: Se lanza si se intenta una transición de estado ilegal en la máquina de estados (ej. de `Archived` a `Active`).
