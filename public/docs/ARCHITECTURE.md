# Arquitectura de WARMA

React19/TypeScript → vinext/Vite → Worker Cloudflare. Entrada `/` con regiones por hash. Requiere servidor/Worker; dist/client solo no es Netlify Drop completo. Sin dependencias nuevas en estos bloques.

## Capas

| Capa | Implementación | Límite |
| --- | --- | --- |
| Navegación/interacción | components/itaca/app.tsx; URL/hash y regiones | Historia/callbacks probados; navegador real pendiente |
| Mundo/compatibilidad | lib/itaca-store.ts, esquemas Zod y seed | IDB conserva nombre/version/store/key; datos sintéticos en tests |
| Protección opcional | lib/crypto-service.ts, local-vault.ts, local-protection.tsx | AES-GCM nativo; legacy sin migración automática; frase no recuperable |
| Bienvenida/perfil | warma-onboarding; preferencias y check-in explícitos | No perfiles diagnósticos ni escalas activadas |
| Psicometría preparada | psychometric-engine, pss10-instrument/store | PENDING_PERMISSION; sin ítems/manual público |
| Espejo externo opcional | /api/espejo → AIProvider OpenAI/Anthropic | INACTIVO sin configuración; no llamadas/modelo real probado |
| Espejo local | Preguntas predefinidas + apoyo humano | No diagnóstico, clasificador de emergencia ni terapia |
| Gráficos | world-renderer + essential-renderer, warma-knot | WebGL/Canvas; GPU y FPS actuales no medidos |
| PWA | sw.js + prepare-pwa + offline-readiness | Caché comprobada por controller; instalación real pendiente |

## Integridad local

IndexedDB `itaca-living-world`, versión1, world/current. Sobres cifrados versionados conservan todo el snapshot. Clave no extraíble en memoria; PBKDF2-SHA256/AES-256-GCM, sal/IV CSPRNG, AAD. Preparación de migración sin escribir, backup verificado y confirmaciones, sustitución CAS. Cifrar fuera de transacciones cortas; validar/decrypt antes de publicar. Fallos no reemplazan el original. Exportación protegida ciphertext, importación autenticada y compatible. BroadcastChannel sólo comunica updatedAt. Tests usan adaptador determinista, no durabilidad nativa.

## Espejo y red

DTO estricto: texto actual revisado, última pregunta, etapa y consentimiento. Nunca se añade nombre/Bitácora/PSS/historial. Prompt/config/keys sólo server. Cuota binding obligatoria, tamaño limitado, timeout/cancelación, retry acotado/fallback. Configuración ausente mantiene todo local. Activación externa exige protocolo/condiciones de menores, presupuesto y pruebas supervisadas; binding CF por ubicación no es techo global ni autenticación.

## Tiempo y universo

Concentración valida enteros1–180, conserva remaining/endsAt, registra una sesión sin duplicar. Respirar excluye tiempo oculto; salir/pausar limpia timer/audio. Nudo responde a carga explícita y pausa reciente como metáfora. Jardín conserva acciones/sesiones/pausas reales; no se castiga ausencia. Arte local no se llama IA generativa.

## PWA y alcance

Precache versionado excluye configs/metadatos internos y rutas privadas. Readiness comprueba MIME, shell/recursos/versiones por MessageChannel del controller. Root/RSC y API fuera de assets. Fallos de caché conservan respuestas de red válidas. Ver PWA.md.

No nube/Auth/Outbox/RLS ni analítica externa implementados. Herramientas WebMCP se registran sólo si el navegador las anuncia; no son requisito del núcleo. Code connected no equivale a validación clínica, instalación real ni certificación WCAG2.2AA.
