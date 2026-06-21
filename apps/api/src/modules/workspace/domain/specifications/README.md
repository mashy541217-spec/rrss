# Specifications (Workspace Domain)

Las Specifications permiten reusar lógica de validación sin acoplar los servicios.

## ActiveWorkspaceSpecification
- Valida si un `Workspace` está en estado `Active`.
- Útil para prevenir operaciones sobre tenants suspendidos o archivados.

## CanAcceptNewExecutionsSpecification
- Verifica si el Workspace no solo está activo, sino si su plan (`WorkspacePlan`) no tiene bloqueos o límites temporales de cuota exhausta que prevengan planificar nuevas `Executions`.

## IsEligibleForArchivalSpecification
- Verifica si un Workspace puede ser archivado de forma segura (ej. no tiene ejecuciones en estado `Running` ni `Resource Leases` activos críticos no liberados).
