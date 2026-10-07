# WARMA · QA externa pendiente

Usar esta rama y datos sintéticos en un perfil separado; no reemplazar la producción estable. Registrar commit/browser/OS/dispositivo, pasos, resultado y evidencia. Estados: PASS, FAIL reproducible, NO VERIFICADO. Una prueba no realizada no es un fallo. No se ha ejecutado este checklist nativo en Work.

## Ejecutar

Node >=22.13. `npx --yes pnpm@11.25.0 install --frozen-lockfile`, después `npm run dev` para UI. Para offline de producción: `npm run build`, `node scripts/prepare-pwa.mjs`, `npm run start`. Arquitectura SERVER; no subir dist/client como app completa a Netlify Drop. Mantener remoto Espejo inactivo durante QA local; no requiere clave para el núcleo. Sólo habilitar tras protocolo/configuración/piloto fuera de este bloque.

## Responsive y funciones

Probar todas las resoluciones: 320×568, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080. En cada una: Inicio, Camino, Espejo, Bitácora, Respirar, Mi jardín, Concentración, Preferencias y modales de respaldo/cifrado. También revisar Todas las herramientas, proyectos, Memoria/flashcards, pausas corporales, Atelier, Mi ritmo, misiones, microjuegos, horizontes y apoyo humano.

Comprobar nudo y calidad Esencial/Equilibrada/Inmersiva; datos iguales en los tres, fallback si falla WebGL. Botón «Necesito parar» respeta safe areas y no cubre controles inferiores; sin clipping/scroll horizontal accidental, modales dentro del viewport, texto legible y áreas táctiles accesibles. Texto ampliado y reduced motion no rompen la composición. Capturar cada vista/tamaño relevante con fecha/commit; no usar capturas históricas como evidencia nueva.

## Historial y teclado

Inicio → Camino → Atrás → Adelante; Inicio → Espejo → Atrás → Adelante; Inicio → Bitácora → Atrás; Inicio → Mi jardín → Atrás. Recargar cada hash y raíz, pegar URL interna y abrirla en otra pestaña; URL/vista coinciden. Foco no queda fuera de contenido visible.

Sólo Tab/Shift+Tab/Enter/Space/Escape: enlace saltar, nav, menú móvil, contenido, modales, audio, cerrar y volver. aria-current en actual, icon-only nombrados, foco visible y orden lógico, sin focus trap accidental; modal restringe foco y lo devuelve al cerrar. Usar axe/lector cuando esté disponible, registrar violaciones y alcance; no declarar AA sin auditoría completa.

## Concentración / recomendaciones

Ligera/Intermedia/Alta y guardar/recargar. Elegir mi siguiente paso/Encontrar claridad/Necesito parar. «¿Por qué?» corresponde a elecciones reales; no se interpreta como puntuación PSS.

Recomendación visible y ajuste antes de iniciar. Duraciones: vacío, 0, -1, 1.5, 181/excesivo no inician; 1 y 180 válidos. Verificar borde válido, pausa/reanudación, salida anticipada, finalización única/registro y recarga del timer. Una sesión real de un minuto no se acredita mediante acelerar reloj.

## Respirar y audio

Iniciar, pausar, reanudar, audio on/off, MUTE ALL, pestaña oculta/regreso, salir y volver a entrar. Doble clic rápido no crea contextos/timers duplicados. Ningún audio sigue al abandonar/ocultar; guía/indicador correctos. Tiempo oculto no completa una pausa. Nueva sesión no recibe guardado tardío de la anterior. Cierre antes del mínimo no inventa pausa completada. Revisar AudioContext/intervals en DevTools durante el recorrido; registrar comportamiento nativo.

## Persistencia y protección

En perfil sintético legacy: crear diario/borrador/proyecto/check-in y exportar copia; recargar conserva contenido/seed. Activar cifrado desde Preferencias sólo con frase propia larga y archivo/frase conservados; preparar no altera el original, rechazar confirmación no migra. Ver archivo ciphertext sin texto privado visible.

Bloquear, recargar, phrase correcta/incorrecta, cerrar/reabrir. Vistas privadas desaparecen; no sobreescribir tras fallo de autenticación. Importar copia cifrada/legacy sobre perfil de prueba con confirmación; backup anterior protegido. Alterar byte de ciphertext y rechazar restauración conservando original. Dos pestañas: cambios concurrentes conservados; pestaña vieja no reemplaza ciphertext. Cerrar durante guardado y verificar durabilidad; simular cuota/fallo con datos conservados. No olvidar que frase perdida no se recupera y copias legacy siguen legibles.

PSS continúa bloqueado: no respuestas/resultados personales; ficha disponible. Contextual pendiente no se llama validado. No activar flags para una demo ni incluir paquetes protegidos.

## PWA nativa y consola

Desde build preparado en origen seguro: esperar readiness y revisar CacheStorage/controller. Todos los recursos públicos válidos; no /api/espejo, RSC, textos privados o PSS. Borrar un recurso sintético y reabrir Preferencias/recuperar visibilidad: no anuncia preparación completa. Modo avión: recargar raíz/hashes, abrir módulos, escribir/guardar y reiniciar instalada. Reconectar, actualizar a otro build sin mezclar assets y sin perder IDB. Si falla red y no hay shell, fallback explica primera visita; ningún engaño de disponibilidad.

DevTools durante todo el recorrido: clasificar ERROR/WARNING/INFORMACIÓN, reproducir sólo los propios. No atribuir advertencias de plataforma a un error demostrado de WARMA. Registrar LCP/CLS/INP/CPU/memoria/long tasks/FPS por modo y dispositivo; budgets de disco no equivalen a esas cifras.

## Registro

| Prueba | Tamaño/browser/commit | PASS / FAIL / NO VERIFICADO | Evidencia | Reproducción / gravedad |
| --- | --- | --- | --- | --- |
| Pendiente de ejecución externa | — | NO VERIFICADO | — | — |

Si aparece un P0 Critical o P1 High, detener mejoras visuales y corregir con test/commit independiente; no publicar/merge sin autorización. Las pruebas nativas pendientes son bloqueos de evidencia, no fallos ficticios.
