# @rrss-auto/domain

Este es el Domain Kernel compartido de RRSS AUTO. Contiene todas las abstracciones y primitivas del dominio que deben ser utilizadas de manera transversal en los distintos módulos del proyecto.

## Estructura

- `aggregate-root`: Abstracción base para raíces de agregado.
- `entity`: Clase base para entidades con identidad propia.
- `value-object`: Clase base para objetos de valor inmutables con igualdad estructural.
- `domain-event`: Interfaz para eventos del dominio.
- `domain-exception`: Clase base para excepciones del dominio.
- `repository`: Contrato base para repositorios.
- `specification`: Implementación del patrón Specification para validaciones complejas.
- `guard`: Utilidades de validación para invariantes y precondiciones.
- `result`: Monada para representar éxitos y fallos.
- `either`: Tipo funcional Left/Right para control de flujo.
- `identifier`: Abstracción para provisión e ID generation en capa de aplicación.
- `clock`: Abstracción de reloj para control del tiempo.
- `interfaces` & `types`: Contratos y tipos compartidos transversales.

## Reglas

1. No debe depender de ningún framework o biblioteca externa (NestJS, Prisma, TypeORM, Express, etc.).
2. Código puro TypeScript libre de acoplamiento de infraestructura.
