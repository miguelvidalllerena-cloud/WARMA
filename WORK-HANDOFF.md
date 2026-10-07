## Release candidate — 2026-10-05

Cierre funcional `d51f709`; base `340c515` intacta. Flags centralizadas false; AI_REMOTE_ENABLED sustituye al antiguo WARMA_AI_ENABLED (inactivo). PSS conserva permisos/scoring; fallback explícito a check-in; texto de cifrado opcional corregido. Clean install y build PASS. RELEASE GATE FAIL por QA nativa no disponible, no por un fallo P0/P1 reproducido. Leer RELEASE-STATUS.md, WARMA-VISUAL-HANDOFF.md y qa/release-candidate.json. No publicar ni iniciar rediseño hasta resolver la QA. Artefacto: warma-lambayeque-v2-release-candidate.zip, SERVER con bundle y build.

# WARMA continuidad PSS-10

Actualizado 2026-10-05. Rama `warma-lambayeque-v2`. Producción `https://warma-musytec.netlify.app` intacta. Sin publicación, merge, push, Netlify CLI ni eliminación de respaldos.

## Master: cierre de evidencia · checkpoint 07 terminado

Rama `warma-lambayeque-v2`. Último commit de cierre probado: `16a1bd527d1da3cbca85a09540fd004e9156dd3b`; implementación PWA/funcional base `174ff12eeed3aada9c44c98a2c89c0fbc7e7ea10`. HEAD documental exacto en CHECKPOINT.json/bundle del ZIP. Árbol limpio al generar checkpoint07; checkpoints03/04/05/06 protegidos. Producción/main/fix-phase-1 intactas; sin push/merge/despliegue/Netlify CLI ni secrets/nube/gasto/modelo externo.

**23 comprobaciones + build/prepare-pwa PASS**, qa/lambayeque-v2-final.json: tipos, veinte scripts de dominio/flujo, SW VM y budget/boundary artefacto. Métricas finales en disco: JS gzip 269173, CSS 253951, cliente 1287370 bytes; presupuestos cumplidos. Capturas/CWV/FPS/browser nativos no obtenidos. Build genera cliente/SSR/RSC y API Espejo dinámica; aviso vinext clasificación `/` desconocida y warnings de proxy/npm son plataforma, no errores propios demostrados.

Dossier JURY-EVIDENCE completo con trazabilidad/límites; TEST-MASTER-CHECKPOINT cubre nueve resoluciones/teclado/todos los módulos/protección/audio/PWA nativos. performance-budget/verify-build-artifacts verifica tamaños, markers server-only y filenames privados; no scanner universal. Docs públicas actuales reconciliadas; notas históricas de otra versión quedan etiquetadas y no se reutilizan como QA. PSS/contextual/check-in separados, ni pregunta/documento protegido incorporado. No rediseño/tokens globales nuevos ni cambios en WebGL; identidad preservada.

Código crypto, audio, endpoint Espejo y readiness cerrado; limitaciones: legado readable hasta opt-in y sin recuperación de frase; PSS PENDING_PERMISSION sin acuerdo/protocolo; contextual sin revisión exacta; IA remota INACTIVA sin provider/model/key/binding/piloto/condiciones de menores y budget control. Nube opcional/Outbox/Auth/RLS no implementados ni provisionados, núcleo sin cuenta. No nuevas dependencias.

Siguiente paso exacto: QA externa autorizada con TEST-MASTER-CHECKPOINT sobre datos sintéticos (browser/IDB/audio/GPU/PWA/HTTP reales) y registrar resultados antes de otra elevación visual o activación externa. El navegador/Wrangler de Work no se reintenta ni elude por otra superficie. No confundir pendiente con FAIL. Si se reproduce P0/P1, test/corrección mínima/commit antes de visual. Permiso PSS/políticas y piloto IA necesitan evidencia externa. No hay fallo crítico abierto reproducido en las pruebas actuales; eso no acredita cero fallos de dispositivo.

