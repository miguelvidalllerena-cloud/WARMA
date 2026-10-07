# READY

Release candidate de `warma-lambayeque-v2`, base estable `340c515`; correcciones funcionales `d51f709`. **RELEASE GATE: FAIL**: no autorización para producción ni para declarar cerrada la QA real. Es un candidato descargable, no una versión certificada. Producción, main, fix/warma-phase-1 y checkpoint-07 intactos.

En esta matriz READY significa evidencia automatizada o inspección del código indicada, no aprobación visual/nativa. El bloqueo transversal de navegador afecta a todas las capacidades interactivas.

| Capacidad | Clasificación | Evidencia / condición |
|---|---|---|
| Inicio, check-in Ligera/Intermedia/Alta, siguiente paso y explicación | READY | verify-warma/onboarding/onboarding-flow; preferencias, no diagnóstico |
| Camino, acciones y progreso individual | READY | Modelo local y pruebas warma; recorrido visual pendiente |
| Espejo local / Encontrar claridad | READY WITH FALLBACK | Guía local completa; verify-mirror/mirror-ui; generación remota apagada |
| Bitácora, borrador y registros | READY | Persistencia/cifrado con adaptador; durabilidad nativa pendiente |
| Respirar / Necesito parar | READY | verify-breathing-lifecycle/audio-lifecycle; audio físico pendiente |
| Concentración | READY | verify-focus-duration: recomendación visible, 1–180 enteros; inválidos bloqueados |
| Jardín / Mi ritmo | READY | Derivación de datos locales; inspección de código; visual pendiente |
| Proyectos / Memoria / Mis acciones / Horizontes | READY | Funciones locales conservadas; router y modelo probados; interacción nativa pendiente |
| Pausas y cuerpo / Microjuegos / Apoyo humano | READY | Código existente conservado; hardware/haptics y recorrido manual pendientes |
| Atelier | READY WITH FALLBACK | Arte local procedural; no se afirma generación remota por IA |
| Preferencias, importación/exportación y cifrado opcional | READY | Web Crypto nativa Node + adaptador IDB; descarga/IDB navegador pendientes |
| Recordatorios | READY WITH FALLBACK | Funcionamiento local mientras aplicación activa; no push remoto garantizado |
| Bienvenida / evaluación / perfil funcional | READY WITH FALLBACK | Diálogo voluntario; PSS bloqueada conduce al check-in; perfil por preferencias |
| PSS-10 administrada | DISABLED PENDING EXTERNAL REQUIREMENT | Permiso, protocolo/población y entrega autorizada faltantes |
| Preguntas contextuales institucionales | DISABLED PENDING EXTERNAL REQUIREMENT | Formulario y revisión no recibidos; no se simulan |
| IA remota | DISABLED PENDING EXTERNAL REQUIREMENT | Proveedor, secreto, límite, revisión y piloto no configurados |
| Sincronización en nube | DISABLED PENDING EXTERNAL REQUIREMENT | Sin backend de sincronización implementado; datos locales |
| Nudo / WebGL | READY WITH FALLBACK | Código con modo esencial conservado; GPU/context-loss no validados |
| PWA / offline | READY WITH FALLBACK | Precache y readiness probados en VM; navegador pendiente |
| QA real de dispositivos/navegador | BLOCKER | No se dispone de la capacidad control-browser requerida por el perfil; bloqueo anterior documentado. No se intentó eludirlo |

# DISABLED

`lib/feature-flags.ts` centraliza `PSS10_ENABLED=false`, `AI_REMOTE_ENABLED=false`, `CLOUD_SYNC_ENABLED=false`. No dependen de URL ni localStorage. PSS conserva scoring y permisos: cambiar una bandera no concede autorización, contenido ni validación. Nube no puede activarse mediante un valor de entorno sin implementación.

El endpoint remoto exige `AI_REMOTE_ENABLED='true'` del servidor y todas las condiciones existentes. `WARMA_AI_ENABLED` está retirado y ya no habilita peticiones. No activar IA públicamente por el solo hecho de disponer de una clave.

