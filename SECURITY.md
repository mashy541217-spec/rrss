# Seguridad

RRSS AUTO manejara credenciales sensibles, sesiones de navegadores, cuentas sociales, datos de negocios, proxies y posibles dispositivos fisicos o virtuales.

## Politicas base

- No registrar secretos en logs.
- No guardar tokens en texto plano.
- No compartir sesiones entre negocios.
- No usar cuentas reales en pruebas automatizadas.
- No mezclar datos de negocios en fixtures.
- Toda accion automatizada debe dejar rastro auditable.

La estrategia detallada vive en `docs/security/`.
