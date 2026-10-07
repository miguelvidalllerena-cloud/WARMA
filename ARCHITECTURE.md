# WARMA · arquitectura observada

Revisión local del 2026-10-04. Rama `warma-lambayeque-v2`, base `53adce3`. Producción no modificada. IMPLEMENTADO indica código conectado; no equivale a validación clínica ni a una prueba completa de navegador.

## Flujo actual

React 19 / TypeScript → vinext / Vite → Worker Cloudflare para SSR y recursos. La aplicación interactiva usa una única ruta `/` y regiones en el hash. IndexedDB conserva un mundo por perfil de navegador; no hay cuenta ni identidad de servidor.

`useWorld` → `initWorld` → validación Zod → IndexedDB `itaca-living-world`, versión 1, almacén `world`, clave `current`. `mutateWorld` serializa operaciones y publica cambios con BroadcastChannel. Importación/exportación JSON incluye el estado completo; cuando está protegido, exporta el sobre cifrado original. CryptoService y local-vault añaden un formato de registro versionado sin cambiar DB/version/store/key. Web Crypto corre fuera de las transacciones; comparación y sustitución son atómicas. Importar o reiniciar requiere acciones explícitas del usuario; esta revisión no ejecutó ninguna sobre datos reales.

Los campos `onboarding`, `onboardingDraft`, `assessment`, `pss10` y `contextualDraft` son aditivos. El campo `onboarding` es opcional en respaldos anteriores y se normaliza a `null`. No cambia el nombre, versión ni almacén de IndexedDB. La bienvenida puede omitirse. Sólo un registro completo y explícito de preferencias crea un check-in del día. Las respuestas omitidas permanecen nulas.

## Inventario

| Capacidad | Estado | Evidencia / límite |
| --- | --- | --- |
| Inicio, Camino, Espejo, Bitácora, jardín y módulos académicos | IMPLEMENTADO | Componentes conectados desde `components/itaca/app.tsx`; la cobertura visual completa está pendiente. |
| URL, Atrás/Adelante y recarga por hash | IMPLEMENTADO | Callbacks de router comprobados; recorridos reales parciales de Fase 1. |
| Concentración 1–180 minutos enteros | IMPLEMENTADO | Duración visible y validación previa. La propuesta del onboarding preselecciona minutos; nunca inicia el temporizador. |
| Respirar y audio voluntario | IMPLEMENTADO | Temporizadores y audio tienen limpieza/suspensión y guards de generación. Ciclo probado con efectos/AudioContext deterministas; ciclo nativo completo pendiente. |
| Persistencia, borrador y respaldo JSON | IMPLEMENTADO | Zod, transacciones y compatibilidad de snapshots comprobados; no se sustituyen pruebas nativas de IndexedDB con pruebas de modelo. |
| Onboarding, consentimiento local y propuesta funcional | IMPLEMENTADO | Cinco pasos, omisión, explicación de almacenamiento local y cifrado opt-in, guardado condicionado, borrador reanudable con privacidad reafirmada y salida sin guardar. UI nueva pendiente de revisión real. |
| Instrumentos psicométricos | PARCIAL | Catálogo y motor desacoplado PSS-10 con inversión/prorrateo; ASQ-14 conservado. Versiones, progreso y repositorios separados. Administración/resultados personales bloqueados por permisos/contenido; placeholders sin respuestas. Sin baremos. Ver `PSYCHOMETRICS.md`. |
| Preguntas contextuales institucionales | PARCIAL | Esquema independiente y ficha pendiente. Hay borradores en informes; no se administran sin versión revisada identificada. |
| Personalización | PARCIAL | Check-in actual prevalece sobre preferencias de bienvenida; seis espacios explican la propuesta. Nudo usa carga explícita, jardín acciones reales. No resultados psicométricos inexistentes. |
| Espejo generativo | IMPLEMENTADO / INACTIVO | Ruta /api/espejo, dos adaptadores y UI por envío; secretos/binding/protocolo no configurados. Sin llamadas reales ni validación de modelo. Guía local completa; fallback identificado. Ver AI-SAFETY. |
| Nudo y degradación gráfica | IMPLEMENTADO | GLSL / WebGL propios, seed persistente, Canvas Essential y manejo de pérdida de contexto. WebGPU, WebGL2 y OffscreenCanvas no están implementados. |
| Jardín / arte | IMPLEMENTADO | Crecimiento a partir de acciones y pausas; arte Canvas local con descarga PNG. No es generación mediante IA. |
| Manifest y Service Worker | IMPLEMENTADO | Precache/versionado/MIME/shell comprobados; helper consulta controller por MessageChannel y falla cerrado. Requiere `prepare-pwa` tras build. Tests VM/fixtures, no instalación nativa. |
| Offline, actualización e instalación reales | PARCIAL | Pruebas simuladas de caché disponibles. Falta comprobar preparación, modo avión, nuevas versiones y módulos en navegadores reales. |
| Recordatorios | PARCIAL | Avisos internos configurables mientras la app está abierta. No hay Push ni Notification API de sistema. |
| Cifrado de contenido | IMPLEMENTADO / OPT-IN | AES-256-GCM, frase y sal/PBKDF2, clave sólo en memoria, respaldo previo y CAS. Legacy legible hasta activación explícita. Pruebas nativas de Web Crypto + adaptador IDB; navegador/durabilidad pendientes. |
| Nube / outbox / Supabase | PROYECTADO | No existen cuentas, sincronización ni políticas RLS configuradas. |
| Telemetría de investigación | PROYECTADO | Historial local de acciones existente; no exportación anonimizada independiente ni envío de métricas. El respaldo completo es privado. |
| WCAG 2.2 AA / rendimiento de dispositivo | PARCIAL | Navegación semántica, nombres y movimiento reducido en código. No declarar certificación AA, FPS ni Core Web Vitals sin medir. |

