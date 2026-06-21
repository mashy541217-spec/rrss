# Flujo de Datos

Flujo conceptual futuro:

1. Un usuario crea contenido para un negocio.
2. El sistema valida politicas y calendario.
3. Se crea un trabajo de automatizacion.
4. Un worker ejecuta el trabajo.
5. El conector, navegador o dispositivo realiza la accion.
6. Se registran pasos, artefactos y resultado.
7. Observabilidad conserva el historial.

Cada paso debe conservar `business_id` para mantener aislamiento multi-negocio.
