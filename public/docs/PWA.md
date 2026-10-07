# PWA, funcionamiento local y rendimiento

## Instalación

El manifiesto define nombre, iconos, modo standalone, colores y ámbito `/`. El botón de instalación usa `beforeinstallprompt` cuando existe y explica el procedimiento de Safari cuando no. La disponibilidad exacta depende del navegador y de HTTPS.

## Offline

`public/sw.js` es la plantilla. Tras compilar, `scripts/prepare-pwa.mjs` recorre `dist/client`, calcula un hash y escribe el service worker de esa versión con los recursos públicos locales, excluyendo directivas de hosting y metadatos internos. La instalación espera a la precarga y verifica respuestas válidas, tipos MIME y que el HTML apunte a los bundles de esa versión antes de activar. Las páginas usan red primero, con límite de tres segundos y retorno a la aplicación guardada. Los recursos de la versión se sirven desde caché. No se cachean API, autenticación ni contenido de otros orígenes.

La primera visita requiere conexión y que la caché se prepare correctamente. IndexedDB funciona de forma independiente del service worker. No se garantiza retención indefinida: un navegador puede eliminar almacenamiento. Exportar un respaldo permite recuperar el contenido.

## Comprobación de preparación

La interfaz no toma el registro/`navigator.serviceWorker.ready` como prueba de caché completa. El controller de la página responde por un MessageChannel a CACHE_STATUS; comprueba todos los recursos del precache y que los JS/CSS referenciados por la página pertenezcan a esa versión. Sin controller, en desarrollo, ante recursos faltantes/HTML en vez de JS, errores o timeout, muestra que aún no está preparada. Recomprueba al cambiar controller, recuperar visibilidad, pageshow o cambiar conexión; cancela ports/timers al desmontar. Es una comprobación de ese momento, no garantía de almacenamiento permanente.

Root fetches/RSC y /api/espejo no reciben HTML cacheado. Fallos de caché no descartan una respuesta correcta de red. La persistencia privada se mantiene en IndexedDB; SW sólo guarda shell/recursos públicos. Respuestas de IA, diarios y escalas no se precachean.

## Calidad

- Immersive: WebGL con antialias y resolución máxima de 1.7 veces el tamaño CSS.
- Balanced: WebGL con menor resolución y sin antialias inicial.
- Essential: Canvas 2D, proyección de facetas y visualizaciones SVG/CSS. Misma información y funciones.

La selección automática considera pantalla y capacidad declarada. Se reduce resolución si el renderizado es lento; ante pérdida de contexto o WebGL no disponible se activa Essential. El movimiento se detiene en pestañas ocultas; el renderizador ligero se limita aproximadamente a 30 fps y se reduce aún más con movimiento reducido. El temporizador React sólo actualiza mientras hay una sesión activa. Audio sintetizado y activos locales evitan descargas voluminosas.

## Límites de la revisión disponible

Checkpoint06: tests reales de callbacks/handlers ejecutados con ports/CacheStorage/eventos controlados y metadatos/iconos verificados; no son una instalación o modo avión nativos. El bloqueo de navegador/servidor de este entorno no se eludió. QA visual, teclado, actualización entre dos versiones, cierre/reapertura instalada y caché en dispositivo físico quedan NO VERIFICADOS. Las comprobaciones históricas anteriores no certifican los cambios actuales. No se afirma puntuación Lighthouse ni FPS.

Fuentes técnicas: [W3C Service Workers](https://www.w3.org/TR/service-workers/) — ready/controller, postMessage y Cache; [Cloudflare _headers](https://developers.cloudflare.com/workers/static-assets/headers/) — directivas de hosting excluidas del precache.