## Elementos heredados

`Observatory`, `Path` y `PeaceReminders` siguen importados en `app.tsx` sin usarse en la vista actual. El estado `why` y su modal no tienen un disparador visible en esa versión. Son deuda técnica, no evidencia de una función terminada. No se eliminaron módulos ni imports durante este bloque.

La documentación en `public/docs` fue reconciliada en checkpoint07 con crypto/Espejo/PWA actuales. Las secciones históricas explícitas de QA/resumen técnico no certifican los cambios nuevos. Tokens actuales documentados; no migración gráfica/rediseño ciego.

## Ejecución reproducible

Node >=22.13, gestor fijado por el lockfile. Dependencias ya instaladas en Work; no se reinstalaron.

```sh
npx --yes pnpm@11.25.0 install --frozen-lockfile
npm run dev
```

```sh
npm run build
node scripts/prepare-pwa.mjs
node scripts/verify-pwa.mjs dist/client/sw.js
npm run start
```

El resultado requiere Worker/servidor. `dist/client` por sí solo no es una exportación estática completa para Netlify Drop. Ninguna API key es necesaria para los módulos locales actuales.

## PSS-10 y entrega de contenido

`lib/psychometric-engine.ts` mantiene cálculo y permiso separados. PSS-10 tiene estado `PENDING_PERMISSION`, acceso obtenido y grant/acuerdo no acreditados. `lib/pss10-instrument.ts` contiene sólo metadatos y protocolo; los ítems y las instrucciones no están en código. `ProtectedInstrumentContentProvider` define el límite para una entrega controlada futura; no hay backend/endpoints para entregar instrumentos. Una entrega pública requeriría además permiso de redistribución. La interfaz no recoge respuestas mientras falten permisos, contenido íntegro y protocolo.

`lib/pss10-store.ts` utiliza las transacciones existentes y un campo aditivo versionado, sin migración de IndexedDB. La corrección estricta valida total/faltantes desde respuestas y no admite un resultado real durante el bloqueo. El proveedor de contenido, si se autoriza, deberá aplicar autenticación y no-store, exclusión de SW/analítica y condiciones de offline; no confundir esta frontera con una implementación desplegada.

## Readiness offline · checkpoint 06

Registro/ready no marcan disponibilidad. El controller activo /sw.js recibe un puerto con los JS/CSS referenciados por la página y responde CACHE_STATUS: versión de producción, recursos válidos, MIME y shell compatible. Timeout/cleanup/generación ignoran mensajes obsoletos; se reevalúa con controller/red/visibilidad/pageshow. Dev queda no preparado. Install inválido no activa una nueva versión; cache errors no descartan una buena respuesta de red. Root/RSC/API/auth/dominios externos fuera del cache de assets. Directivas _headers/_redirects y manifiesto interno del framework no se precachean. Hash incluye la plantilla SW.

`verify-offline-readiness`, `verify-pwa-metadata` y el SW VM ampliado prueban esos contratos. Instalación/evicción/update real siguen pendientes; ver public/docs/PWA. Nube/Outbox no implementados, el núcleo permanece sin cuenta.
