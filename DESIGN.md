# WARMA · Vuelve a tu centro

Sistema implementado · Centro 2.0 · 7 de octubre de 2026

WARMA es un espacio personal para estudiantes. Su secuencia es llegar, reconocer, reducir ruido, elegir, actuar, reflexionar y volver al centro. El nudo representa una metáfora visual: no mide ni interpreta la salud mental. Este documento describe la implementación de `app/warma-theme.css` y de los componentes existentes, no un mockup.

## Principios y referencias

Se inspeccionó la copia adjunta `awesome-design-md-main (1)(2).zip` y se leyeron completos `design-md/runwayml/DESIGN.md`, `design-md/linear.app/DESIGN.md`, `design-md/claude/DESIGN.md`, `design-md/apple/DESIGN.md` y `design-md/framer/DESIGN.md`. Son referencias de principios. Ninguno de sus archivos, marcas, fotografías, fuentes o componentes se redistribuye en WARMA.

| Principio estudiado | Decisión de WARMA |
| --- | --- |
| Runway: contenido visual protagonista, escala y encuadre | Un campo visual continuo para el nudo, con frase editorial arriba y una acción abajo |
| Linear: precisión y controles discretos | Wayfinder lateral flotante, activo sutil y un único acento dominante |
| Claude: humanidad y contraste editorial | Serif del dispositivo para contemplar; sans para actuar; lenguaje sereno |
| Apple: claridad y espacio negativo | Una acción principal por estado; opciones adicionales bajo demanda |
| Framer: composición y transición con intención | Entradas finitas, selección discreta y paisaje que aparece sin confeti |

La síntesis es propia: carbón verdoso, blanco cálido y teal WARMA. No reproducir la landing page de una referencia. La escala, el encuadre y la separación del contenido crean profundidad; no una sombra detrás de cada bloque.

## Lo que cada pantalla debe aportar

| Pantalla | Sentir | Entender | Acción principal |
| --- | --- | --- | --- |
| Inicio | Hay espacio para llegar | No tiene que resolverlo todo ahora | Elegir mi siguiente paso |
| Camino | Un paso es posible | Las acciones y las pausas forman un recorrido | Añadir o elegir un paso |
| Espejo | Puede mirar con calma | Son preguntas locales, no diagnóstico | Elegir una ruta y responder u omitir |
| Bitácora | Sus palabras le pertenecen | El borrador queda en su dispositivo | Escribir y guardar |
| Respirar | Puede parar y salir | La guía es opcional y no debe forzarla | Seguir o pausar la guía |
| Concentración | Este espacio le pertenece | Puede pausar o terminar antes | Empezar o pausar una sesión |
| Mi jardín | Sus gestos tienen continuidad | No pierde progreso por alejarse | Regresar a su camino |
| Preferencias | Tiene control | Puede ajustar, proteger y llevar sus datos | Modificar la preferencia elegida |

## Paleta semántica y tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--warma-canvas` | `#101211` | Fondo continuo |
| `--warma-surface` | `#181b19` | Campos y superficies de interacción |
| `--warma-raised` | `#202522` | Menús y diálogos |
| `--warma-ink` | `#f3f1e9` | Titulares y contenido principal |
| `--warma-text` | `#cccfc9` | Cuerpo y controles |
| `--warma-muted` | `#a1aaa3` | Ayuda y contexto |
| `--warma-line` | `#363e38` | Separación discreta, no borde esencial de un campo |
| `--input` | `#69766c` | Borde de campos |
| `--warma-accent` | `#a1d7c2` | Acción principal y selección |
| `--warma-on-accent` | `#14281f` | Texto sobre el acento |
| `--warma-accent-soft` | `#a1d7c214` | Fondo de selección |
| `--warma-focus` | `#b8ead6` | Foco de teclado |
| `--warma-warning` | `#e4c391` | Aviso factual |
| `--warma-error` | `#eab2a7` | Error o borrado, siempre con texto |

`--warma-space-{1,2,3,4,6,8,12}` define .25, .5, .75, 1, 1.5, 2 y 3 rem. Controles: radio .5 rem. Superficie elevada: 1 rem. `--warma-ease: cubic-bezier(.22,1,.36,1)`, `--warma-motion-fast: 160ms`, `--warma-motion-enter: 640ms`.

