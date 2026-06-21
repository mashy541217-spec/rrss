# RRSS AUTO Sprint 1.0: Core Domain Design

## Por que este diseno existe

RRSS AUTO no es un bot de redes sociales. Es una plataforma multi-tenant de automatizacion donde varios negocios, cuentas, credenciales, agentes, maquinas virtuales, proxies, campanas y contenidos deben convivir sin mezclarse.

Por eso el dominio no debe girar alrededor de "publicar en redes". Debe girar alrededor de `Workspace`, porque el problema principal es gobernar recursos, permisos, automatizaciones y ejecuciones dentro de un espacio aislado.

## Decision central

`Workspace` es el agregado y concepto raiz de la plataforma a nivel de tenant.

Un Workspace posee:

- Businesses;
- Members;
- Credentials;
- Automations;
- Virtual Machines;
- Proxies;
- AI Agents;
- Campaigns;
- Content.

Esto permite que RRSS AUTO crezca desde un uso pequeno hasta una operacion multi-negocio sin redisenar la identidad del sistema.

## Mapa conceptual

```mermaid
flowchart TB
  Workspace["Workspace"]

  Workspace --> Businesses["Businesses"]
  Workspace --> Members["Members"]
  Workspace --> Credentials["Credentials"]
  Workspace --> Automations["Automations"]
  Workspace --> VirtualMachines["Virtual Machines"]
  Workspace --> Proxies["Proxies"]
  Workspace --> AIAgents["AI Agents"]
  Workspace --> Campaigns["Campaigns"]
  Workspace --> Content["Content"]

  Campaigns --> Content
  Automations --> Campaigns
  Automations --> Content
  Automations --> Credentials
  Automations --> VirtualMachines
  Automations --> Proxies
  Automations --> AIAgents
  Businesses --> Campaigns
  Businesses --> Content
  Businesses --> Credentials
```

## Interpretacion del mapa

El Workspace no ejecuta trabajo por si mismo. Su responsabilidad es poseer y limitar el universo operativo.

Los negocios representan unidades comerciales dentro del Workspace. Las campanas y contenidos pueden asociarse a negocios, pero siguen gobernados por el Workspace.

Las automatizaciones coordinan recursos. No son simplemente tareas tecnicas: son intenciones operativas auditables que pueden usar credenciales, proxies, maquinas virtuales, agentes de IA y contenido.

## Contextos delimitados

```mermaid
flowchart LR
  WorkspaceContext["Workspace Management"]
  AccessContext["Access & Membership"]
  BusinessContext["Business Portfolio"]
  CredentialContext["Credential Governance"]
  ContentContext["Content & Campaign Planning"]
  AutomationContext["Automation Orchestration"]
  ResourceContext["Execution Resources"]
  AgentContext["AI Agent Governance"]
  ObservabilityContext["Audit & Observability"]
  ConnectorContext["Platform Connectors"]

  WorkspaceContext --> AccessContext
  WorkspaceContext --> BusinessContext
  WorkspaceContext --> CredentialContext
  WorkspaceContext --> ContentContext
  WorkspaceContext --> AutomationContext
  WorkspaceContext --> ResourceContext
  WorkspaceContext --> AgentContext

  AutomationContext --> CredentialContext
  AutomationContext --> ContentContext
  AutomationContext --> ResourceContext
  AutomationContext --> AgentContext
  AutomationContext --> ConnectorContext
  AutomationContext --> ObservabilityContext

  ConnectorContext --> ObservabilityContext
  AgentContext --> ObservabilityContext
  ResourceContext --> ObservabilityContext
```

## Por que estos contextos

Cada contexto tiene una razon de cambio distinta.

`Workspace Management` cambia cuando cambia el modelo multi-tenant.

`Access & Membership` cambia cuando cambian permisos, roles o usuarios.

`Business Portfolio` cambia cuando cambia la forma de representar negocios internos de un Workspace.

`Credential Governance` cambia por seguridad, rotacion, vencimiento o proveedores.

`Content & Campaign Planning` cambia por necesidades editoriales y comerciales.

`Automation Orchestration` cambia por reglas de ejecucion, scheduling, reintentos y politicas.

`Execution Resources` cambia por infraestructura: VMs, proxies, navegadores y Android.

`AI Agent Governance` cambia por modelos, prompts, herramientas y politicas de IA.

`Platform Connectors` cambia por APIs externas y plataformas sociales.

`Audit & Observability` cambia por necesidades de trazabilidad, cumplimiento e investigacion.

## Flujo de dominio de alto nivel

```mermaid
sequenceDiagram
  participant Member
  participant Workspace
  participant Campaign
  participant Content
  participant Automation
  participant Resource
  participant Connector
  participant Audit

  Member->>Workspace: Opera dentro de un Workspace
  Workspace->>Campaign: Autoriza planificacion
  Campaign->>Content: Agrupa piezas de contenido
  Content->>Automation: Solicita ejecucion programada
  Automation->>Resource: Reserva VM, proxy o agente
  Automation->>Connector: Ejecuta accion externa
  Connector->>Audit: Registra resultado
  Automation->>Audit: Registra pasos y estado final
```

## Principio de consistencia

La consistencia fuerte debe existir dentro de cada agregado. Entre contextos se favorecen eventos de dominio y procesos asincronos.

Esto evita que una automatizacion larga, una llamada externa o una sesion de navegador bloquee el nucleo del Workspace.

## Principio de aislamiento

Toda entidad operativa debe poder responder:

- a que Workspace pertenece;
- que negocio afecta, si aplica;
- que miembro o proceso la creo;
- que recursos uso;
- que resultado produjo;
- que eventos genero.

## Limites que no deben cruzarse

- Un conector externo no decide politicas de negocio.
- Un agente de IA no ejecuta acciones sensibles sin politica de automatizacion.
- Una credencial no pertenece a una campana; pertenece al Workspace y puede asignarse bajo reglas.
- Una maquina virtual no pertenece a una automatizacion de forma permanente; se reserva o asigna segun politica.
- Un negocio no es tenant principal; el tenant principal es Workspace.

## Resultado esperado

Este diseno debe guiar futuras implementaciones de entidades, casos de uso, APIs, esquemas, workers, agentes, conectores e infraestructura.
