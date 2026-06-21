# ADR-0005: Workspace como concepto principal del dominio

## Contexto

RRSS AUTO sera una plataforma multi-tenant que puede administrar multiples negocios, miembros, credenciales, automatizaciones, recursos, agentes, campanas y contenidos.

El riesgo principal no es solo automatizar redes sociales. El riesgo principal es mezclar recursos, permisos, credenciales o ejecuciones entre clientes y negocios.

## Decision

`Workspace` sera el concepto de primer nivel del dominio.

Un Workspace posee y gobierna:

- Businesses;
- Members;
- Credentials;
- Automations;
- Virtual Machines;
- Proxies;
- AI Agents;
- Campaigns;
- Content.

## Consecuencias

- El aislamiento multi-tenant queda incorporado desde el inicio.
- Los negocios pueden existir como unidades operativas dentro de un Workspace.
- Los recursos compartidos se gobiernan sin duplicar infraestructura por cada negocio.
- Las automatizaciones siempre pueden rastrearse hasta un Workspace.
- Futuras APIs, esquemas y permisos deberan respetar este limite.

## Alternativas consideradas

### Business como tenant raiz

Se descarta porque una agencia o equipo puede operar varios negocios con miembros, proxies, agentes y VMs compartidas.

### Account como concepto raiz

Se descarta porque reduce el dominio a integraciones sociales y no representa la plataforma completa.

### Automation como concepto raiz

Se descarta porque la automatizacion es central, pero necesita gobierno de Workspace, permisos, credenciales y recursos.