CONTINUE-WARMA-NEXT-ACCOUNT contiene prompt autocontenido; su commit probado es el anterior. El HEAD final se restaura desde bundle/CHECKPOINT.json sin volver a una base vieja. Se generará warma-lambayeque-v2-checkpoint-07.zip, SERVER sin datos/secretos/ítems, conservando anteriores. No se ha recibido aviso real de cuota ni se conoce el saldo; emergency-handoff sólo si aparece aviso. No se publica producción.

Los siguientes bloques son historia preservada, no trabajo para repetir.

## Master: PWA readiness cerrado · checkpoint 06

Funcional `174ff12`; commit completo y HEAD documental exactos en CHECKPOINT.json y bundle. `warma-lambayeque-v2`; checkpoints03/04/05 intactos. Árbol limpio al empaquetar. Sin producción/push/merge/Netlify CLI, secretos/coste nuevos.

Corregido register/ready optimista tras reproducirlo. lib/offline-readiness verifica controller activado y su precache por puerto: versión producción, JS/CSS de página compatibles, MIME, todos los recursos y HTML shell. SW no activa producción con precache inválido; source de desarrollo no anuncia readiness. Timeout/mensajes tardíos/controller/online/offline/pageshow/visibilidad/cleanup probados. Caché fallida conserva red buena; root fetch/RSC/API/auth/external excluidos. Prepare-pwa excluye directivas/_headers/_redirects/manifest interno e incluye SW en hash. Nuevas verify-offline-readiness y verify-pwa-metadata; verify-pwa ampliado. **22 checks + build/prepare-pwa PASS** en qa/lambayeque-v2-offline.json. Pruebas de handler/port/cache/eventos son controladas, NO instalación/update nativos.

Limitaciones activas: QA navegador/responsive/teclado/IDB/audio/GPU/offline reales no validados; no reintentar el bloqueo por otra superficie. IA opcional implementada inactiva sin config/contrato/piloto; PSS PENDING_PERMISSION. Crypto opt-in no migra legacy ni recupera frase perdida. Sin nube/Auth/Outbox: no hay necesidad/configuración para introducir una migración externa ahora. Identidad/nudo/jardín existentes conservados; sin edición visual no inspeccionable.

Próximo bloque seguro: dossier del jurado con trazabilidad problema/evidencia/decisión/código/prueba/límite, presupuesto verificable del build y checklist QA externo en nueve resoluciones. Corregir documentación pública contradictoria con los bloques actuales y consolidar continuidad. No rediseñar sin inspección ni afirmar métricas de dispositivo o nuevos permisos. Revalidar build si cambia public/docs, generar checkpoint07 independiente y detener si hay aviso real de cuota.

## Master: Espejo opcional cerrado · checkpoint 05

Último commit funcional estable: `6318fd4e96ec1a0da895388955f0cd6560adacef`; HEAD documental exacto en CHECKPOINT.json y bundle. Rama `warma-lambayeque-v2`, árbol limpio al generar ZIP. Checkpoints03/04 protegidos; sin producción/push/merge/Netlify CLI.

API `app/api/espejo/route.ts`, provider abstraction OpenAI Responses/Anthropic Messages, contrato/client/UI implementados. Guía local completa conservada. Envío opcional con revisión de texto congelado y consentimiento por petición; sólo texto actual/última pregunta/etapa, sin identidad/Bitácora/PSS. Secretos/prompt server, no-store, same-origin, límite de tamaño, cuota obligatoria antes de cada intento, timeout/cancelación, máximo un retry 429 y fallback local. Nuevas pruebas mirror y mirror-ui. Suite **20 checks + build/prepare-pwa PASS**, registro `qa/lambayeque-v2-mirror.json`; scan de diez archivos JS cliente sin prompt/config/endpoints server. Métricas de artefacto: JS gzip 267 811, CSS 253 951, cliente 1 280 773 bytes; dentro del presupuesto, no CWV/FPS.

