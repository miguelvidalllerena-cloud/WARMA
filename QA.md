## Release candidate — 2026-10-05

Cierre funcional `d51f709`; base `340c515` intacta. Flags centralizadas false; AI_REMOTE_ENABLED sustituye al antiguo WARMA_AI_ENABLED (inactivo). PSS conserva permisos/scoring; fallback explícito a check-in; texto de cifrado opcional corregido. Clean install y build PASS. RELEASE GATE FAIL por QA nativa no disponible, no por un fallo P0/P1 reproducido. Leer RELEASE-STATUS.md, WARMA-VISUAL-HANDOFF.md y qa/release-candidate.json. No publicar ni iniciar rediseño hasta resolver la QA. Artefacto: warma-lambayeque-v2-release-candidate.zip, SERVER con bundle y build.

## Cierre integral · checkpoint 07 · 2026-10-05

Commit probado `16a1bd527d1da3cbca85a09540fd004e9156dd3b`; implementación base174ff12. Registro `qa/lambayeque-v2-final.json`: **23 comprobaciones + build/prepare-pwa PASS**, 25 comandos registrados con exit0. Incluye checker de presupuesto/boundary sobre build real y precache28 rutas. Gzip JS 269173, CSS 253951, cliente 1287370 bytes en disco, dentro de límites. No datos/secretos/ítems protegidos; fuentes/detalles de alcance en JURY-EVIDENCE. Sin dependencia nueva/producción/nube/modelo llamado.

Native responsive/teclado/axe/lector/console/IDB/durabilidad/audio/GPU/PWA/HTTP/provider siguen **NO VERIFICADOS**, no FAIL inventado. La QA siguiente está en TEST-MASTER-CHECKPOINT (nueve resoluciones y todos los módulos). Documentación pública corregida, historial etiquetado; no se reutilizan capturas antiguas como prueba actual. No errores críticos abiertos reproducidos en este alcance; no promesa de cero bugs o eficacia. No se reintentó bloqueo del entorno.

## Offline · checkpoint 06

`qa/lambayeque-v2-offline.json`: **22 comprobaciones + build/prepare-pwa PASS**. Reproducción previa registrada: registro/ready marcaba true sin caches. Nuevo helper/root effect probado con controller/ports/eventos deterministas: no controller, timeout, dev/version incorrecta, parcial, cambio de controller, mensajes tardíos, salida y update offline. SW VM ampliado: precache completo/incompleto, MIME/HTML inválido, referencias a otra versión, install fallido sin skipWaiting, source/port, nav/fallback/503, cache quota/unavailable, root/RSC/API/external excluidos. Manifest/PNG sizes y offline fallback locales verificados. Build excluye directivas y metadata interna del precache.

**NO VERIFICADO** por entorno: instalación/offline/evicción/update/browser reales, responsive/teclado/axe, IDB crash/durabilidad, sonido/GPU, modelo/HTTP/cuota cloud. Sin reintentos de navegador/Wrangler ni producción. Tests controlados no son certificación. Fuentes oficiales y diseño en public/docs/PWA.

## Espejo · checkpoint 05

`qa/lambayeque-v2-mirror.json`: suite ampliada a veinte comprobaciones más build/prepare-pwa. Nuevos scripts mirror y mirror-ui: handlers/cliente/adaptadores reales con fetch sintético, consentimiento/rechazo de campos/origen/cuota, endpoints/DTO de proveedores, no-store, límites/JSON/filtro, reintento sólo 429, cancelación/deadline y fallback; hooks reales verifican texto revisado congelado, doble evento, cancelación/unmount y guía local sin configuración. Route GET se ejecuta directamente con env vacío y el build clasifica /api/espejo como API dinámica.

**NO VERIFICADO**: petición HTTP real del Worker, proveedor/modelo, políticas efectivamente contratadas, límite cloud operativo, calidad semántica/safety real, modal/teclado. API inactiva, sin claves/binding/protocolo configurados y sin llamadas/gastos externos. No equivale a IA real ya validada. Scan del bundle cliente busca módulos/secretos/prompt server; resultados en el registro. Preserva dominios PSS y crypto.

## Flujos críticos · checkpoint 04

