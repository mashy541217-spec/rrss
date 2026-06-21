# Enums (Workspace Domain)

## Purpose
Definir tipos enumerados que representan estados fijos o categorizaciones del dominio de Workspace.

## Responsibilities
- Garantizar tipado estricto para valores que solo pueden ser un conjunto finito de opciones.

## What belongs there
- Enumeraciones de estados operativos, tipos, o categorías de negocio.

## What does NOT belong there
- Enums técnicos o mapeos hacia la API directamente.

## Dependencies
- Ninguna.

## Examples
- `WorkspaceStatus` (Active, Suspended, Archived)
- `WorkspacePlan` (Starter, Pro, Enterprise)
