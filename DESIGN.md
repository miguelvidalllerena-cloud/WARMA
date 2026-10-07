# WARMA · Vuelve a tu centro

Sistema visual original · versión 1.0 · 7 de octubre de 2026

Este documento es la referencia de diseño de WARMA. Los cinco análisis del ZIP son una biblioteca de principios, no componentes para copiar. No se redistribuyen sus tipografías, marcas, ilustraciones ni sus DESIGN.md.

## 1. Una presencia que deja espacio

WARMA acompaña al estudiante a **volver a su centro**: reconocer su ritmo, elegir un paso, hacer una pausa y continuar. No mide su valor, no exige productividad permanente y no presenta metáforas visuales como mediciones psicológicas.

La composición tiene un centro de atención, no necesariamente un centro geométrico. Una frase, una pregunta o un gesto ocupa el primer plano. Los controles aparecen donde se necesitan; el entorno retrocede cuando se escribe, se decide o se descansa.

La profundidad viene de la escala, el encuadre, el contraste y las capas. No de una sombra bajo cada elemento. El nudo y el jardín son la firma de WARMA; no una decoración intercambiable por fotografías de otra marca.

Antes de diseñar una pantalla, completar estas tres frases:

| Pantalla | Debe sentir | Debe entender | Acción principal |
| --- | --- | --- | --- |
| Inicio | Hay espacio para comenzar | Puede elegir un paso sin completar un perfil | Elegir mi siguiente paso |
| Camino | El recorrido es posible | Una microacción basta por ahora | Añadir un paso |
| Espejo | Puede mirar con calma | La guía propone preguntas; no diagnostica | Elegir una ruta o continuar una pregunta |
| Bitácora | Sus palabras le pertenecen | El borrador permanece en su dispositivo | Escribir y guardar |
| Respirar | Puede detenerse y salir | La guía es opcional; su ritmo prevalece | Seguir la guía, con salida siempre visible |
| Concentración | Sólo necesita este momento | El tiempo puede pausarse o terminar antes | Comenzar o pausar la sesión |
| Mi jardín | Sus gestos tienen continuidad | No pierde nada por alejarse; no hay ranking | Volver a una acción o una pausa |
| Preferencias | Tiene control | Puede ajustar, proteger y llevar sus datos | Cambiar la preferencia que eligió |
| Autochequeo opcional | Puede negarse sin consecuencias | No es diagnóstico y sus respuestas son locales | Responder una pregunta u omitir |

## 2. Principios aprendidos, identidad propia

| Referencia inspeccionada | Principio incorporado | Expresión propia de WARMA |
| --- | --- | --- |
| Runway | Encuadre amplio, jerarquía editorial, contenido protagonista | Frase breve junto al nudo, sin tarjetas de marketing ni fotografía de producto |
| Linear | Precisión, densidad útil, controles discretos, un acento | Navegación sobria y estados claros; carbón cálido con teal WARMA |
| Claude | Calma y contraste editorial humano | Serif del sistema para contemplar, lenguaje cercano y blanco cálido |
| Apple | Claridad, espacio negativo, pocas decisiones | Una acción principal por estado; detalles secundarios bajo demanda |
| Framer | Transiciones que explican cambios | Aparición breve y desplazamiento pequeño; respiración y crecimiento con propósito |

No copiar colores distintivos, proporciones de landing pages, logotipos, nombres de componentes ni fuentes propietarias. No reunir cinco estéticas. La unidad es WARMA: centro, ritmo, pausa, claridad, respiración, reflexión y crecimiento.

## 3. Paleta semántica

El modo oscuro es la experiencia principal. Las superficies son carbón, no un baño verde. El teal señala una decisión, el foco o la continuidad de una acción. No expresa que una respuesta personal sea buena o mala.

