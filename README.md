# WARMA

PWA educativa de autorregulación y metacognición para estudiantes de alta exigencia. Organización, pausas y reflexión a un ritmo elegido por el estudiante. No diagnostica ni reemplaza la ayuda profesional.

## Rama de trabajo

`warma-lambayeque-v2`, desde `fix/warma-phase-1` (`53adce3`). Conserva identidad visual, nudo, navegación y herramientas. No reemplaza producción ni el ZIP anterior.

**Historia del primer bloque** (estado anterior al hardening): bienvenida voluntaria, privacidad local explícita, preferencias opcionales y propuesta funcional explicable. Catálogo de instrumentos con requisitos pendientes: **ninguna escala se administra todavía**. Espejo y Atelier actuales son locales, sin modelo generativo remoto; IndexedDB no está cifrado por WARMA.

Bloque 02: bienvenida reanudable con nudo reactivo, preferencias de una en una y recomendaciones explicadas en seis espacios. ASQ-14 preparado con metadatos y corrección de referencia, pero bloqueado por permisos/versión. El recorrido de placeholders no acepta respuestas. El módulo contextual también espera su versión revisada. El checkpoint `warma-lambayeque-v2-checkpoint-02.zip` conserva fuentes, build, historia y límites de QA.

## Estado actual · checkpoint 07

AES-GCM opt-in con respaldo/confirmaciones/gate; Respirar/audio corregidos tras reproducción; endpoint/provider Espejo preparado pero INACTIVO sin configuración; readiness PWA por controller/recursos verificados. PSS-10 PENDING_PERMISSION, sin ítems ni administración. Legacy sigue legible hasta activar cifrado. No nube, producción, claves ni llamadas externas nuevas. Ver [Evidencia para el jurado](JURY-EVIDENCE.md) y [QA externo](TEST-MASTER-CHECKPOINT.md); no se declara validación clínica, instalación/browser nativos ni modelo real probado.

## Ejecutar

Node >=22.13. Dependencias fijadas por `pnpm-lock.yaml`.

```sh
npx --yes pnpm@11.25.0 install --frozen-lockfile
npm run dev
```

```sh
npm run build
node scripts/prepare-pwa.mjs
npm run start
```

El build genera cliente y Worker/servidor; no es una exportación estática lista para Netlify Drop. Los módulos actuales no necesitan API keys. Build PASS en Work; el arranque de Wrangler encontró un bloqueo de interfaces de red del entorno. Ver QA para alcance exacto.

## Documentación de la versión

- [Estado y continuidad](WORK-HANDOFF.md) · [Cambios](CHANGELOG-LAMBAYEQUE.md)
- [Arquitectura implementada/parcial/proyectada](ARCHITECTURE.md) · [Diez prioridades](COMPETITIVE-ROADMAP.md)
- [Psicometría y permisos](PSYCHOMETRICS.md) · [Contradicciones del registro científico](EVIDENCE.md)
- [Privacidad](PRIVACY.md) · [Seguridad](SECURITY.md) · [Límites de IA](AI-SAFETY.md)
- [Pruebas, métricas y limitaciones](QA.md)

El [marco rector WARMA](public/docs/WARMA.md) y los [documentos históricos de desarrollo](public/docs/README.md) conservan la trayectoria anterior. Sus declaraciones no sustituyen la evidencia del código y de las pruebas actuales.

La revisión visual de la bienvenida y el ciclo completo de audio, teclado y offline quedan pendientes. El bloqueo del navegador no se registra como un fallo reproducido de la aplicación. No se afirma eficacia psicológica a partir de resultados históricos sin base verificable.

PSS-10: paquete oficial es-ES recibido y scoring 2.0 verificado. Motor desacoplado 0–40 con inversión de 4/5/7/8, hasta dos faltantes prorrateados y respuestas múltiples como faltantes. Estado **PENDING_PERMISSION**: acceso obtenido, pero acuerdo de administración/redistribución no adjunto. La vista inicial presenta PSS-10 y respaldo científico sin mostrar ítems. ASQ-14 y preferencias siguen conservados. Ver INSTRUMENT-PERMISSIONS, PSYCHOMETRICS y QA. Checkpoint de este bloque: `warma-lambayeque-v2-checkpoint-pss10.zip` (SERVER, no Netlify Drop).

## Protección local opcional

Preferencias → Proteger con una frase → Preparar respaldo cifrado → confirmar archivo y frase guardados → Activar. AES-256-GCM protege el snapshot completo y los nuevos respaldos. La clave queda en memoria y se descarta al bloquear/recargar; no hay restablecimiento de frase. Legacy no se migra automáticamente. Un respaldo cifrado necesita su frase. `SECURITY.md` documenta amenazas y límites, `WORK-HANDOFF.md` el estado exacto; producción intacta. Pruebas adicionales: `node scripts/verify-crypto.mjs`, `node scripts/verify-vault-persistence.mjs`, `node scripts/verify-vault-ui.mjs`.

## Espejo opcional por API

Endpoint/cliente/adaptadores OpenAI y Anthropic implementados, **inactivos por falta de configuración y revisión**. No se realizaron llamadas reales, no hay claves en cliente y la guía local sigue completa. Cada envío necesita revisar y autorizar texto mínimo; fallo/timeout/cuota activan guía local. Variables, pruebas y condiciones antes de habilitar: AI-SAFETY.md. No configurar una key pública ni activar producción para probar este checkpoint.

## Preparación offline verificada en código

El estado se confirma por CACHE_STATUS del controller, con recursos/MIME/versiones; registrar un SW no basta. Development no se presenta como precache de producción. `node scripts/verify-all.mjs` ejecuta las comprobaciones + build y prepare-pwa; sin argumento guarda en qa/lambayeque-v2-latest.json para conservar registros anteriores. La prueba en dispositivo real aún falta.
