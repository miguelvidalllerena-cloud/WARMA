# Validación externa · checkpoint 03

Pruebas con datos sintéticos sobre una copia. No sustituir producción ni la base con registros reales antes de cerrar estas comprobaciones. Build/suite automáticos PASS; estas casillas **siguen pendientes en navegador real**.

## Ejecutar

Node >=22.13; `npx --yes pnpm@11.25.0 install --frozen-lockfile`, `npm run dev`. Arquitectura SERVER (vinext/Worker), no ZIP estático para Netlify Drop. Para comprobar el build: `node scripts/verify-all.mjs`. El error de interfaces de Wrangler en Work no debe eludirse con otro navegador; este paquete permite probar en otro entorno autorizado.

## Protección y recuperación

- [ ] Crear un texto sintético en Bitácora, un borrador, un check-in y una acción; exportar la copia legacy.
- [ ] Preferencias → Proteger con una frase: rechazar frase corta y confirmación distinta.
- [ ] Preparar respaldo: el original IDB sigue legible/intacto antes de activar; verificar descarga física.
- [ ] Conservar frase fuera del navegador y confirmar ambas casillas; activar.
- [ ] Inspectar `itaca-living-world` / `world` / `current`: sobre `warma-vault`, ningún texto privado en claro.
- [ ] Bloquear: retirar vistas privadas y audio; no permitir guardar estando bloqueado.
- [ ] Frase incorrecta: error explícito; archivo actual conservado.
- [ ] Recargar/cerrar/reabrir y volver desde bfcache: exigir la frase.
- [ ] Frase correcta: conservar semilla, registros, borrador y temporizador pausado.
- [ ] Editar en dos pestañas desbloqueadas y comprobar actualización sin perder cambios.
- [ ] Alterar una copia de ciphertext/tag: rechazar restauración, sin fallback plaintext.
- [ ] Restaurar copia cifrada en otro perfil con su frase; comparar todos los registros.
- [ ] Importar copia legacy en espacio protegido desbloqueado: guardar cifrado y conservar frase actual.
- [ ] Exportar estando bloqueado: descargar ciphertext, no plaintext.
- [ ] Simular cuota/cierre durante migración o guardado: original/ciphertext válido conservado, sin pérdida silenciosa.
- [ ] Pérdida de clave de sesión: exigir desbloqueo. Sin frase, no afirmar recuperación automática.

## Recorridos y dispositivos

- [ ] 320×568, 360×800, 390×844, 430×932.
- [ ] 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080.
- [ ] Inicio, Camino, Espejo, Bitácora, Respirar, Mi jardín, Preferencias y todos los modales.
- [ ] Necesito parar: controles inferiores, safe areas, scroll y ausencia de superposición.
- [ ] Tab / Shift+Tab / Enter / Space / Escape; foco, nombres y orden; reduced motion.
- [ ] Inicio → Camino/Espejo → Atrás → Adelante; Bitácora/jardín → Atrás; URL directa y recarga.
- [ ] Respirar: iniciar, pausar, reanudar, audio/mute, cambiar pestaña, salir y volver.
- [ ] Concentración: recomendado visible, válido, vacío, 0, negativo, decimal, máximo 180 y excesivo.
- [ ] Consola sin errores propios reproducibles; registrar WARNING de herramientas por separado.
- [ ] PWA instalación, modo avión, cachés completas, reapertura y actualización; GPU/fallback.

PSS-10 sigue PENDING_PERMISSION. No introducir sus ítems protegidos ni evaluar estudiantes para probar este checkpoint.
