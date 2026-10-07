## Release candidate — 2026-10-05

Cierre funcional `d51f709`; base `340c515` intacta. Flags centralizadas false; AI_REMOTE_ENABLED sustituye al antiguo WARMA_AI_ENABLED (inactivo). PSS conserva permisos/scoring; fallback explícito a check-in; texto de cifrado opcional corregido. Clean install y build PASS. RELEASE GATE FAIL por QA nativa no disponible, no por un fallo P0/P1 reproducido. Leer RELEASE-STATUS.md, WARMA-VISUAL-HANDOFF.md y qa/release-candidate.json. No publicar ni iniciar rediseño hasta resolver la QA. Artefacto: warma-lambayeque-v2-release-candidate.zip, SERVER con bundle y build.

# Checkpoint 07 · dossier y presupuesto · cierre PASS

Sin cambios de funcionalidades/identidad. Nuevo presupuesto verificable y boundary scan, dossier trazable y checklist de QA externa; reconciliadas docs públicas que todavía negaban cifrado o describían iris anterior como actual. Historial y backups conservados. 23 comprobaciones + build/prepare-pwa PASS; registro final con commit/comandos/salidas y budget/boundary. No nube, permisos nuevos, proveedor remoto, producción ni gasto. La calidad visual/dispositivo sigue pendiente; no se inventan capturas o métricas.

# Checkpoint 06 · readiness offline

Desde `2f43ca5`, funcional `174ff12`. Reproducido aviso false-positive por register/ready; sustituido por controller/MessageChannel con timeout/versiones/cleanup y referencias JS/CSS de página. SW valida MIME/shell/recursos antes de activar producción; root/RSC no reciben HTML de cache y problemas de almacenamiento no descartan red correcta. Precache excluye directivas de hosting/metadatos internos y versiona también SW. Metadata/iconos y dos pruebas nuevas; suite ampliada22 + build/precache PASS. Development no se etiqueta preparado. Instalación/modo avión/update reales NO VERIFICADOS. Sin dependencias, nube, producción ni cambios de psicometría/estética/WebGL; checkpoint previo protegido.

# Checkpoint 05 · Espejo opcional por endpoint

Desde `899d2e8`; commit funcional `6318fd4`. Contrato estricto y adaptadores OpenAI/Anthropic server, cuota obligatoria, timeout/cancelación/retry acotado/fallback; consentimiento específico y texto congelado, sin journal/PSS/identidad ni claves cliente. UI no simula disponibilidad sin configuración y conserva preguntas locales. Veinte checks + build/precache PASS, scan server-only PASS, artefacto dentro de presupuesto. Variables de secretos ignoradas, ninguna configurada ni petición remota/coste. Calidad del modelo, autorización institucional, cuota cloud e HTTP/browser reales NO VERIFICADOS. Checkpoint05 independiente, sin producción/nube/PSS/destrucción de respaldos.

# Checkpoint 04 · Respirar y audio

Desde `64c656a`. Correcciones sólo tras reproducirlas en callbacks/efectos: MUTE ALL suspende AudioContext, cancelación no reactiva ni enciende indicador, doble clic no duplica contextos y guardado tardío no marca otra pausa. Suspensión/pagehide/unmount, timers y salidas probados. Suite ampliada a dieciocho checks + build/precache; registro critical-flows. Sin nuevas funciones, dependencias, producción ni WebGL. QA nativa permanece NO VERIFICADA.

# Checkpoint 03 · cifrado local opt-in

Cierre desde `aac654f`/`69cd30f`: activación con respaldo verificado y dos confirmaciones, frases fuera de almacenamiento, desbloqueo y gate que desmonta vistas privadas, pagehide, import/export cifrados y preservación legacy. Dieciséis checks y build/precache PASS (`qa/lambayeque-v2-security.json`). Claves incorrectas, tag/ciphertext/AAD alterados rechazados, rollback/CAS probado y bloqueo durante petición impide reabrirla tardíamente. Sin datos reales, nube, producción ni ítems protegidos. Nuevo presupuesto en PERFORMANCE; TEST-CHECKPOINT-03 contiene QA externa pendiente. Métricas en disco: JS gzip 265 152, CSS 253 408 y cliente 1 270 607 bytes; sin métricas inventadas de dispositivo.

# WARMA · cambios Lambayeque

## 2026-10-04 · Recuperación

- Creada `warma-lambayeque-v2` desde `fix/warma-phase-1` (`53adce3`).
- Conservada la rama anterior y producción estable.
- Añadido checkpoint inicial con pruebas previas y limitaciones distinguidas de fallos.
- Comenzada auditoría de arquitectura y revisión científica; ninguna escala ni diagnóstico habilitado.

## Primer bloque funcional

- Bienvenida opcional de cinco pasos y consentimiento local, sin permiso implícito para IA o investigación.
- Perfil basado en preferencias explícitas y omisiones preservadas. La propuesta de Concentración preselecciona una duración válida sin iniciar la sesión.
- Catálogo científico de seis instrumentos; ninguno habilitado ni con ítems reproducidos.
- Campo aditivo de snapshot; respaldos y borradores heredados conservados.
- Auditoría de capacidades y diez prioridades documentadas. No producción, despliegues ni recursos de coste.
- Pruebas automáticas PASS; QA visual y de dispositivo continúa pendiente por el bloqueo del entorno.