| Token | Valor | Uso |
| --- | --- | --- |
| `--warma-canvas` | `#101211` | Fondo principal, sin negro absoluto obligatorio |
| `--warma-surface` | `#181b19` | Campos y grupos interactivos |
| `--warma-raised` | `#202522` | Diálogos y menús |
| `--warma-ink` | `#f3f1e9` | Títulos y contenido esencial |
| `--warma-text` | `#cccfc9` | Cuerpo y controles secundarios |
| `--warma-muted` | `#a1aaa3` | Ayuda, microcopy y contexto |
| `--warma-line` | `#363e38` | Separadores y bordes de controles |
| `--warma-accent` | `#a1d7c2` | Acción principal, selección y centro |
| `--warma-on-accent` | `#14281f` | Texto sobre el acento |
| `--warma-accent-soft` | `#a1d7c214` | Fondo de una selección |
| `--warma-focus` | `#b8ead6` | Anillo de foco |
| `--warma-warning` | `#e4c391` | Aviso que necesita atención |
| `--warma-error` | `#eab2a7` | Error real, con texto y posibilidad de recuperación |

Los colores de proyectos existentes conservan su función de identificación. No se convierten en colores de marca secundarios. No colorear todo el texto de verde. Los estados `Ligera / Intermedia / Alta` usan el mismo tratamiento neutro; la selección se reconoce también por borde, forma y estado accesible.

Los pares principales del modo oscuro superan 4.5:1 para texto normal. Verificar los colores calculados de cada estado; una opacidad heredada puede destruir el contraste aunque el token aislado sea correcto. Bordes esenciales y focos deben distinguirse del fondo, también sin color.

## 4. Tokens y escala

Fuente de implementación: `app/warma-theme.css`, importada después de las hojas existentes. Esta capa cambia presentación, no las máquinas de estado ni el almacenamiento. Al añadir una vista, usar estos tokens en vez de añadir hexadecimales distintos.

```css
:root {
  --warma-canvas: #101211;
  --warma-surface: #181b19;
  --warma-raised: #202522;
  --warma-ink: #f3f1e9;
  --warma-text: #cccfc9;
  --warma-muted: #a1aaa3;
  --warma-line: #363e38;
  --warma-accent: #a1d7c2;
  --warma-on-accent: #14281f;
  --warma-focus: #b8ead6;
  --warma-space-1: .25rem;
  --warma-space-2: .5rem;
  --warma-space-3: .75rem;
  --warma-space-4: 1rem;
  --warma-space-6: 1.5rem;
  --warma-space-8: 2rem;
  --warma-space-12: 3rem;
  --warma-radius-control: .5rem;
  --warma-radius-surface: 1rem;
  --warma-ease: cubic-bezier(.22, 1, .36, 1);
  --warma-motion-fast: 160ms;
  --warma-motion-enter: 360ms;
}
```

Unidad base: 4 px con raíz estándar; espacios mayores en múltiplos de 8 px. Usar `rem` para que el ajuste de texto de WARMA conserve el ritmo. No fijar la altura de un bloque de lectura ni impedir el zoom.

## 5. Tipografía sin descargas

No hay nuevas solicitudes de fuentes. No se incluyen archivos SF Pro, Copernicus, Styrene, ABC Normal ni otras fuentes de las referencias. Se usan sólo fuentes instaladas en el dispositivo y fallbacks genéricos.

| Familia | Pila | Papel |
| --- | --- | --- |
| Editorial | `Iowan Old Style, Palatino Linotype, Book Antiqua, Georgia, serif` | Frases contemplativas, títulos de vista y preguntas |
| Interfaz | `system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif` | Cuerpo, navegación, formularios, acciones |
| Microdatos | `ui-monospace, SFMono-Regular, Consolas, Liberation Mono, monospace` | Tiempo, numeración de recorrido y referencias técnicas reales |

