# WARMA · dossier de evidencia técnica

WARMA es una PWA educativa de autorregulación y metacognición para estudiantes de secundaria sometidos a alta exigencia académica. Organiza microacciones, pausas y reflexión; el mundo visual acompaña esos registros. La implementación no demuestra por sí misma reducción del estrés, eficacia clínica o superioridad sobre otras aplicaciones.

Estado de esta rama: `warma-lambayeque-v2`, checkpoints03–06 preservados. Producción estable intacta. Código funcional de PWA cerrado en `174ff12eeed3aada9c44c98a2c89c0fbc7e7ea10`; HEAD exacto del dossier en CHECKPOINT.json y bundle del checkpoint07. Historial recuperable; sin datos de estudiantes, secretos ni contenido protegido en el paquete.

## Cadena de evidencia

| Problema | Evidencia / fundamento | Decisión | Implementación | Prueba | Resultado y límite |
| --- | --- | --- | --- | --- | --- |
| Texto privado en un perfil compartido | Modelo de amenazas en SECURITY; Web Crypto/OWASP | Protección opt-in con clave derivada y respaldo previo | crypto-service, local-vault, store, local-protection | verify-crypto + vault-persistence/ui | GCM nativo y CAS/rollback PASS; legacy legible hasta activar, no protege memoria desbloqueada/XSS |
| Migrar puede destruir registros | Snapshots heredados y fallos de cuota/concurrencia reproducidos | Preparar sin escribir; confirmar copia/frase; CAS autenticado | prepare/download/activateLocalEncryption, import/export | Store real + IDB determinista | Datos sintéticos conservados; crash/locking/descarga físicos pendientes |
| El apoyo no debe exigir revelar todo | Contrato de datos/PRIVACY; política de menores del proveedor | Guía local completa; remoto opcional, envío revisado | mirror-contract/client/UI, /api/espejo | verify-mirror/ui | Consentimiento, mínimo payload y fallback PASS con fetch sintético; remoto INACTIVO |
| IA externa puede fallar o ser insegura | Límites de proveedor/endpoint en AI-SAFETY | Provider abstraction, cuota obligatoria, timeout/cancelación y salida validada | server/mirror-provider y mirror-endpoint | DTOs de dos proveedores, 429/cancel/invalidación | Contratos PASS; modelo, seguridad semántica, presupuesto global y piloto no verificados |
| Registrar SW no prueba capacidad offline | Falso positivo reproducido antes de `174ff12`; W3C ready/controller | Confirmar recursos/versiones de controller activo | offline-readiness, sw.js, prepare-pwa | SW VM + ports/eventos + metadata | Parcial/MIME/shell/timeout/update controlados PASS; instalación real pendiente |
| Audio y timers pueden seguir al salir | Cinco fallos reproducidos antes de `75661e5` | Suspender/limpiar y rechazar activaciones/guardados obsoletos | itaca-audio, pause-audio, wellbeing, root | verify-audio/breathing-lifecycle | Doble contexto/cancelación/salida/sesión vieja corregidos; sonido/latencia físicos pendientes |
| Una escala no autoriza un diagnóstico | Paquete PSS/versiones y permisos examinados; PSYCHOMETRICS | Cálculo separado de permiso, contexto y check-in | pss10-instrument/store, psychometric-engine | verify-pss10/persistence/ui | Aritmética/guardas sintéticas PASS; PENDING_PERMISSION, sin preguntas ni administración |
| Recomendaciones opacas añaden presión | Preferencias y check-in explícitos, reglas inspeccionables | Explicar cada propuesta; ajuste/omisión disponibles | functionalProfile + PersonalizationNote | verify-onboarding/flow | 96 combinaciones y consentimiento/borrador controlados; no inferencia clínica |
| Mundo decorativo o ranking competitivo | Registros locales de acciones/pausas/sesiones y seed | Visualización determinista y no punitiva | warma-knot, world/essential-renderer, garden | Geometría finita/cerrada; compatibilidad/roundtrip | Nudo/jardín conectados a datos; originalidad/calidad visual actual/GPU no certificadas |
| Diseño pesado | Artefacto de build medido | Presupuesto de bytes, sin retirar funciones para ajustar métricas | performance-budget + verify-build-artifacts | Gzip/tamaño reales en disco y límites | Dentro del presupuesto; no resultados LCP/CLS/INP/FPS |

Las pruebas de fixtures no son estudios con estudiantes, validación psicométrica ni auditoría independiente. No hay resultados reales administrados de PSS. La detección de palabras del Espejo es auxiliar e incompleta; no ofrece triaje clínico ni alertas a terceros.