## Evidencia y QA del checkpoint

- Comparación primaria de SISCO, PSS-10/14, ASQ-14, ESSA y MSLQ, sin copiar ítems.
- Contradicciones de informes y cuaderno documentadas; originales intactos.
- Documentación actual de arquitectura, privacidad, amenazas, límites de IA y diez prioridades.
- Build y siete verificaciones PASS; precache generado, 30 rutas comprobadas.
- Medido tamaño en disco de JS/CSS, sin fabricar FPS/Core Web Vitals.
- Wrangler bloqueado por interfaces de red; QA real no validado, sin atribuir fallo a WARMA. Navegador no reintentado.
- Prompt de continuidad y paquete independiente con fuentes, build y bundle Git al cerrar este checkpoint. ZIP anterior y producción protegidos.

## Bloque 02 · evaluación protegida y primer ingreso

- ASQ-14 preparado como candidato principal, sin seleccionar una escala activa sin permiso. Revisión primaria ampliada: corrección original, derechos y AESI como alternativa. Evidencia peruana aceptada sigue con texto final pendiente.
- Motor de referencia estricto, 14 ítems, suma 14–70, faltantes no imputados y bloqueo de resultados sin licencia. No ítems copiados, diagnósticos ni baremos.
- Evaluación, módulo contextual y check-in separados técnica y visualmente. Placeholders informativos sin aceptar respuestas; ficha «Sobre esta evaluación» con autores, evidencia, referencias, licencia y límites.
- Bienvenida editorial con nudo Canvas reutilizado, transiciones discretas y preferencias de una en una. Movimiento reducido, límite DPR, pestaña oculta y limpieza.
- Guardar/retomar/descartar sólo el borrador de bienvenida. La confirmación final conserva el formato anterior de preferencias y no altera los registros previos.
- Corregida una inconsistencia reproducida por prueba: Organizarme ahora propone Camino tanto desde bienvenida como desde el check-in.
- Personalización explicada en seis espacios; check-in actual prevalece, Concentración no se inicia automáticamente, nudo distingue carga inicial/actual y jardín conserva datos reales.
- Tres nuevas verificaciones: psicometría, flujo/persistencia con adaptador y motion. Ampliadas las pruebas anteriores sin quitar guardas o escenarios.
- Sin nuevas dependencias, migración del motor de IndexedDB, cambios al Service Worker fuente, cifrado, nube, IA remota, merge o publicación. Checkpoint anterior protegido.
- QA visual/nativo sigue pendiente por limitación de entorno; no declarado como fallo ni como validación concluida.

## PSS-10 · actualización en curso · 2026-10-04

Continuación desde 06d11d6. Paquete ePROVIDE oficial es-ES y manual verificados, sin acuerdo de licencia adjunto. Acceso obtenido se separa de administración/redistribución; contenido protegido excluido. Nuevo motor aritmético desacoplado, inversión/prorrateo/múltiples/faltantes, metadata, estado aditivo local y repositorio protegido. Evaluación inicial PSS-10 con respaldo científico y diez placeholders, preferencias/contextual/check-in separados. Pruebas de cálculo y transacciones sintéticas PASS; cierre de build/checkpoint pendiente en este commit intermedio. Sin publicación ni nuevos servicios.

## PSS-10 · cierre técnico A–E · 2026-10-04

Build y trece verificaciones PASS; administración sigue PENDING_PERMISSION, sin acuerdo/protocolo verificados. Scoring y persistencia probados con fixtures, sin ítems oficiales publicados ni sujetos reales. Evaluación incluye respaldo científico/versiones/distribuidor, diez placeholders, guardas/valor cero, historial sin cambios clínicos atribuidos y plan contextual aún pendiente. Tipado de catálogo añade estados legales/versiones/algoritmo sin borrar ASQ. Se corrigieron rótulo ASQ residual en perfil, validación de contenido malformado y orden de historia con fracciones de segundo. Docs y handoff actualizados. Nativa/visual no validada; AES-GCM y fases posteriores pendientes. Checkpoint PSS separado; producción/backups intactos.
# Seguridad · incremento criptográfico

Continuación desde `567955b`, 2026-10-04. Base build/tests PASS. CryptoService desacoplado con AES-256-GCM, IV/sal aleatorios, AAD, PBKDF2-SHA256 600 000 y claves no extraíbles sólo en memoria. Test nativo de manipulación, clave incorrecta, Unicode, vacío, tamaño, bloqueo y reapertura PASS. Todavía no migra IndexedDB; integración y UI son el siguiente incremento. Sin producción, dependencias, nube ni contenido psicométrico protegido.

Segundo incremento: integración opt-in preparada en el store. Preparar respaldo no escribe; activar exige confirmación y CAS del original. AES fuera de transacciones abiertas; escrituras cifradas con IV nuevos y reintento limitado ante concurrencia. Lectura bloqueada sin clave, sin fallback de descifrado, exportación del ciphertext e importación compatible. Migración interrumpida/rollback, legacy, recarga, frase incorrecta, manipulación y concurrencia PASS con criptografía nativa y adaptador IDB determinista. La UI y la prueba de navegador siguen pendientes; no se han cifrado datos reales del usuario.