| Estilo | Mobile | Desktop | Interlineado |
| --- | --- | --- | --- |
| Frase principal | 48–68 px | 72–112 px, fluido | 1.04 |
| Título de vista | 36–44 px | 48–64 px | 1.12 |
| Pregunta | 28–36 px | 36–48 px | 1.2 |
| Subtítulo editorial | 24–28 px | 28–36 px | 1.25 |
| Texto principal | 16 px mínimo | 16–18 px | 1.65–1.75 |
| Control | 14–16 px | 14–16 px | 1.4 |
| Ayuda | 13–14 px | 13–14 px | 1.6 |

Usar peso 400 en serif y 400–600 en interfaz. Tracking de titulares entre −0.02 y −0.045 em, sin comprimir frases largas. Los rótulos de navegación siguen en sans; mono no es la voz de toda la experiencia. Las mayúsculas son breves y no sustituyen títulos legibles.

## 6. Composición y grid

Desktop: contenido máximo 1440 px, margen fluido 32–80 px, navegación lateral estable. Inicio combina una columna editorial y un campo visual más amplio; no fuerza una simetría de dashboard. El nudo conserva su anclaje medido por el componente existente.

Tablet: dos columnas sólo mientras las frases y controles caben sin compresión. Formularios, lectura y onboarding pasan a una columna antes que el contenido se vuelva estrecho.

Mobile: una columna, margen 20–24 px (16 px a 320 px), acción principal a ancho disponible. Navegación existente y `safe-area-inset-*` se conservan. Una escena visual no debe obligar a atravesar una pantalla vacía antes de encontrar el siguiente paso. Su altura se reduce a 320–380 px; no se ocultan herramientas.

Anchuras a revisar: 320, 360, 390, 430, 768, 1024, 1366 y 1920 px. Revisar también altura pequeña, orientación horizontal y zoom 200 %. `minmax(0, 1fr)`, `min-width: 0`, wrap y textos fluidos permiten reflow. Nunca resolver un desbordamiento cortando el contenido esencial.

El texto de lectura tiene un ancho recomendado de 55–70 caracteres. Preferencias separa grupos por espacio y una línea, no por una cuadrícula de tarjetas coloreadas.

## 7. Superficies y componentes

**Superficie base:** carbón continuo. La escena puede tener luz local suave; no hay gradiente detrás de cada sección. **Superficie de interacción:** ligeramente más clara, con borde visible. **Superficie elevada:** reservada para menús, diálogos y confirmaciones. Las sombras se limitan al diálogo sobre contenido; no expresan jerarquía por sí solas.

| Componente | Regla |
| --- | --- |
| Acción principal | Una por estado. Acento claro, texto oscuro, mínimo 48 px de alto; verbo concreto |
| Acción secundaria | Fondo neutro y borde; no compite con la principal |
| Enlace de acción | Texto legible, icono opcional, área táctil de al menos 44 px |
| Icono sin texto | Nombre accesible, foco visible, mínimo 44 × 44 px |
| Campo de texto | Etiqueta persistente, 16 px mínimo en mobile, placeholder como ejemplo y no como única etiqueta |
| Selección personal | Bordes y estado accesible, mismo color para todas las respuestas; sin puntuación visual ni premios |
| Fila de recorrido | Número pequeño, título claro, ayuda breve; separación con línea y espacio |
| Diálogo | Nombre y descripción, foco contenido y regreso al disparador; altura limitada con scroll interno |
| Progreso | Discreto, descriptivo y accesible; no premia respuestas sensibles |
| Mensaje de guardado | Cerca de la acción o toast corto; no proclamar éxito antes de persistir |
| Estado vacío | Explica lo que puede suceder y propone un paso; no simula datos ni progreso |

No cambiar roles, etiquetas, lectura, handlers ni gestión de foco para lograr un efecto visual. El orden visual y el del DOM deben coincidir.

## 8. Estados

