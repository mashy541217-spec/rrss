# Lenguaje Ubicuo

El lenguaje ubicuo define las palabras que deben usar negocio, producto, arquitectura y desarrollo.

## Workspace

Espacio operativo principal de RRSS AUTO.

Un Workspace agrupa negocios, miembros, credenciales, automatizaciones, recursos de ejecucion, agentes de IA, campanas y contenido.

Decision: Workspace es el tenant principal porque permite manejar una agencia, equipo o unidad operativa que administra varios negocios.

## Business

Negocio administrado dentro de un Workspace.

Un Business representa una marca, cliente, empresa o proyecto comercial con identidad propia.

Decision: Business no es el tenant raiz porque un mismo Workspace puede operar varios negocios con miembros y recursos compartidos.

## Member

Persona o identidad operativa que participa en un Workspace.

Un Member puede tener roles y permisos dentro del Workspace.

Decision: se usa Member en vez de User dentro del dominio porque el concepto importante es pertenecer a un Workspace.

## Credential

Referencia gobernada a un secreto, token, cuenta o acceso necesario para operar una plataforma o recurso.

Decision: Credential no debe significar necesariamente "password"; puede representar OAuth, token, API key, sesion o secreto externo.

## Automation

Intencion operativa configurable que coordina acciones, recursos y politicas.

Decision: Automation no es un simple job tecnico. Es una regla de negocio ejecutable.

## Automation Run

Ejecucion concreta de una Automation.

Decision: separar Automation de Automation Run permite configurar una automatizacion una vez y auditar multiples ejecuciones.

## Virtual Machine

Recurso de ejecucion aislado que puede alojar navegador, herramientas, sesiones o procesos.

Decision: VM es recurso del Workspace, no detalle oculto de infraestructura, porque afecta aislamiento y operacion.

## Proxy

Recurso de red asignable para controlar origen, reputacion y aislamiento de trafico.

Decision: Proxy es concepto de dominio operativo porque su asignacion puede afectar cuentas y negocios.

## AI Agent

Capacidad gobernada de IA con proposito, herramientas, politicas y modelo asignado.

Decision: un Agent no es solo un prompt; es una unidad operativa auditable.

## Campaign

Iniciativa comercial o editorial que agrupa contenido, objetivos y acciones.

Decision: Campaign permite separar objetivos de negocio de piezas individuales de contenido.

## Content

Activo editorial planificado o reutilizable: texto, idea, medio, variante o pieza publicable.

Decision: Content no publica por si mismo. La publicacion ocurre mediante Automation o Connector.

## Connector

Adaptador de integracion con una plataforma externa.

Decision: Connector traduce el lenguaje interno al lenguaje de la plataforma externa sin contaminar el dominio.

## Policy

Regla que limita o permite acciones.

Decision: Policy debe ser explicita porque automatizacion, IA, proxies y credenciales necesitan control.

## Artifact

Evidencia producida por una ejecucion: captura, log, traza, respuesta, archivo o resumen.

Decision: Artifact hace investigables las operaciones automatizadas.

## Domain Event

Hecho relevante ocurrido en el dominio.

Decision: los eventos conectan contextos sin acoplarlos directamente.
