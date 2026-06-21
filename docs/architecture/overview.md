# Arquitectura General

RRSS AUTO se disena como monolito modular inicial.

## Por que monolito modular

El proyecto necesita avanzar con velocidad controlada sin pagar desde el dia uno el costo operacional de muchos servicios. La modularidad permite mantener limites claros y extraer servicios cuando exista una razon real.

## Capas

- Apps: entradas del sistema.
- Application: casos de uso.
- Domain: reglas del negocio.
- Infrastructure: adaptadores tecnicos.
- Connectors: integraciones externas.
- Observability: trazabilidad y auditoria.

## Regla principal

Los detalles tecnicos pueden cambiar. Los limites del dominio deben permanecer estables.
