# Domain Design

Esta carpeta contiene el diseno de dominio de RRSS AUTO usando principios de Domain-Driven Design.

El objetivo es definir el lenguaje, los limites conceptuales y las relaciones del sistema antes de escribir codigo, crear APIs o modelar bases de datos.

## Documentos

- `core-domain.md`: diseno completo del dominio central.
- `ubiquitous-language.md`: lenguaje ubicuo del proyecto.
- `bounded-contexts.md`: contextos delimitados y responsabilidades.
- `aggregates.md`: agregados, entidades y value objects.
- `domain-events.md`: eventos de dominio y relaciones.

## Regla principal

`Workspace` es el concepto de primer nivel. Todo recurso importante del sistema existe dentro de un Workspace o se relaciona explicitamente con uno.