Los colores principales de texto tienen contraste superior a 4.5:1 sobre las superficies indicadas. Esto no certifica todos los estados de todos los componentes: se debe comprobar el color calculado, la opacidad y el fondo efectivos. Las respuestas personales no usan rojo/verde ni categorías de bueno/malo. Colores existentes de proyectos y arte conservan su función; no son nuevos acentos de la marca.

## Tipografía

No se descargan ni empaquetan fuentes nuevas.

- Display: `'Iowan Old Style','Palatino Linotype','Book Antiqua',Georgia,serif`.
- Interfaz y lectura: `system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`.
- Microdatos reales: `ui-monospace,'SFMono-Regular',Consolas,'Liberation Mono',monospace`.

La serif diferencia contemplación de operación. Los controles permanecen en sans. Mono se reserva para semillas y referencias reales; el tiempo de Concentración usa sans con cifras tabulares.

| Uso implementado | Desktop | Mobile |
| --- | --- | --- |
| Inicio, «Vuelve a» | `clamp(3.75rem,6.7vw,6.5rem)` | `clamp(2.75rem,12vw,3.5rem)` |
| Inicio, «tu centro.» | `clamp(6.75rem,12vw,11rem)` | `clamp(4rem,18.5vw,5rem)`; 3.9 rem bajo 360 px |
| Título de vista | `clamp(3rem,5.2vw,5rem)` | `clamp(2.5rem,11vw,3.5rem)` |
| Bitácora, título editable | `clamp(2rem,3.2vw,3rem)` | 2 rem |
| Bitácora, lectura/escritura | 1.125 rem / 1.85 | 1 rem / 1.85 |
| Respirar, indicación | `clamp(3rem,6vw,5rem)` | 3.25 rem; 2.75 rem bajo 360 px |
| Tiempo numérico voluntario | `clamp(4rem,9vw,8rem)` | 4.75 rem |

Titulares con peso 400 y tracking entre −.025 y −.055 em. No usar tracking compacto en párrafos. No fijar altura de lectura ni recortar frases largas.

## Composición, grid y spacing

Inicio ya no es texto a la izquierda con objeto a la derecha. `home-arrival` es una escena continua: frase asimétrica de gran escala, nudo debajo y una acción en el límite inferior. La autopercepción y las entradas secundarias están después de la llegada, en `home-reflection` y `home-journeys`.

Desktop: wayfinder de 52 px separado 18 px del borde; contenido desplazado 88 px. Topbar de 72 px. Vistas con máximo 1260–1320 px y márgenes fluidos de 28–80 px. Separación de grupos de 40–96 px. Las columnas usan `minmax(0,1fr)`, no anchuras mínimas que rompan el reflow.

Inicio: escena de 1100 × 650 px medida por el anclaje existente del canvas. No se modifica el renderer ni el significado de la carga percibida. Tablet reduce la escena a 900 px y el margen a 32 px. Mobile la recompone a 500 × 430 px, y 430 × 340 px bajo 360 px. El encuadre decorativo puede exceder el ancho del documento; las acciones y el texto deben caber completos.

El hero mobile mide `100svh - 140px`, mínimo 540 px y máximo 750 px. La portada deja espacio para el dock. No hay scroll hijacking. Contenido secundario sigue accesible por scroll normal.

Camino combina un recorrido vertical alternado y un espacio para el paso seleccionado. Los pares acción/pausa se conectan mediante una línea fina y marcadores; no tarjetas de tareas. En mobile ambos espacios se apilan en secuencia.

Bitácora tiene un índice de 180 px y una hoja de escritura de hasta 790 px; en mobile la escritura aparece antes del índice. La hoja usa `#171b18` y radio 2 px, sin vidrio ni sombra. Etiquetas y cápsula del tiempo están en un `details` nativo. Modo Zen mantiene el mecanismo existente.

Concentración dispone el umbral editorial y la preparación en dos columnas; mobile las apila. Al comenzar, el modo Zen conserva un campo central, cifra opcional y dos acciones. No se cambian duración, reloj ni persistencia.

Mi jardín es un paisaje ancho: canvas de 570 px, texto y cristales en sus márgenes inferiores; los registros siguen en una línea discreta debajo. Mobile usa canvas de 330 px y lleva texto y cristales al flujo del documento. No se simula crecimiento: ramas y registros proceden de las acciones reales ya almacenadas.

