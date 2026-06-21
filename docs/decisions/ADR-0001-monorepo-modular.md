# ADR-0001: Monorepo modular

## Contexto

RRSS AUTO debe crecer durante anos y soportar multiples capacidades: API, workers, IA, navegadores, Android, VMware, proxies e integraciones sociales.

## Decision

Iniciar con un monorepo organizado como monolito modular.

## Consecuencias

- Desarrollo inicial mas simple.
- Limites de dominio visibles desde el comienzo.
- Menor costo operacional.
- Posibilidad de extraer microservicios mas adelante.

## Alternativas consideradas

Microservicios desde el inicio. Se descarta por complejidad operacional prematura.