**IA remota deshabilitada y NO VERIFICADA**: sin provider/model/key/limiter/protocolo configurados, sin llamadas/gastos externos. Variables servidor: AI_REMOTE_ENABLED, WARMA_AI_PROVIDER, WARMA_AI_MODEL, WARMA_AI_API_KEY (secreto), WARMA_AI_POLICY_REVIEWED, WARMA_AI_LIMITER (binding obligatorio). Ningún valor secreto en fuente/ZIP; .dev.vars* ignorado. Policy reviewed es declaración del operador, no aprobación institucional acreditada. Cuota CF por ubicación no es tope global ni autenticación: no activar públicamente sin controles/piloto/condiciones de menores y presupuesto. Heurística de salida no es evaluación de seguridad validada.

Próximo paso exacto: sustituir readiness offline optimista (root marca true al registrar) por verificación real de recursos via CACHE_STATUS, con timeout/limpieza y tests cliente/SW. Instalación/HTTP/browser nativo siguen NO VERIFICADOS; no reintentar bloqueo por otra superficie. Nube opcional no se inicia sin configuración/necesidad. PSS continúa PENDING_PERMISSION, sin ítems protegidos. Crypto opt-in y diseño existente intactos.

Los apartados siguientes conservan historia; manda este encabezado y el commit exacto del CHECKPOINT.json.

## Master: flujos críticos · checkpoint 04

Último commit funcional estable: `75661e5f61f549103e80d7dece3290fb3523eb11`. HEAD documental exacto en CHECKPOINT.json y bundle.

Base de seguridad protegida `64c656a991ec9032087d3b627aabe5957f0590d2`, funcional `768f242`. `warma-lambayeque-v2-checkpoint-03.zip` generado/verificado y conservado; incluye bundle restaurable. Nuevo bloque prueba Respirar/audio mediante efectos/callbacks reales y dobles APIs/clock deterministas, sin navegador.

Fallos reproducidos y corregidos: MUTE ALL no suspendía contexto; resume tardío tras mute; indicador de audio encendido tras cancelación; doble activación creaba dos contextos; guardado de una pausa anterior marcaba la nueva como guardada. Cambios mínimos en `itaca-audio.ts`, `warma-pause-audio.tsx`, `warma-wellbeing.tsx` y cleanup/estado en app.tsx. Nuevos scripts `verify-audio-lifecycle`, `verify-breathing-lifecycle` y helper React. Suite ampliada + build/precache en `qa/lambayeque-v2-critical-flows.json`. Consola/sonido real, teclado/responsive/IDB/dispositivo siguen NO VERIFICADOS por entorno. No se reintentó navegador ni Wrangler.

Siguiente paso exacto: Espejo generativo por endpoint seguro y proveedor intercambiable, sin clave cliente, consentimiento por transmisión, texto mínimo, timeout/cancelación/rate limit/fallback. No existe proveedor/clave configurados ni permiso de gasto; mantener guía local y remoto deshabilitado hasta configuración segura. Después readiness PWA con verificación real de cachés (el root aún marca ready sólo por registro). Sin producción/push/merge/Netlify CLI.

## Master: seguridad local implementada · checkpoint 03

Continuación desde `567955b2503a41b4f1fabcc14becbacc7b6365d0`; base build/13 checks PASS. Incrementos `aac654f` (CryptoService) y `69cd30f` (store/CAS). Commit funcional estable `768f242b129bb7cb6b8d893ebb345e39416a1102`. Integración UI terminada: Preferencias prepara y verifica respaldo cifrado antes de confirmar activación; root gate desmonta vistas privadas; bloquear/pagehide descartan clave y suspenden la experiencia. La activación es opt-in, no se han migrado datos de estudiantes. Legacy sigue legible hasta activación; no hay restablecimiento de frase perdida. No hay clave hardcodeada, dependencias ni secretos nuevos.