- **Reposo:** texto claro, sin halo ni movimiento permanente.
- **Hover:** cambio pequeño de fondo o borde; sólo en dispositivos que pueden hacer hover.
- **Foco:** anillo de 2 px con separación de 4 px; nunca se elimina sin una alternativa visible.
- **Seleccionado:** borde y superficie suave, más `aria-pressed`, `aria-checked` o el estado nativo existente.
- **Guardando:** conserva los datos visibles y evita doble envío. No reemplaza la pantalla por una animación.
- **Error:** explica qué falló y qué se conserva; propone reintentar cuando sea posible. Sin diagnóstico ni alarmismo.
- **Sin conexión:** mensaje factual. Sólo afirmar disponibilidad offline cuando el Service Worker confirme su precache completo.
- **Bloqueado:** el cifrado retira el contenido de las vistas; la estética no cambia esta garantía.
- **No disponible:** explicación breve y otra acción útil. Los detalles legales y técnicos se pueden consultar bajo demanda.

## 9. Navegación y decisiones

Conservar rutas, hash, Back/Forward y accesos directos. Cada pantalla tiene un `h1`; el cambio de región mantiene el foco de contenido del sistema existente. La navegación y la pausa permanecen disponibles sin cubrir el área de escritura o los botones inferiores.

La navegación no es una lista de logros ni un panel empresarial. Las herramientas adicionales quedan en el menú existente. En mobile, no inventar un segundo sistema de rutas.

El onboarding es opcional desde el primer estado. **«Omitir por ahora»** siempre permite entrar sin responder. La omisión guarda únicamente que la bienvenida se cerró; no crea respuestas, consentimiento psicométrico ni resultados. Se puede retomar voluntariamente desde Inicio y Preferencias.

## 10. Autochequeo PSS-10

La UI está integrada en el mismo sistema: una pregunta por pantalla, espacio suficiente, respuesta mediante controles accesibles, progreso pequeño, atrás, omisión y salida. No hay colores de respuesta buena/mala ni recompensas por completar.

Antes de responder, explicar voluntariedad, periodo de referencia, almacenamiento local y que no es diagnóstico. Mostrar instrucciones e ítems únicamente si se ha documentado y verificado la versión autorizada. No sustituirlos por una traducción propia.

El resultado describe el registro, no clasifica al estudiante. No usar categorías de estrés clínico ni umbrales diagnósticos. Proponer elegir un paso, respirar o escribir, sin prescribir tratamiento. Repetir es una decisión explícita; los registros pueden borrarse. El cifrado opt-in ya existente protege el estado completo.

`PSS10_ENABLED` permanece **false** mientras falten texto autorizado y permisos verificables. El ZIP de diseño no es una licencia de la escala. Las pruebas con fixtures sintéticos comprueban el mecanismo; no certifican una administración real ni el acceso a la red en un dispositivo.

## 11. Motion: dar forma al ritmo

| Situación | Movimiento | Límite |
| --- | --- | --- |
| Cambio de región | Aparición y desplazamiento vertical pequeño | 360 ms, máximo 8 px |
| Control | Cambio de fondo, borde o color | 160 ms; sin salto de layout |
| Pregunta nueva | Entrada breve y foco en el encabezado | Sin retrasar teclado ni exigir terminar la animación |
| Respiración | Guía existente de expansión y contracción | Sólo durante la pausa, detención y salida disponibles |
| Claridad o jardín | Transición del estado después de una acción real | Sin rachas, castigos, parpadeos ni confeti |
| Reduced motion | Estado final inmediato | Sin desplazamiento, loops ni respiración visual forzada |

No scroll hijacking, parallax, cursores de seguimiento, blur animado de pantalla completa ni videos externos de autoplay. No añadir un nuevo loop al nudo. Conservar calidad automática y fallback Esencial. Las animaciones decorativas no modifican timers ni eventos de actividad.

`prefers-reduced-motion` y la preferencia de WARMA son equivalentes para la presentación. La animación se retira también de los diálogos portados fuera del contenedor principal. El tiempo y los controles siguen funcionando.

## 12. Accesibilidad y rendimiento

