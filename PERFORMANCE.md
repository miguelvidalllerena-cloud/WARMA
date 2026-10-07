# WARMA · presupuesto y medición

Estado 2026-10-05. Se preservan WebGL/Canvas, modos gráficos y dependencias actuales. No se añade postprocesado ni una librería criptográfica/animación. El navegador bloqueado impide medir experiencia de dispositivo: **NO VERIFICADO** LCP, CLS, INP, FPS, CPU, memoria, long tasks y coste GPU.

## Presupuesto de build

| Medida | Presupuesto de seguimiento | Fuente |
| --- | --- | --- |
| Suma gzip de JS cliente, incluido SW | ≤ 300 000 bytes | `qa/lambayeque-v2-final.json` / verify-all |
| CSS cliente sin compresión | ≤ 275 000 bytes | mismo registro |
| Cliente completo en disco | ≤ 1 500 000 bytes | mismo registro |

Son límites de seguimiento del artefacto, no métricas de red inicial. El checkpoint PSS previo tenía JS gzip 258 407 bytes, CSS 251 606 y cliente 1 250 179; los valores nuevos se calculan después del build. Superar el presupuesto exige revisar qué cambió, no retirar funcionalidad para maquillar cifras.

## Criptografía y persistencia

PBKDF2 600 000 se ejecuta al preparar/desbloquear, no en cada tecla o escritura. Web Crypto es asíncrono y no corre dentro de una transacción IDB abierta. Cada guardado cifra el snapshot completo; la operación crece con el volumen de archivos/textos y no se promete tiempo constante. Límite plaintext 25 MB; pruebas nativas cubren un texto de 2 MB. Medir latencia/heap con un perfil sintético representativo en móvil antes de afirmar que la migración de grandes mundos es fluida.

La comparación CAS serializa el registro durante una transacción corta, con máximo tres intentos concurrentes. Reencriptar snapshots conserva la arquitectura existente y evita migrar varias bases/campos a la vez; cifrado por registro incremental sería otro bloque con pruebas de integridad/consistencia y compatibilidad propias.

## Medir cuando el navegador esté disponible

Usar Lighthouse para navegación fría/reapertura, DevTools Performance para long tasks y FPS, y memoria para apertura/cierre de cada módulo. Comparar Esencial/Equilibrada/Inmersiva en las nueve resoluciones del master. Objetivos de experiencia: LCP ≤ 2.5 s, CLS ≤ 0.1 e INP ≤ 200 ms; son objetivos, **no resultados obtenidos**. Ninguna puntuación Lighthouse ni FPS ha sido inventada.

## Medición checkpoint 05

Artefacto del commit funcional `6318fd4`: JS gzip 267 811 bytes, CSS 253 951 y cliente total 1 280 773. Todos dentro del presupuesto. Incremento JS gzip frente a checkpoint03: 2 659 bytes para lifecycle/Espejo; no es carga inicial observada. Prompt, claves y adaptadores proveedor no figuran en JS cliente. No se añade SDK. Modelo/API/límite real y coste operativo no medidos ni configurados.

## Control automático

`performance-budget.json` fija los tres límites y `verify-build-artifacts.mjs` falla si el artefacto real los supera. verify-all lo ejecuta después de build/precache. También verifica markers server-only y filenames privados en cliente; no es un secret scanner universal ni auditoría de seguridad. Checkpoint06: JS gzip269175, CSS253951 y cliente1285972 bytes; checkpoint07 recalcula tras reconciliar docs públicas.

## Medición final · checkpoint07

Commit de cierre probado `16a1bd527d1da3cbca85a09540fd004e9156dd3b`: JS gzip 269173 bytes; CSS 253951; cliente 1287370. Budget PASS. Incluye documentación pública reconciliada y SW preparado, no tráfico/carga inicial observada. Native métricas permanecen NO VERIFICADAS.
