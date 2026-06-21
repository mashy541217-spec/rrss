# RRSS AUTO

RRSS AUTO es una plataforma empresarial para automatizar la gestion de redes sociales, mensajeria, publicidad, navegadores, dispositivos Android, agentes de IA e infraestructura operativa para multiples negocios independientes.

Este repositorio comienza como un monolito modular con arquitectura limpia y limites de dominio explicitos. La estructura esta preparada para evolucionar a microservicios cuando la escala, el equipo o la operacion lo justifiquen.

## Estado actual

Sprint 0.1: estructura profesional del repositorio y documentacion inicial.

No existe logica de aplicacion en este sprint.

## Principios

- Todo pertenece a un negocio.
- Cada automatizacion debe ser auditable.
- Las credenciales nunca deben mezclarse con logica de negocio.
- Los conectores externos deben estar aislados del nucleo.
- La automatizacion de navegador, Android y VMware debe operar como capacidad separada.
- La IA debe ser gobernada por politicas, prompts versionados y registros de ejecucion.
- La documentacion forma parte del producto.

## Estructura principal

- `apps/`: puntos de entrada futuros de la plataforma.
- `src/modules/`: modulos de negocio y capacidades principales.
- `src/shared/`: bloques compartidos de arquitectura limpia.
- `docs/`: arquitectura, decisiones, seguridad, roadmap y operacion.
- `infra/`: preparacion de infraestructura, sin contenedores reales aun.
- `tests/`: estructura preparada para pruebas unitarias, integracion, contrato y e2e.
- `tools/`: herramientas operativas futuras y playbooks.
- `configs/`: configuraciones documentadas por entorno.

## Siguiente paso recomendado

El siguiente sprint deberia definir el stack tecnico y el modelo inicial de dominio antes de escribir cualquier logica de aplicacion.