Archivos nuevos principales: `crypto-service.ts`, `local-vault.ts`, `local-protection.tsx`, `verify-crypto`, `verify-vault-persistence`, `verify-vault-ui`, `verify-all`, `PERFORMANCE.md`. Store/root/settings/bienvenida y documentos actualizados. Base/protocolo PSS/producción protegidos. Dieciséis comprobaciones, build y preparación precache PASS. La suite completa y build se registran en `qa/lambayeque-v2-security.json`; distingue Web Crypto nativo Node de IDB/React con adaptadores. No hubo reintentos de navegador/Wrangler. Checkpoint 03 contiene código, build, Git bundle, pruebas y documentación, sin datos/ítems/secretos.

Próximo bloque seguro: pruebas críticas de Respirar/audio/timers con callbacks/adaptador de API (no afirmar QA nativa). Registrar y corregir sólo fallos reproducibles. Después endpoint/proveedor Espejo con consentimiento explícito, límites/fallback y ninguna key en cliente; no existe secreto/proveedor configurado ni autorización de gastos. PSS no bloquea esos trabajos independientes, pero sigue sin administrar. PWA necesita sustituir readiness optimista por comprobación de precache; instalación real pendiente. No iniciar nube sin necesidad/configuración autorizada.

## Estado exacto

Este bloque continúa desde `06d11d63013002c4be490199107b8b45603e6502` (checkpoint 02). Commit intermedio `40e75c7`: motor PSS-10 y controles de permiso. Commit funcional final: `81173ae8e2a8478922ea055569523187c8d1183e`. HEAD documental exacto en CHECKPOINT.json/bundle del ZIP. Fase 1 protegida: `53adce3551b7ea8789881b41c0d9f23ce7e3cae9`; main: `6bb7ecddfe4063e54c2d589ba38c4abac4f7aeab`. Checkpoints anteriores conservados, incluida versión 02 y versión 1.

## A–E implementado dentro de los límites legales

Paquete oficial ePROVIDE PSS-10 es-ES inspeccionado; DOCX/PDF coinciden con ZIP. Versión de 10 Oct 2024, ID `PSS-10_AU2.0_spa-ES_10OCT2024`, **últimos 30 días**. Scoring 2.0 de marzo 2023. Diez ítems y opciones 0–4 verificados privadamente. Copyright RST Assessments (2022) y Mapi (2023), contacto previo exigido. No se recibió el acuerdo particular: **PENDING_PERMISSION**, acceso obtenido separado de administración/redistribución. Originales e ítems no están en Git/build/ZIP.

Motor desacoplado `lib/psychometric-engine.ts`; metadatos/protocolo en `lib/pss10-instrument.ts`. Inversión 4/5/7/8, suma 0–40, máximo dos faltantes y media corregida de disponibles ×10. Múltiples marcas como faltantes, cero válido, con tres faltantes sin resultado. Sin redondeo en cálculo/etiquetas clínicas/puntos de corte. Total/prorrateo/faltantes/versiones se recalculan y validan. Historial sólo diferencia numérica de registros de misma versión; primer registro sin afirmar cambio. Orden temporal usa fechas parseadas, incluida fracción de segundo.

`lib/pss10-store.ts` requiere permiso antes de cualquier escritura de administración. Campo aditivo `pss10` en snapshot, conservando `assessment` ASQ-14 y las demás funcionalidades. IndexedDB conserva nombre/version/store/key. Reanudación, rollback, no duplicados y descarte del borrador preparados y probados con fixture. No resultados personales aceptados mientras esté bloqueada. El nudo/perfil activos siguen preferencias explícitas y no muestran un resultado inexistente.

Evaluación del onboarding muestra PSS-10, diez placeholders, disclaimer, privacidad, versión/idioma/distribuidor y Ver respaldo científico. No recoge respuestas ni muestra ítems. Rama de interfaz autorizada preparada con proveedor desacoplado; **no existe proveedor/endpoints configurados** y faltan protocolo y permisos. Con contenido sintético proporcionado, el bloqueo real sigue vigente. El Módulo Contextual sigue vacío sin revisión institucional exacta; su plan futuro de expertos/Aiken/piloto no se presenta como validación ejecutada. Check-in de carga percibida no es prueba psicológica.

## Evidencia y pruebas

