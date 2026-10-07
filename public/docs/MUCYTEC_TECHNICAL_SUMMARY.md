# WARMA · resumen técnico actual

WARMA organiza acciones, pausas y reflexión como apoyo educativo a autorregulación/metacognición; no prueba eficacia clínica. Identidad/nudo y herramientas previas conservados. IndexedDB local, bienvenida opcional/preferencias explicables, cifras de actividad reales y jardín sin competencia.

Hardening implementado: AES-GCM opt-in con respaldo/migración reversible, controles de sesión/audio corregidos tras reproducción, Espejo con endpoint/adaptadores preparados pero remotos inactivos y readiness PWA que verifica recursos. PSS-10 pendiente de permiso y sin ítems; check-in/contextual separados. Sin nube, cuenta ni telemetría externa.

Para el jurado: JURY-EVIDENCE.md raíz enlaza problema → evidencia → decisión → implementación → prueba → alcance. No usar diarios de estudiantes en demostraciones ni llamar diagnósticos a los registros. Build/tests controlados pasan; navegador/GPU/audio/instalación reales y modelo remoto aún no verificados. No se publicó producción. La historia que sigue corresponde al concepto ÍTACA anterior, no al marco actual ni a evidencia de este checkpoint.

---

# ÍTACA — Resumen técnico para presentación

## Problema y propuesta

Las herramientas de estudio suelen separar tareas, tiempo y conocimiento en listas independientes. ÍTACA propone un espacio personal que convierte las acciones de aprendizaje en una evolución visual comprensible. La belleza del entorno pretende invitar al uso; no reemplaza la práctica ni demuestra por sí misma una mejora académica.

## Producto implementado

PWA en español con Core procedural persistente, seis regiones, misiones, proyectos con tareas y archivos, temporizador de enfoque, diario y cápsulas, memoria con flashcards y relaciones, cinco microjuegos, horizontes, observatorio, logros y exportación/restauración. WebGL/GLSL y un renderizador Essential forman dos interpretaciones de la misma identidad. No se requiere una cuenta propia de ÍTACA; el acceso a esta publicación se rige por la configuración de Sites.

## Datos que construyen el mundo

| Acción registrada | Representación |
| --- | --- |
| Misión completada | Partícula mineral y huella de actividad |
| Enfoque de al menos un minuto | Estructura y tiempo en la órbita semanal |
| Reflexión creada | Estrella |
| Materia creada | Constelación y sala de conocimiento |
| Proyecto terminado | Monumento y planeta completo |
| Requisitos de un logro cumplidos | Artefacto disponible en la colección |

## Inclusión y privacidad

Las funciones permanecen disponibles con hardware limitado. Essential evita depender de una GPU compatible. El diseño incluye movimiento reducido, texto ampliado, teclado y adaptación móvil. El contenido se almacena localmente y se puede respaldar. No hay clasificación pública de estudiantes, penalización por ausencia ni diagnóstico de capacidades.

## Alcance de la evidencia

La implementación y sus flujos principales se revisan mediante compilación, ejecución y capturas. Esto acredita funcionamiento técnico dentro del entorno disponible; no acredita efectividad pedagógica, superioridad sobre otras herramientas ni resultados en una población estudiantil. Esas afirmaciones requerirían un estudio y criterios comparativos definidos.

## Demostración sugerida

Abrir el Core; crear y completar una misión; iniciar Focus asociado a un proyecto; crear una materia y una flashcard; conectar ideas; guardar una reflexión; observar las huellas; cambiar a Essential; exportar un respaldo. Explicar que el mismo estado continúa después de recargar.
