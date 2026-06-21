# ADR-0006: Execution Engine como nucleo operativo de la plataforma

## Contexto

RRSS AUTO no debe construirse alrededor de una plataforma social, una herramienta de navegador o un proveedor de IA.

Todas esas piezas son capacidades reemplazables. El valor principal de la plataforma es convertir intenciones operativas en ejecuciones gobernadas, distribuidas, auditables y recuperables.

## Decision

El Execution Engine sera el nucleo operativo de RRSS AUTO.

Toda automatizacion futura debe convertirse en una Execution y ejecutarse mediante el Engine.

## Consecuencias

- Todas las capacidades futuras comparten ciclo de vida.
- Los workers se vuelven ejecutores gobernados, no duenos de la logica global.
- Los recursos criticos se asignan mediante leases.
- Los fallos se clasifican y recuperan de forma consistente.
- La observabilidad se construye alrededor de timelines de Execution.
- La plataforma queda preparada para ejecucion distribuida y 1000 ejecuciones concurrentes.

## Alternativas consideradas

### Automatizaciones por modulo

Se descarta porque cada modulo terminaria inventando su propio runtime, sus propios retries y su propia recuperacion.

### Workers inteligentes por capacidad

Se descarta porque acopla decisiones globales a implementaciones especificas.

### Scheduler simple sin Execution formal

Se descarta porque no ofrece suficiente trazabilidad, idempotencia ni recuperacion ante fallos distribuidos.
