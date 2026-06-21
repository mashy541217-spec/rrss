# Types (Workspace Domain)

## Purpose
Proveer definiciones de tipos y alias para ser usados a lo largo del dominio de Workspace.

## Responsibilities
- Mejorar la legibilidad del código.
- Definir estructuras de datos puras de dominio.

## What belongs there
- Alias de tipos (`type`) en TypeScript para el dominio.

## What does NOT belong there
- Tipos de la capa de API o Base de Datos.
- Clases con comportamiento (van en `value-objects` o `entities`).

## Dependencies
- Ninguna.

## Examples
- `type WorkspaceProperties = { id: string; name: string; status: string; }`
