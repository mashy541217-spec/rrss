# ADR-0003: Arquitectura limpia

## Contexto

Las APIs externas, herramientas de IA, navegadores y dispositivos cambiaran con el tiempo.

## Decision

Usar arquitectura limpia: dominio y casos de uso no deben depender directamente de frameworks, plataformas externas ni infraestructura.

## Consecuencias

- Mejor testabilidad.
- Menor acoplamiento.
- Integraciones reemplazables.
- Mayor claridad de responsabilidades.

## Alternativas consideradas

Arquitectura centrada en frameworks. Se descarta porque aumenta deuda tecnica en proyectos largos.
