# ADR-0004: Multi-negocio desde el inicio

## Contexto

RRSS AUTO gestionara multiples negocios independientes.

## Decision

Todo recurso relevante debe estar asociado a un negocio desde el diseno inicial.

## Consecuencias

- Mejor aislamiento.
- Menor riesgo de mezclar cuentas.
- Auditoria mas clara.
- Escalabilidad hacia 20 y 100 negocios.

## Alternativas consideradas

Agregar multi-tenancy mas adelante. Se descarta por alto riesgo de refactor y errores operativos.
