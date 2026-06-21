# Limites de Servicios

RRSS AUTO comienza como monolito modular, pero sus modulos deben poder convertirse en servicios independientes.

## Servicios futuros posibles

- API Service;
- Scheduler Service;
- Worker Service;
- Browser Automation Service;
- Android Automation Service;
- AI Agent Service;
- Connector Service;
- Observability Service.

## Criterios para separar un servicio

- escala independiente;
- despliegue independiente;
- equipo responsable independiente;
- riesgo operacional distinto;
- dependencia tecnica pesada.

No se debe separar un servicio solo por anticipacion.