`qa/lambayeque-v2-critical-flows.json` amplía la suite a dieciocho comprobaciones más build y prepare-pwa. Los nuevos scripts ejecutan efectos reales con relojes/hooks y AudioContext deterministas. Se reprodujeron antes de corregir: contexto seguía running al silenciar, activación tardía/indicador desincronizado, dos contextos en doble clic y guardado de sesión anterior que marcaba una pausa nueva. Corrigidos con suspensión, generación/ref y estado de API.

PASS: una sola instancia por doble activación, mute/salida/pagehide, resume cancelado, cleanup ocultar/desmontar; Respirar un intervalo, pausa/reanudación, excluir tiempo oculto, completar una sola vez, nueva sesión y salida temprana sin inventar un minuto. Concentración vuelve a pasar duración/valores inválidos y límites. Estos resultados no son audio real, responsive/teclado ni consola del navegador; las limitaciones nativas anteriores siguen pendientes. No se declara certificación.

## Seguridad local · checkpoint 03

Base master `567955b`; incrementos `aac654f` y `69cd30f`; cierre funcional indicado en WORK-HANDOFF. Suite completa en `qa/lambayeque-v2-security.json`: dieciséis comprobaciones (tipos, catorce scripts de dominio/flujo y SW), build cliente/RSC/SSR y preparación precache. Criptografía ejecutada con Web Crypto nativo de Node; persistencia con adaptador IDB serial determinista, UI con callbacks/hooks controlados. No se mezclan con pruebas de navegador.

| Prueba | Resultado / evidencia | Límite |
| --- | --- | --- |
| AES-GCM, derivación, metadatos y tag | PASS · verify-crypto | Web Crypto nativo Node; no revisión criptográfica independiente |
| Unicode, vacío, 2 MB, IV y ciphertext distintos | PASS · verify-crypto | No latencia de dispositivo |
| Clave incorrecta, manipulación/tag, formato/versión/tamaño | PASS · verify-crypto | Un registro antiguo auténtico puede reponerse; no antirrollback |
| Legacy, preparar sin escribir, confirmaciones y migración | PASS · verify-vault-persistence | Datos sintéticos, no migración de estudiantes |
| Cuota/rollback, respaldo obsoleto y concurrencia CAS | PASS · verify-vault-persistence | Adaptador serial; locking/crash nativos pendientes |
| Cierre lógico/reapertura, pérdida de clave y restauración | PASS · verify-vault-persistence | Sin recuperación de frase perdida; sin cierre físico del navegador |
| Exportar protegido / importar legacy y ciphertext | PASS · verify-vault-persistence | Descarga física y dos dispositivos pendientes |
| Gate retira vistas, confirmaciones y dobles eventos | PASS · verify-vault-ui | No eventos reales de teclado/lector de pantalla |
| Regresiones onboarding/PSS/router/duración/copy/PWA | PASS · suite existente | Mantiene alcance de fixtures y comprobaciones anteriores |

No hay FAIL crítico conocido en estas pruebas. Sigue **NO VALIDADO POR LIMITACIÓN DEL ENTORNO**: QA visual/teclado/IndexedDB nativo/audio/instalación/offline/GPU. No se ha reintentado el navegador bloqueado ni se ha publicado. Prueba manual nueva prioritaria: activar sobre una copia sintética, conservar archivo/frase, recargar/desbloquear, mutar/refrescar en dos pestañas, cerrar durante guardado y restaurar. El código de cifrado no depende de PSS ni habilita su administración.

```sh
node scripts/verify-all.mjs qa/lambayeque-v2-security.json
```

Los resultados anteriores a este encabezado se conservan como historia del checkpoint PSS. La protección actual es opt-in; el riesgo de legacy legible permanece hasta activación explícita. SECURITY.md describe mitigaciones.

# WARMA · QA de Lambayeque V2

Fecha: 2026-10-04. PSS-10 continúa desde `06d11d6` (bloque 02 previo: `91ed155`), con Fase 1 (`53adce3`) protegida. Sin publicación ni merge. Resultados actuales en `qa/lambayeque-v2-pss10.json`; bloque 02 conservado en `qa/lambayeque-v2-block-02.json`; registro del bloque anterior conservado en `qa/lambayeque-v2-checkpoint.json`.

## Validado