Preferencias agrupa Tu espacio, Experiencia, Accesibilidad, Notificaciones, Privacidad, Datos y PWA. La documentación está bajo demanda. No ocultar restauración, protección ni borrado.

## Superficies y componentes

| Componente | Tratamiento y comportamiento |
| --- | --- |
| Acción principal | Teal claro, texto oscuro, mínimo 48 px de altura; Inicio 56 px, mobile 52 px |
| Acción secundaria | Transparente con borde o enlace; contraste suficiente |
| Navegación lateral | Icono, nombre accesible y tooltip; activo con superficie tenue y marca de 3 px |
| Navegación mobile | Dock flotante de 64 px, targets de al menos 44 × 48 px y safe area |
| Carga percibida | Tres opciones neutras con formas y subrayado; `aria-pressed` conserva selección |
| Campo | Etiqueta persistente, borde de campo visible; placeholder sólo como ayuda |
| Opciones adicionales | `details/summary` nativo con foco y teclado; no un menú inventado |
| Diálogo | Semántica, foco contenido y devolución de foco del componente existente |
| Respirar | Diálogo casi completo: ventana menos 48 px en desktop y menos 16 px en mobile |
| Aviso de persistencia | Sólo confirma éxito después de la operación existente |
| Estado vacío | Explica una posibilidad; no añade datos ni logros ficticios |

Hover sólo donde es posible; feedback pequeño de color y fondo. Selected añade forma y estado accesible. Disabled conserva el motivo existente. Error explica qué ocurrió; el rojo no clasifica al estudiante. Guardando evita doble envío. Offline preparado sólo se afirma con confirmación del Service Worker existente. Cifrado bloqueado retira el contenido como antes.

## Navegación y accesibilidad

Se conservan rutas, hash, Back/Forward, acceso directo, enlaces y el foco principal del sistema recuperado. No cambia la máquina de navegación. Los iconos conservan nombres accesibles; el menú mobile mantiene todas las herramientas.

Foco visible: 2 px, offset 4 px, color `--warma-focus`. Se incluyen botones, enlaces, campos, `summary` y selecciones. No retirar etiquetas ni roles para ganar espacio. El orden de lectura sigue la secuencia del contenido; mobile usa el orden de escritura primero sin duplicar campos. La navegación deja espacio inferior a las acciones.

Revisar 320, 360, 390 y 430 px con layout real. `public/docs/visual-check.html` es una página de QA que muestra WARMA en iframes con estos anchos reales y altura 844 px. No sustituye un teléfono físico, su teclado virtual o una prueba con lector de pantalla. No inspecciona almacenamiento ni captura respuestas.

Usar lectores de pantalla y zoom 200 % como pruebas de dispositivo pendientes cuando no estén disponibles; no convertir un snapshot semántico en una certificación WCAG.

## Motion y reduced motion

| Momento | Implementación |
| --- | --- |
| Entrada de región | `space-arrive`: 640 ms, opacidad y 12 px; una vez |
| Llegada del nudo | `knot-arrive`: 1300 ms, 18 px y escala .96 a 1; una vez |
| Elección de carga | `choice-arrive`: subrayado de 240 ms |
| Paisaje del jardín | `garden-arrive`: 900 ms, opacidad y 10 px; una vez |
| Controles | 160 ms para color/fondo; 220 ms para transformación pequeña |
| Respirar | La guía conserva sus ciclos, temporizador, pausa y salida; no se añade un reloj nuevo |

No se añaden partículas, parallax, nuevos loops RAF ni animaciones de recompensa. La animación del mundo conserva la adaptación y fallback existentes.

`prefers-reduced-motion: reduce` y la preferencia local `.warma.reduced` desactivan animación y transición. También cubren diálogos portaled, pseudo-elementos y scroll. La guía conserva texto y controles con geometría quieta; el indicador de fase no deja de funcionar. No desactivar funcionalidades ni feedback textual.

## Dark mode y light mode

Dark mode está implementado y es la identidad principal. Light mode **NO IMPLEMENTADO**: no hay toggle ornamental ni una inversión automática que se presente como diseño terminado. Tampoco se implementan nuevas fuentes, un renderer diferente o un sistema alternativo de rutas.