Contraste AA; foco visible; objetivos táctiles ≥44 px; texto escalable; navegación con Tab, Shift+Tab, flechas en radios y Enter/Espacio en acciones. Los errores, guardados y cambios importantes se anuncian con los mecanismos accesibles existentes, sin convertir cada tick del temporizador en un anuncio.

Los mensajes esenciales existen como texto, no sólo en canvas, color, posición o iconos. Mantener las metáforas etiquetadas. El jardín no revela el contenido privado de la Bitácora. La PSS-10 no es una prueba de crisis y no infiere riesgo a partir de un puntaje.

Sin nuevas fuentes, librerías de motion, videos ni trackers. Preferir CSS y los componentes actuales. No aumentar carga de GPU para compensar una composición débil. Medir el build y verificar visualmente; no llamar Lighthouse a una estimación del tamaño de los archivos.

## 13. Light mode

No se incorpora un toggle de tema en este release. El oscuro es una decisión coherente y el sistema actual no tiene un tema claro completo probado. Las superficies cálidas no requieren convertir toda la app a beige.

Si un contexto de lectura diurna demuestra la necesidad, implementar y probar un tema claro completo: fondo `#f3f1e9`, superficie `#e9e8df`, tinta `#1c2420`, cuerpo `#3d4840`, ayuda `#56635a`, acento `#28634f`, texto del botón `#ffffff`. No activar un tema parcial con campos, diálogos o gráficos ilegibles. Estos valores son una dirección futura, no una funcionalidad publicada.

## 14. Do / Don't

| Sí | No |
| --- | --- |
| Una frase y una acción claras | Cinco llamadas principales simultáneas |
| Nudo y jardín como identidad | Recursos prestados para aparentar otra marca |
| Teal para decisiones y continuidad | Verde en todas las superficies o valoración de respuestas |
| Serif para contemplar, sans para actuar | Mono en todo el texto o fuentes propietarias distribuidas |
| Separar grupos con aire y líneas | Tarjetas, sombras y gradientes repetidos |
| Explicar privacidad de manera breve | Jargon clínico o legal que sustituye la acción del estudiante |
| Detalles científicos bajo demanda | Presentar baremos no documentados o datos de investigación como perfil individual |
| Movimiento con propósito y salida | Loops, animaciones de premio o scroll obligatorio |
| Estados vacíos honestos | Métricas, testimonios y progresos inventados |

## 15. Ejemplos

**Inicio:** una frase grande «Vuelve a tu centro.», dos líneas de ayuda, check-in neutro opcional y «Elegir mi siguiente paso». El nudo tiene espacio propio y una explicación corta. Los accesos a pausar, organizar y escribir son secundarios.

**Bitácora:** título editorial y área amplia de escritura. Los controles de etiquetas, cápsula y guardado aparecen junto al contenido; la privacidad no se expresa con un candado que prometa cifrado antes de activarlo.

**Autochequeo:** «Un momento para observarte». Explicación breve, «Comenzar» cuando esté autorizado y «Omitir por ahora». Una pregunta con cinco opciones neutrales; progreso pequeño. En el resultado: «Tu registro refleja cómo percibiste determinadas situaciones durante el periodo consultado. No es un diagnóstico». Después, una invitación a elegir cómo continuar.

**Error de guardado:** mantener las respuestas y mostrar «No se pudo guardar. Tus cambios siguen en esta pantalla; puedes reintentar». No usar un resultado de éxito si la escritura local falló.

## 16. Límites del cambio

No sustituir routing, IndexedDB, criptografía, Service Worker, scoring, feature flags, timers, endpoint de Espejo ni fallbacks mediante CSS o rediseño. La corrección PWA previa se limita al empaquetado de recursos y la configuración de assets Cloudflare. Las adiciones al onboarding utilizan las transacciones locales existentes y conservan snapshots antiguos mediante valores por defecto.

El release requiere build, tests y QA real, con evidencias separadas de lo pendiente. Este documento describe el sistema y su implementación; no declara por sí solo que la app esté certificada, que la escala esté autorizada ni que producción haya sido publicada.