| Prueba | Entorno | Resultado | Evidencia y alcance |
| --- | --- | --- | --- |
| Compilación | vinext / Vite, cliente, RSC y SSR | PASS | `npm run build` terminó con código 0; cliente/RSC/SSR completos después de las últimas modificaciones. |
| Tipos | TypeScript | PASS | `tsc --noEmit`. |
| Compatibilidad | Snapshots y Zod en Node | PASS | Respaldo sin campos nuevos, seed, proyectos, Bitácora y borrador conservados; exportación/importación lógica JSON. |
| Onboarding | Modelo, callbacks y árbol React con hooks controlados | PASS | 96 combinaciones de preferencias, omisión, usuarios con datos previos, consentimiento denegado, doble envío y fallo de almacenamiento. Controles de privacidad y mapeo de opciones. No equivale a prueba DOM/navegador. |
| Instrumentos | Catálogo | PASS | Los seis están bloqueados; sin ítems, resultados personales ni baremos. Metadatos y referencias primarias. |
| Concentración | Callback del componente | PASS | Duración visible, propuesta preseleccionada y guardas; vacío, 0, negativo, decimal y >180 no inician sesión. |
| Historial | Callbacks con History simulado | PASS | Inicio ↔ Camino/Espejo/Bitácora/jardín, Atrás, Adelante, raíz, hash directo y recarga lógica. |
| Texto | Helpers y vistas | PASS | Singular/plural, rótulos de calidad y encabezados heredados. |
| Caché | Service Worker ejecutado en VM | PASS | Instalación, activación, nav online/offline simulada, activos, exclusión privada y readiness. Precache de build: 30 rutas existentes. |
| Corrección de referencia | `verify-psychometrics.mjs` | PASS | Extremos 14/70, total 42, vector mixto 40 y 70 variaciones; inversión/mean sintéticos, faltantes, decimales, claves/versiones ajenas y bloqueos de repositorio/importación. No test autorizado ni resultado de un estudiante. |
| Reanudación / persistencia | `verify-onboarding-flow.mjs` | PASS | Callbacks reales y maquinaria `initWorld`/`mutateWorld` con adaptador IDB determinista; guardado, recarga de módulo, privacidad reafirmada, Back, doble evento, fallo con datos conservados, descarte sólo del borrador y cola de escrituras. No reemplaza motor IDB nativo. |
| Motion de bienvenida | `verify-onboarding-motion.mjs` | PASS | Renderer Canvas real con contexto sintético: coordenadas finitas, carga afecta geometría, DPR máximo 1.35, reduced motion sin RAF, pestaña oculta, limpieza de observer/listeners y contexto ausente. No prueba de GPU ni de composición. |
| Responsive / teclado en fuente | Árbol React y restricciones CSS | PARCIAL | Nombres, botones nativos, heading enfocables, progreso, Radix Dialog/RadioGroup y fórmulas de layout a cuatro anchuras. No eventos físicos Tab/Enter ni inspección de píxeles. |
| Geometría / temporizador | Modelo en Node | PASS | Nudo cerrado con posiciones/normales finitas y conservación del temporizador pausado. No es medición de GPU. |

Build y **trece comprobaciones automáticas** PASS en el bloque PSS-10; diez comprobaciones del checkpoint 02 conservadas. No se añadieron dependencias ni se alteraron los respaldos del usuario. No se reabrió navegador ni se reintentó Wrangler durante el bloque 02; las limitaciones descritas abajo son las ya registradas.

## PSS-10 verificado en este bloque

| Prueba | Evidencia | Resultado y alcance |
| --- | --- | --- |
| Scoring oficial | `verify-pss10.mjs` | PASS: 0/40, inversión, 50 variaciones, 121 patrones, hasta dos faltantes prorrateados, múltiples y casos inválidos. No redondeo en cálculo ni categorías. |
| Persistencia | `verify-pss10-persistence.mjs` | PASS: callbacks/transacciones reales con adaptador IDB; reanudación, respuesta 0, rollback, duplicados, conservación, roundtrip y total alterado. Autoriza sólo una fixture de test; no administra el instrumento. |
| Interfaz | `verify-pss10-ui.mjs` | PASS: componente real con hooks controlados, bloqueo de recogida incluso con contenido sintético suministrado, consentimiento, cero, omisión y mínimo ocho. No DOM/teclado real. |
| Material protegido | Inspección privada del paquete y búsqueda de sus diez ítems completos en fuente/build | PASS: ninguno incorporado, originales fuera de Git/ZIP; no se imprimen preguntas en el reporte. No es autorización de uso. |
| Derechos / población | INSTRUMENT-PERMISSIONS y PSYCHOMETRICS | PENDING_PERMISSION: falta acuerdo y protocolo. Spain/Spanish no se presenta como validación peruana. |