## PSS-10 y privacidad

`PSS10_ENABLED=false`. El onboarding y la omisión existentes siguen disponibles. La biblioteca de diseño no autoriza una escala. Sin versión documental autorizada y permisos verificables no se muestran ítems reales ni se activa el flag.

La infraestructura de scoring y almacenamiento existente tiene tests con fixtures, no evidencia de administración de la escala ni autorización documental. No se inventan traducciones, documentos, resultados clínicos ni umbrales. No usar las respuestas para publicidad, analytics, clasificación o rankings.

`AI_REMOTE_ENABLED=false` y `CLOUD_SYNC_ENABLED=false` se conservan. Bitácora, borradores, preferencias y autopercepción usan la persistencia local existente. Los controles de cifrado opt-in y respaldo conservan sus callbacks y garantías.

## Do / don't y ejemplos

| Hacer | Evitar |
| --- | --- |
| Una acción destacada: «Elegir mi siguiente paso» | Cinco botones principales alrededor del nudo |
| «No tienes que resolverlo todo ahora.» | Presión para completar cuestionarios o mantener rachas |
| Una hoja para escribir; «Más opciones» | Etiquetas, cápsula, búsqueda y herramientas con igual peso |
| «Puedes salir cuando quieras.» | Una respiración obligatoria o una estética médica |
| Un paisaje que crece con gestos reales | Rankings, simulación de logros o castigo por inactividad |
| Contraste tonal y encuadre | Bordes en cada grupo, neón, vidrio y sombras repetidas |
| Reflow y controles completos a 320 px | Recortar texto esencial para ocultar overflow |
| Tipografía instalada en el dispositivo | Fuentes propietarias copiadas del ZIP |

Ejemplo de llegada implementado:

```tsx
<h1><span className="arrival-line">Vuelve a</span>
<span className="arrival-center">tu <em>centro.</em></span></h1>
```

Ejemplo de opciones de escritura implementado: `details.journal-options` con `summary` «Más opciones»; la acción «Guardar mi reflexión» queda fuera y siempre visible.

Ejemplo de privacidad: Preferencias explica almacenamiento local y protección opcional antes de `LocalProtectionControls`; exportar y restaurar permanecen en Datos.

## Concordancia con el código

| Regla | Estado | Implementación |
| --- | --- | --- |
| Home como escena, una acción inicial | IMPLEMENTADA | `warma-home.tsx`, `home-arrival` |
| Nudo protagonista sin interpretación clínica | IMPLEMENTADA | Anclaje de canvas existente, frase visible y encuadre nuevo |
| Navegación compacta | IMPLEMENTADA | `nav-rail`, `rail-button`, `mobile-nav`; semántica existente |
| Display, UI y paleta coherentes | IMPLEMENTADA | Tokens y reglas de `warma-theme.css` |
| Camino como recorrido | IMPLEMENTADA | `path-terrain`, `path-tiles`, `path-selection` |
| Bitácora como hoja privada | IMPLEMENTADA | `journal.tsx`, `writing-space`, opciones nativas |
| Respirar como pausa inmersiva | IMPLEMENTADA | `breathing-room`, `breath-options` |
| Concentración casi sin interfaz | IMPLEMENTADA | Setup editorial y `focus-center` en Zen |
| Jardín como paisaje | IMPLEMENTADA | `garden-stage`, captions en el flujo mobile |
| Preferencias por grupos | IMPLEMENTADA | `settings.tsx` |
| Recompuesta mobile | IMPLEMENTADA | Breakpoints 1050, 767 y 359 px y altura 720 px |
| Entradas finitas y reduced motion | IMPLEMENTADA | Keyframes, `.reduced` y media query |
| Modo claro | NO IMPLEMENTADA | Fuera de esta versión |
| PSS-10 documental y activación | NO IMPLEMENTADA | Gate cerrado; documentación autorizada pendiente |
| Certificación física mobile, lector de pantalla y desconexión real | NO VERIFICADA | Se distingue del QA de Chrome y de preparación offline |

La evidencia de regresión y las capturas de la preview de Cloudflare se entregan por separado, vinculadas a su commit. Un build que pasa no demuestra por sí solo calidad visual ni certifica las pruebas no observadas.
