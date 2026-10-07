# WARMA — contrato de continuidad visual

Estado: **READY FOR VISUAL HANDOFF: NO** hasta completar QA nativa del release gate. Este documento fija límites para el trabajo posterior; no autoriza publicar ni empezar otra reconstrucción.

Rama `warma-lambayeque-v2`; base checkpoint-07 `340c515`; cierre funcional `d51f709`; HEAD exacto y build incluidos en CHECKPOINT.json del ZIP. Leer RELEASE-STATUS.md primero. No reiniciar el proyecto. Identidad preservada: nudo, verde oscuro/crema, tipografía editorial, navegación lateral. Ningún rediseño en este cierre.

## NO CAMBIAR

- Router, identificadores de regiones, raíz/historial, semántica de diálogos.
- Scoring/inversos/faltantes/permisos/contenido PSS; perfil no diagnóstico.
- IndexedDB, formato/serialización, CAS, persistencia, cifrado, migración y respaldos.
- Service Worker, caché, manifest/readiness y exclusiones de privacidad.
- Endpoint/proveedores, consentimiento, minimización, límites, secrets y fallback local.
- Feature flags, lógica de recomendaciones, timers/audio y estados guardados.
- Accesibilidad, nombres, aria-current, foco, teclado, reduced motion, salida de diálogos.
- Fallbacks y afirmaciones de privacidad/capacidades. No dibujar funciones inexistentes.

## PUEDE AJUSTARSE DESPUÉS DEL GATE

CSS, tokens, espaciado/layout, tipografía, assets y motion; apariencia del shader únicamente si mantiene comportamiento y fallback. Sin dependencias grandes ni reestructurar arquitectura. Mantener contenido, contraste, targets táctiles, safe areas y presupuesto. Una mejora estética que rompe funcionalidad se revierte.

## VERIFICACIÓN OBLIGATORIA

Copia/branch separada y checkpoint previo. Un cambio pequeño por commit. `node scripts/verify-all.mjs` y build/precache; pruebas reales en 320×568,390×844,430×932,768×1024,1024×768,1366×768,1920×1080. Capturas actuales de Inicio, Bitácora, Jardín, Concentración y diálogos; verificar botón Necesito parar, scroll, foco y legibilidad. Probar reduced-motion, GPU/noGPU, navegación y audio. No afirmar PASS visual por compilación. No tocar producción sin nueva autorización y gate aprobado.