# FALLBACKS

- Evaluación no autorizada: «Continuar con mi check-in» abre carga, energía y prioridad voluntarias, permite guardar/reanudar; no recoge ítems ni calcula una prueba.
- Espejo sin proveedor, offline, timeout o respuesta inválida: guía socrática local; no finge generación remota.
- GPU limitada: modo esencial existente; sin pérdida intencionada de herramientas. Falta verificar en hardware real.
- Sin permiso de audio/háptica: guía visual disponible, sin autoplay de audio.
- Sin cifrado activado: almacenamiento local no cifrado, explicado en Privacidad/Preferencias/Evaluación. La activación es explícita y requiere respaldo y frase; no se migra automáticamente.
- Offline no preparado: estado de preparación conservador, no promesa automática de funcionamiento desconectado.

# KNOWN LIMITATIONS

P0 abiertos reproducidos: ninguno en el alcance ejecutado. P1 abiertos reproducidos: ninguno en el alcance ejecutado. Esto NO acredita ausencia de errores nativos. **Bloqueador de proceso**: faltan responsive, teclado, rutas reales, sonido, IndexedDB, GPU y PWA en navegador.

P2 corregidos: texto obsoleto «aún sin cifrado» en Evaluación; alternativa al instrumento pendiente ahora explícita. No se reprodujo otro P2 pendiente mediante las comprobaciones ejecutadas.

P3/limitaciones aceptadas: cifrado opt-in; sin recuperación de frase; no elimina copias históricas en claro; heurísticas del Espejo no son seguridad clínica validada; cuota por ubicación de Cloudflare no es presupuesto global; no CWV/FPS medidos; recordatorios sin servicio push. PSS/contextual/IA/nube deshabilitados no son funciones rotas.

# SECURITY

Pruebas verifican AES-GCM/PBKDF2, IV por escritura, migración explícita reversible ante fallo, respaldo cifrado, lock/reload/unlock, frase incorrecta/tamper y concurrencia CAS. Nuevos borradores y entradas se cifran al persistir cuando protección está activa. Contextual/PSS están deshabilitados: no afirmar recolección real probada de esos instrumentos. El sobre cubre todo el snapshot, no sólo Bitácora.

Sin claves persistidas ni frases hardcodeadas; las frases de tests son fixtures. Sin datos reales de alumnos, documentos privados PSS, .env real ni .dev.vars real en el paquete. Comprobación de artefactos cliente: sin marcadores de clave/proveedor/prompt servidor; no sustituye una auditoría de seguridad independiente. Endpoint: consentimiento/minimización/no-store/origen/esquema/límites/timeout/fallback. No se enviaron datos a IA ni se hicieron llamadas con coste.

# PWA

Manifest e iconos locales verificados; SW generado con versión hash y 28 rutas precache. Tests VM cubren instalación/activación/caché parcial/MIME/actualización/fallback/exclusiones. Readiness requiere controlador y confirmación de recursos. No se modificó SW en este cierre.

Instalación física, primera carga online, segunda offline y actualización real: **NO VALIDADAS**. Preparar con `node scripts/prepare-pwa.mjs` después de cada build. Necesita origen seguro HTTPS o localhost y navegador compatible. No usar el servidor de desarrollo como prueba de instalación productiva.

# QA

Evidencia automática: `qa/release-candidate.json` (commit funcional), `qa/release-clean-install.json`, scripts verify-*.mjs. Instalación limpia en copia aislada sin node_modules previos: PASS; 628 paquetes desde caché, cero descargados; lockfile idéntico; build limpio PASS. La preparación inicial de la copia omitió permisos/configuración y se corrigió; no era un fallo del producto.

Suite: 24 comprobaciones + build + preparación PWA, 26 comandos. React hooks/IDB/timers/audio son adaptadores deterministas; Web Crypto se ejecutó en Node. No se ejecutó axe en navegador. Warnings de configuración npm/plataformas opcionales no son errores reproducidos de WARMA.

