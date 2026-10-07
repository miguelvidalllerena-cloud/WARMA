# WARMA · evidencia QA actual

Checkpoint07 reúne cierre de cifrado, Respirar/audio, endpoint Espejo inactivo y readiness PWA. Build/tipos y scripts de contrato pasan. Los registros completos están en qa/ dentro del checkpoint descargable; fuente/detalle en QA.md raíz. Pruebas con adaptadores no son navegador nativo, eficacia psicológica ni certificación de seguridad/AA.

| Área | Evidencia | Pendiente |
| --- | --- | --- |
| Criptografía | Web Crypto nativo Node: GCM/tamper/clave/Unicode/vacío/tamaño/IV | Auditoría independiente/dispositivo |
| Migración/importación | Store real con IDB determinista, CAS/rollback/legacy | Crash, locking/quota/descarga reales |
| Router/Focus | Callbacks reales, historia y enteros1–180 | Navegador/recarga/teclado |
| Respirar/audio | Efectos reales + relojes/AudioContext controlados | Sonido/latencia/tabs físicos |
| Espejo | Handlers/adaptadores + fetch sintético, consentimiento/cancelación | HTTP/cloud/provider/model/safety real |
| PSS | Cálculo/versiones/guardas sintéticas; PENDING_PERMISSION | Acuerdo/protocolo; no administración |
| PWA | SW VM + ports/caches controlados, metadata/PNG/build | Instalación/modo avión/update/evicción |
| Performance | Bytes/gzip del artefacto, presupuesto automatizado | LCP/CLS/INP/CPU/FPS/memoria |

Navegador/servidor de Work bloqueados antes de validar; no se eludió ni reintentó. Producción intacta y sin llamadas/gastos de IA externos. Sin datos reales en código. Las notas siguientes son historia de otra versión y no acreditan la actual.

---

# Revisión de ÍTACA · septiembre de 2026

## Evidencia de ejecución

- TypeScript: comprobación `tsc --noEmit` sin errores.
- Misiones: creación, finalización y persistencia después de recargar verificadas en navegador.
- Proyectos: creación con subtareas, cambio de progreso y selección automática del proyecto al entrar en Focus verificados.
- Focus: sesión real de un minuto finalizada automáticamente y registrada como 01:00, sin acelerar el reloj.
- Memoria: materia, concepto y flashcard creados; respuesta revelada, repaso registrado y próxima fecha actualizada. Conexión entre dos aprendizajes guardada.
- Diario: recuperación del borrador después de navegar y persistencia de una entrada después de recargar verificadas.
- Composición: revisadas mediante capturas la portada, Focus, proyectos, memoria, observatorio y tamaños de 390, 768 y 1024 píxeles.
- Renderizador: shaders GLSL compilados y enlazados en GLES 2 de software; geometría real renderizada fuera del navegador para inspección. Core inicial: 32 llamadas de dibujo en la captura de referencia del motor.
- Microjuego de atención: aciertos, actualización de puntuación y cierre con guardado comprobados.
- Service worker: prueba controlada de instalación, activación, navegación online y offline, activo cacheado, exclusión de rutas privadas y disponibilidad de la caché mediante `scripts/verify-pwa.mjs`.

## Correcciones realizadas durante la revisión

Se corrigieron una expresión GLSL inválida, interpolación de geometría, normales con escalas no uniformes, un error de hidratación por hora local, colisión del Core con el texto en tableta, títulos de portales con contraste insuficiente y conservación del proyecto al iniciar enfoque. Se añadieron transiciones de profundidad a Essential y representaciones de materias y proyectos terminados. Se redujeron actualizaciones de interfaz sin un temporizador activo.

## Límites de la evidencia

El navegador de revisión no ofrece WebGL y su origen interno es HTTP. La inspección de la interfaz usa Essential; la aceleración GPU, instalación standalone y lanzamiento offline deben verificarse posteriormente en dispositivos reales con HTTPS. Las pruebas controladas del service worker no sustituyen esa prueba física. No se afirma cumplimiento certificado de WCAG, una puntuación Lighthouse ni superioridad medida frente a otro producto.

Los datos de prueba pertenecen al navegador de revisión y no se incluyen en el código ni se precargan en la publicación. La aplicación empieza con un mundo vacío y una semilla propia.
