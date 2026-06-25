# ADR-0007: Campaign como único Agregado Raíz del Contexto de Campaña

## Contexto

El contexto delimitado de Campaña (`modules/campaign`) tiene la responsabilidad de coordinar metas de negocio, orquestar contenidos, presupuestos, públicos objetivos, agendas y métricas de rendimiento, traduciéndolos en publicaciones y ejecuciones concretas. 

En el diseño arquitectónico tradicional de DDD, se podría ver a `Budget`, `Audience`, `Goal`, `Schedule`, `Target` y `Publication` como agregados independientes con sus propios repositorios. Sin embargo, en el dominio de RRSS AUTO, estos conceptos no tienen un ciclo de vida propio que tenga sentido fuera de la campaña que los contiene. Crear múltiples agregados independientes introduciría complejidad de sincronización transaccional innecesaria (técnicas de consistencia eventual) y degradaría la integridad del negocio.

## Decisión

Definir `Campaign` como el **único** Agregado Raíz (*Aggregate Root*) dentro del contexto delimitado de Campaña.

Los siguientes conceptos se diseñan como entidades internas o Value Objects subordinados gobernados en su totalidad por `Campaign`:
- `Publication` (Entidad)
- `CampaignContent` (Entidad)
- `CampaignChannel` (Entidad)
- `CampaignMetricSnapshot` (Entidad)
- `CampaignAnalytics` (Entidad)
- `CampaignExecution` (Entidad)
- `Budget` (Entidad)
- `Schedule` (Entidad)
- `Audience` (Entidad)
- `Goal` (Entidad)

Consecuentemente, solo existirá un repositorio (`ICampaignRepository`) encargado de persistir y reconstituir la campaña de manera atómica con todo su árbol de relaciones.

## Consecuencias

- **Consistencia Inmediata**: Cualquier cambio en el presupuesto, canales, contenidos o publicaciones se ejecuta bajo una transacción atómica del agregado, garantizando invariantes sin recurrir a consistencia eventual.
- **Simplificación de la Persistencia**: La infraestructura de persistencia se reduce a un solo repositorio prisma y un mapeador bidireccional (`CampaignMapper`).
- **Encapsulación y Control de Estado**: El ciclo de vida y la máquina de estados de la campaña controlan rígidamente cuándo se pueden generar publicaciones (`Draft` -> `Ready` -> `Scheduled` -> etc.).
- **Compatibilidad con Plugins (Adapters)**: Los adaptadores externos consumirán entidades de tipo `Publication` a través del agregado sin interactuar directamente con la base de datos de campañas.

## Alternativas consideradas

### Múltiples Agregados con Consistencia Eventual
Se descarta debido a la alta complejidad para asegurar que el gasto del presupuesto (`Budget`) o las fechas de agenda (`Schedule`) no entren en conflicto con la activación de la campaña sin transacciones complejas distribuidas.