| Prueba | Resultado | Evidencia / pendiente |
|---|---|---|
| Rutas, raíz, Atrás/Adelante, recarga | PASS automatizado / nativo pendiente | verify-navigation; no se inventan URLs para diálogos |
| Onboarding y check-in fallback | PASS automatizado | verify-onboarding-flow, consentimiento/guardar/reanudar |
| Concentración recomendada y personalizada | PASS automatizado | 1,5,15,25,45,60,180; vacío,0,negativo,decimal,181/NaN; caption visible |
| Respirar, pausa, reanudación, pestaña, cierre/reentrada | PASS adaptador / nativo pendiente | un intervalo, no avance oculto, limpieza, finalización única |
| Audio activar/silenciar/salir | PASS adaptador / audición pendiente | verify-audio-lifecycle; no afirmación de audio real |
| Cifrado escribir/persistir/reabrir/descifrar | PASS Node+IDB adaptador | verify-crypto/vault-persistence/vault-ui |
| Responsive 320×568,390×844,430×932 | NO VALIDADO | Capturas/solapamientos/scroll/modal/tacto/nudo pendientes |
| Responsive 768×1024,1024×768 | NO VALIDADO | Mismas verificaciones pendientes |
| Responsive 1366×768,1920×1080 | NO VALIDADO | Mismas verificaciones pendientes |
| Tab/Shift+Tab/Enter/Space/Escape | NO VALIDADO nativo | Semántica/callbacks no acreditan foco real ni ausencia de trap |
| GPU/noGPU/context-loss | NO VALIDADO | No cambiar shaders para aparentar una prueba |
| Consola/red en recorrido real | NO VALIDADO | No se registran errores imaginados; no hubo recorrido nativo |
| Offline/instalación/update | PASS VM / NO VALIDADO nativo | verify-pwa/offline-readiness/metadata |

La guía vigente de Sites exige control-browser para el perfil managed-linux y prohíbe improvisar otra vía si no está disponible. No está en el catálogo actual. No se iniciaron nuevos intentos de browser/puertos/Netlify ni se sustituyó QA real por capturas antiguas. Completar `TEST-MASTER-CHECKPOINT.md` fuera de este entorno y adjuntar evidencia antes de cambiar FAIL a PASS.

# PRODUCTION ENVIRONMENT

**No publicado. No merge/push.** SERVER: vinext / Cloudflare Worker, no ZIP estático Netlify Drop. Node >=22.13; pnpm 11.25.0; lockfile incluido. Para prueba local fuera de Work: descomprimir, entrar a `warma`, `npx --yes pnpm@11.25.0 install --frozen-lockfile`, `npm run dev`. Para servidor del build: `npm run start`. Según entorno se necesitan interfaces de red y permisos locales funcionales.

Por defecto no definir IA remota, o definir `AI_REMOTE_ENABLED=false`. Una habilitación posterior requiere `AI_REMOTE_ENABLED=true`, `WARMA_AI_PROVIDER`, `WARMA_AI_MODEL`, secreto servidor `WARMA_AI_API_KEY`, `WARMA_AI_POLICY_REVIEWED=true`, binding `WARMA_AI_LIMITER`, y validación externa de privacidad/menores/proveedor/presupuesto/calidad. Nunca VITE_/NEXT_PUBLIC_ para secretos. Revisión declarada no equivale a permiso institucional.

# ROLLBACK

Checkpoint-07 y HEAD estable `340c515a41197ced2f1b548e7cce901c481e4c5c` preservados. ZIP RC contiene fuentes, build, evidencias y bundle con historial de tres ramas. Restaurar en una carpeta nueva: `git clone --branch warma-lambayeque-v2 warma-history.bundle warma-restaurada`; para inspeccionar respaldo sin alterar la rama usar otro worktree en `340c515`.

Antes de cualquier cambio futuro exportar respaldo local apropiado (cifrado si protección activa). No borrar IndexedDB ni sobreescribir datos protegidos. No hay migración de esquema en este cierre. Evitar versiones anteriores al soporte de cifrado con datos ya protegidos. Producción actual no requiere rollback porque no fue modificada.