Build cliente/RSC/SSR PASS. Trece comprobaciones automáticas PASS, registro `qa/lambayeque-v2-pss10.json`: TypeScript, nueve scripts previos y tres nuevos. Aritmética oficial, 50 variaciones de un ítem, 121 patrones, faltantes/múltiples, cero, rangos/versiones, resultado alterado, permiso/contenido, progreso/historial. Persistencia y callbacks reales usan adaptador IDB determinista; las pruebas de modo autorizado sustituyen exclusivamente el gate en el test y sólo usan texto/respuestas sintéticos. No constituyen administración legal ni validación psicométrica.

Buscados privadamente los diez ítems originales en 235 archivos de fuente/build: ninguno copiado. No se imprimen preguntas en los tests/reportes. Compatibilidad con datos previos, journals/seed/eventos/timers conservados. SW fuente/manifest/deps/WebGL sin cambiar; precache generado del build y treinta rutas verificadas.

Navegador real/visual responsive/teclado/axe/consola/IndexedDB nativo/audio/GPU/instalación/offline **no validados por limitación del entorno**. No hubo reintentos del navegador bloqueado ni de Wrangler. El fallo previo uv_interface_addresses ocurrió antes de escuchar, no es un bug demostrado de WARMA. No confundir fixtures con pruebas nativas ni una prueba pendiente con un FAIL.

## Dependencias y ejecución

Sin dependencias nuevas. Node >=22.13, pnpm 11.25.0, React 19.2.6, TypeScript 5.9.3, vinext 1.0.0-beta.5, Vite 8.0.13 y Wrangler 4.92.0. Arquitectura SERVER, no Netlify Drop. No API keys para módulos actuales.

```sh
npx --yes pnpm@11.25.0 install --frozen-lockfile
npm run dev
```

Para repetir el cierre: tsc --noEmit, verify-warma/onboarding/navigation/focus-duration/copy/psychometrics/onboarding-flow/onboarding-motion/pss10/pss10-persistence/pss10-ui, npm run build, prepare-pwa y verify-pwa dist/client/sw.js. QA contiene comandos exactos.

## Próximo paso exacto y dependencias

1. Recibir/revisar acuerdo específico de ePROVIDE/Mapi: administración electrónica, estudiantes, idioma, contenido, distribución, alojamiento/offline y periodo. No enviar mensajes a terceros sin autorización explícita. Si no permite Git público, implementar proveedor controlado cubierto por el acuerdo, con acceso restringido/no-store y exclusión de SW/analítica. No basta modificar flags o importar un respaldo.
2. Documentar protocolo institucional para la población y consentimiento/asentimiento; no existe validación local de este paquete acreditada. Recibir además formulario contextual y su revisión. Pruebas reales externas del onboarding/carga/persistencia y cuatro resoluciones (390×844, 768×1024, 1366×768, 1920×1080) con teclado/historial/respirar/audio.
3. AES-GCM quedó implementado posteriormente en el master/checkpoint 03, opt-in. No se activa automáticamente sobre instalaciones legacy ni restaura una frase perdida. Revisar el encabezado actual y SECURITY.md; antes de recomendar migración de datos reales, cerrar QA nativa/durabilidad sobre una copia. La exportación protegida es ciphertext; la legacy sigue siendo JSON privado legible.
4. Espejo generativo/endpoint seguro/proveedor/consentimiento/minimización/fallback y sincronización Auth opcional/Outbox/RLS permanecen pendientes después de seguridad. No API keys/nube/Supabase/IA nuevas. No empezar rediseño/PWA/WebGPU por adelantado ni repetir auditorías sin objetivo nuevo.

ZIP de cierre `warma-lambayeque-v2-checkpoint-pss10.zip` contiene fuentes, build, QA, bundle y prompt de continuidad; excluye el paquete protegido y datos de estudiantes. Ante aviso real de cuota, terminar la operación segura, commit/handoff y generar emergency-handoff sin reemplazar respaldos. No se conoce el saldo de créditos.
