# Proyecto RRSS AUTO

## Vision

Construir una plataforma mantenible y escalable para administrar y automatizar operaciones de redes sociales para multiples negocios, con soporte progresivo para Facebook, Instagram, Meta Ads, WhatsApp Business, TikTok, Gmail, Android, navegadores, agentes de IA, PostgreSQL, Redis, Docker, VMware y proxies residenciales.

## Alcance inicial

El alcance inicial no es automatizar todas las plataformas. El objetivo inicial es crear el nucleo de control:

- gestion de negocios;
- cuentas y credenciales;
- calendario de contenido;
- trabajos de automatizacion;
- ejecuciones auditables;
- conectores aislados;
- workers futuros;
- observabilidad;
- politicas de IA.

## Escala objetivo

- Etapa 1: 5 negocios.
- Etapa 2: 20 negocios.
- Etapa 3: 100 negocios.

## Reglas no negociables

- No se mezcla codigo especifico de plataformas con el dominio principal.
- No se ejecutan automatizaciones sin registro de ejecucion.
- No se guardan secretos sin estrategia de cifrado.
- No se permite que un fallo de un negocio afecte a otro.
- No se agrega infraestructura real sin documentar la decision.
- No se agrega codigo sin una frontera de modulo clara.
