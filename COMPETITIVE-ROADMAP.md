# Estado posterior del master · checkpoint07

Cifrado opt-in, pruebas críticas Respirar/audio, endpoint Espejo opcional inactivo y readiness PWA están implementados después de este roadmap histórico; consultar WORK-HANDOFF/QA/JURY-EVIDENCE. Sin nube ni rediseño no inspeccionable. Permisos/protocolos/modelo/dispositivo nativo siguen pendientes; no repetir los bloques cerrados. Las prioridades anteriores se conservan a continuación como historial.

# WARMA · diez cambios de mayor impacto

Orden razonado para la primera ejecución: identidad conservada, base recuperable, evidencia antes de medición. Impacto y viabilidad son estimaciones de ingeniería, no puntuaciones obtenidas ante el jurado.

| Orden | Cambio | Impacto | Viabilidad | Riesgo | Dependencias / puerta de salida |
| --- | --- | --- | --- | --- | --- |
| 1 | Separar escalas, contexto y check-in; referencias verificables | Alto | Alta para catálogo; condicionada para aplicar | Alto si se etiqueta mal; bajo para metadatos | Licencia, versión, población y revisión profesional. Catálogo implementado; escalas bloqueadas. |
| 2 | Inicio voluntario con privacidad y propuesta explicable | Alto | Alta | Bajo | Mantener snapshots, no inferir diagnósticos, no bloquear herramientas. Primer bloque implementado; QA real pendiente. |
| 3 | Corregir el registro de evidencia del estudio | Alto | Alta para auditoría | Bajo al documentar; alto si se inventan datos | Bases originales, consentimientos, cronología y protocolo. Contradicciones registradas en `EVIDENCE.md`. |
| 4 | Precargar app shell y probar offline / actualización | Alto | Alta | Medio | Build reproducible, generación de precache, prueba en modo avión y cambio de versión sin perder borradores. No modificar SW a ciegas. |
| 5 | QA repetible de navegación, teclado, audio y almacenamiento | Alto | Alta parcialmente | Bajo | Navegador permitido, fixtures anónimos, axe y pruebas de dispositivo. Scripts existentes ampliados; limitaciones explícitas. |
| 6 | Protección local opt-in con clave del usuario | Alto | Media | Alto | Modelo de amenazas, derivación de clave, recuperación, exportación y migración reversible. Evitar bloquear datos por pérdida de clave. |
| 7 | Espejo generativo con consentimiento y fallback | Alto | Media | Alto | Endpoint autenticable / límites, proveedor, secreto servidor, contrato de respuesta y coste aprobado. No crear recursos ni enviar textos ahora. |
| 8 | Personalización explicable y revisable | Medio–alto | Alta con registros actuales | Medio | Preferencias explícitas, políticas transparentes y opción de cambio. Resultados de escalas sólo tras requisitos científicos. |
| 9 | Medir y optimizar nudo, jardín y carga inicial | Medio–alto | Media | Medio | CPU/FPS/consumo reales y degradación probada. Adoptar WebGL2/WebGPU sólo si aportan mejora demostrable. |
| 10 | Sincronización opcional y métricas minimizadas | Medio–alto | Media–baja | Alto | Consentimiento separado, RLS, conflictos, outbox, exportación no sensible y costes. No es dependencia para usar WARMA sin cuenta. |

El bloque 1–2 se seleccionó porque aporta coherencia visible y científica sin proveedores, gastos, migraciones destructivas ni reproducción de ítems. La revisión del estudio se adelantó: las contradicciones existentes afectan directamente a la credibilidad de cualquier demostración.

No se propone un instrumento universalmente superior. ASQ-14 es candidato por cercanía de edad y evidencia peruana; SISCO se centra más en estrés académico, PSS en estrés percibido y MSLQ en aprendizaje. La selección final depende del constructo y del protocolo, no de cuál tenga más ítems o más fama.
