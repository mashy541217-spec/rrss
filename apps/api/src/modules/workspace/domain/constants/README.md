# Constants (Workspace Domain)

## Purpose
Centralizar valores constantes utilizados específicamente en el dominio de Workspace.

## Responsibilities
- Evitar 'magic strings' o 'magic numbers' dispersos en el código de dominio.
- Mantener los valores de configuración fija del negocio en un solo lugar.

## What belongs there
- Constantes puras (ej. límites máximos, duraciones por defecto del negocio).

## What does NOT belong there
- Constantes de infraestructura (rutas, puertos, URLs de base de datos).
- Cadenas de texto para respuestas HTTP.

## Dependencies
- Ninguna.

## Examples
- `MAX_BUSINESSES_PER_DEFAULT_WORKSPACE = 5`