## No validado por limitación del entorno

| Pendiente | Resolución / entorno | Limitación observada |
| --- | --- | --- |
| Arranque del Worker local / smoke HTTP | `npm run start`, Wrangler 4.92.0 | `uv_interface_addresses returned Unknown system error 1`. El servidor no llegó a escuchar; no es evidencia de un fallo funcional de WARMA. |
| Composición de onboarding y recorrido completo | 390×844, 768×1024, 1366×768, 1920×1080 | Navegador de Work previamente bloqueado por política. No se reintentó por otra superficie. |
| Teclado y lector de pantalla | Tab, Shift+Tab, Enter, Space; axe | Semántica revisada y controles probados como componentes; falta interacción real y auditoría DOM. |
| Respirar / AudioContext / cambio de pestaña | Navegador real | Falta ciclo iniciar–pausar–reanudar–audio–salir–volver y comprobar limpieza/timers. |
| Offline / instalación / actualización | HTTPS, dispositivo físico | La VM de caché no prueba service worker real, instalación standalone ni modo avión. |
| Persistencia nativa / concurrencia | IndexedDB y dos pestañas | Las pruebas de snapshot/transacción de callback no prueban el motor nativo. |
| GPU y rendimiento | Essential / Balanced / Immersive | Sin prueba nueva de GPU, CPU, FPS, memoria, Core Web Vitals ni Lighthouse. |
| Nube y generación remota | No implementados en ese checkpoint | Trabajo futuro condicionado; cifrado implementado posteriormente en checkpoint 03. |

Fase 1 dejó evidencia manual parcial de historial/recarga y responsive. No se reutiliza esa evidencia para declarar visualmente aprobada la nueva bienvenida. `public/docs/QA.md` corresponde a una revisión histórica de ÍTACA.

## Registro de terminal

- ERROR de entorno: Wrangler no pudo consultar interfaces de red. No se cambió código de aplicación para sortearlo.
- WARNING de herramientas: configuración `http-proxy` de npm y detección de proxy de Wrangler/Vite. El build termina correctamente.
- INFORMACIÓN de vinext: clasificación estática desconocida para `/` en su versión beta; no equivale a error de compilación.
- Consola real de WARMA: no revisada en este bloque. No afirmar «sin errores de consola» sin ejecución de navegador.

## Medición reproducible del artefacto

| Medida | Valor |
| --- | --- |
| Archivos JS en `dist/client`, incluido SW | 10 |
| JS total sin compresión | 859918 bytes |
| Suma de gzip por archivo JS | 258407 bytes |
| CSS total sin compresión | 251606 bytes |
| Todos los archivos de cliente | 1250179 bytes |

Es tamaño en disco, no tráfico inicial observado. No demuestra tiempos de carga ni fluidez. No hay cifras fabricadas de rendimiento o eficacia.

## Repetir comprobaciones

```sh
./node_modules/.bin/tsc --noEmit
node scripts/verify-warma.mjs
node scripts/verify-onboarding.mjs
node scripts/verify-psychometrics.mjs
node scripts/verify-onboarding-flow.mjs
node scripts/verify-onboarding-motion.mjs
node scripts/verify-navigation.mjs
node scripts/verify-focus-duration.mjs
node scripts/verify-copy.mjs
node scripts/verify-pss10.mjs
node scripts/verify-pss10-persistence.mjs
node scripts/verify-pss10-ui.mjs
npm run build
node scripts/prepare-pwa.mjs
node scripts/verify-pwa.mjs dist/client/sw.js
npm run start
```

Cuando haya navegador permitido: comenzar por bienvenida nueva y regreso con datos existentes, después realizar la matriz completa de tamaños, historial, teclado, Respirar y Concentración. No publicar hasta comprobar el bloque y conservar el respaldo.