## Qué se puede mostrar

Con un perfil de demostración sin datos reales: bienvenida y omisión; propuesta con «¿Por qué?»; carga cotidiana y geometría; una microacción; Concentración con duración visible; Respirar y salida; Bitácora Zen con texto sintético; jardín y Mi ritmo; cambios de calidad; respaldo sintético y protección opt-in; restauración con la frase conservada. Proyectos/flashcards/microjuegos continúan disponibles.

Mostrar la ficha científica y el bloqueo PSS como evidencia de separación metodológica. No activar flags ni cargar preguntas para una demostración. Mostrar Espejo local; para el endpoint explicar adapters y tests, sin llamar «modelo real validado» a respuestas simuladas. El remoto está desactivado, no hay claves/binding/piloto. No confundir arte procedural con generación de IA.

La demostración en navegador debe ejecutarse externamente con TEST-MASTER-CHECKPOINT.md. No se dispone de capturas actuales por el bloqueo del entorno y no se reutilizan imágenes históricas como prueba de esta versión. Identidad existente conservada; elevación visual/medición GPU pendientes de inspección real.

## Alcance científico y derechos

PSS-10 es estrés percibido global, no exclusivamente académico. Spain/Spanish 10 Oct 2024 no acredita validación COAR/peruana. Scoring Version2.0 March2023 se conserva; sin puntos de corte universales, etiquetas clínicas o subescalas inventadas. Acceso a DOCX/PDF no acredita permiso electrónico/redistribución. Instrumento bloqueado y textos protegidos fuera del código/build/ZIP. Preguntas Contextuales WARMA esperan versión y revisión institucional verificables; check-in Ligera/Intermedia/Alta es autorregistro, no test.

Los informes suministrados tienen contradicciones entre cifras y metodología pendiente; EVIDENCE.md las identifica. No se inventan participantes, consentimiento, coeficientes, reducción de estrés, validación local ni concesión de derechos.

## Fuentes y evidencia reproducible

- Ciencia/permiso: [Laboratorio Cohen, CMU](https://www.cmu.edu/dietrich/psychology/stress-immunity-disease-lab/scales/index.html); referencias y límites completos en PSYCHOMETRICS/INSTRUMENT-PERMISSIONS. El paquete privado no se redistribuye.
- Criptografía: [W3C Web Crypto](https://www.w3.org/TR/WebCryptoAPI/), [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html). Arquitectura propia, no certificación.
- PWA: [W3C Service Workers](https://www.w3.org/TR/service-workers/), [Cloudflare headers](https://developers.cloudflare.com/workers/static-assets/headers/).
- Proveedores: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Under18 API guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance), [Anthropic Messages](https://platform.claude.com/docs/en/api/messages/create), [Cloudflare Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/). Consultados para arquitectura; contratos/activación efectivos pendientes.
- Código: commits `aac654f`, `69cd30f`, `768f242`, `75661e5`, `6318fd4`, `174ff12` y cierre del dossier. El bundle conserva también main y fix/warma-phase-1.
- Resultados completos: qa/lambayeque-v2-security.json, critical-flows.json, mirror.json, offline.json y final.json. Fecha/commit/comando/exit/salida registrados. Reproducir con `node scripts/verify-all.mjs`.

## Riesgos residuales con mitigación

| Residual | Mitigación actual | Evidencia que falta |
| --- | --- | --- |
| Datos legacy/frase perdida | Activación voluntaria, advertencia explícita y copia previa; no recuperación inventada | Migración/restauración física sobre copia |
| API sin piloto/keys/presupuesto | Remoto INACTIVO, guía local; configuración fail-closed | Protocolo/consentimientos de menores, contrato, modelos y controles operativos |
| PSS/contextual sin permiso/revisión | Sin preguntas/recogida/resultados; ficha con límites | Acuerdo y protocolo institucional |
| PWA/dispositivo reales | Readiness controlada y checklist externo; backups | Instalación/modo avión/update/evicción en browsers |
| WCAG/performance/composición actuales | Foco/labels/reduced motion y límites conservados; no rediseño ciego | Teclado/axe/lector, nueve resoluciones, CPU/long tasks/FPS |
| Nube no implementada | Núcleo sin cuenta; exportación/restauración local | Necesidad/configuración/protocolo antes de Outbox/Auth/RLS |

No se publicó ni cambió producción. No hubo un aviso real de cuota ni se presume su saldo; continuidad preparada en el checkpoint por prevención.
