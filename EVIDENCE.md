# WARMA · revisión del registro científico

2026-10-04. Se revisó el texto de los informes PDF y DOCX y del cuaderno aportados. Los originales permanecen intactos. Confirmar que una afirmación está escrita no confirma que el estudio ocurrió, ni que sus resultados sean reproducibles.

## Evidencia verificada

- La base del código y los commits de Fase 1 existen; esta rama conserva esa base.
- Hay módulos conectados, almacenamiento IndexedDB y pruebas locales de modelo/build. Alcance y límites en `QA.md` y `ARCHITECTURE.md`.
- Se localizaron las siguientes contradicciones **documentales**. No se recibió una base anonimizada de respuestas emparejadas, protocolo final, permisos del instrumento o registros suficientes para recalcular los resultados publicados en los adjuntos.

## Declaraciones históricas no verificadas

| Tema | Localización en documentos aportados | Inconsistencia / límite | Qué hace falta para resolverlo |
| --- | --- | --- | --- |
| Diseño y participantes | `01-INFORME-WARMA.pdf`, resumen p. 2 y metodología p. 5; mismo contenido en `06-Informe_Musytec_Warma_CCSS-Y-HH-1-.docx` | Resumen: cuantitativo cuasiexperimental, 120 alumnos y dos grupos de 60. Método: enfoque mixto, propuesta pre/post de un solo grupo y muestra sin número. | Protocolo efectivamente aplicado, número de elegibles/completos, distribución y criterio de asignación. |
| Cronología | Método del informe: 13-08 a 10-09-2026. Cuaderno: pretest 02-07, intervención 10-07 a 07-08 y postest 14-08. Pie de imágenes: recojo pre/post 19-09. | Son cronologías diferentes; el pie de imágenes no coincide con el pre/post narrado. | Registros fechados originales y explicación de qué corresponde a desarrollo, pilotaje, levantamiento y revisión posterior. |
| Orden del cuaderno | Asiento 01: 12-08; asiento 02: 28-05; periodo declarado agosto–septiembre | El orden y el periodo no coinciden con las entradas anteriores. | Precisar si fue transcripción retrospectiva; conservar trazabilidad sin alterar fechas para aparentar continuidad. |
| Estrés PSS | Resumen y cuaderno: 38.42 → 21.15, reducción 44.9%, p < .001 | Hay cifras agregadas; no se puede reproducir la prueba sin pares individuales y dispersión. La cuenta porcentual por sí sola no valida una intervención. | Versión usada, ítems invertidos, faltantes, datos emparejados anonimizados y análisis reproducible. |
| Etiquetas de estrés | Cuaderno, asiento 04: «estrés alto», «diagnóstico confirmado» y más del 80% | Las etiquetas diagnósticas contradicen el propósito no clínico. CMU indica que PSS no tiene puntos de corte diagnósticos. No hay criterio documentado para el 80%. | Revisar lenguaje con el profesional responsable y documentar el criterio, sin inventar umbrales. |
| Métrica MSLQ | Informe y cuaderno describen promedio de 12 ítems, escala 1–7; resultados 28.34 → 42.54 | Los valores no caben en un promedio 1–7. Podrían ser sumas, pero no se debe asumirlo. | Algoritmo real, subescala, inversión de ítems y unidad de resultado. La versión original requiere revisar sus reglas. |
| Significación y causalidad | Cuaderno: t=11.5, gl=59 y conclusión sobre probabilidad de azar; conclusiones de eficacia | No se aportaron datos para recalcular t. Un p-valor no es la probabilidad de que el efecto sea azar; el diseño y las limitaciones deben estar definidos antes de concluir causalidad. | Análisis supervisado, supuestos, diferencias entre grupos, tamaño del efecto e incertidumbre. No corregir cifras sin datos. |
| Cifrado / privacidad | Cuaderno, asiento 03: datos «encriptados» | El código actual guarda objetos legibles en IndexedDB y exporta JSON sin cifrar. Almacenamiento local y Service Worker no son cifrado. | Separar versión histórica documentada de versión actual; implementar y probar protección antes de afirmarla. |
| Offline universal | Cuaderno: 100% de datos guardados y funcionamiento sin conexión | No se aportaron registros de dispositivos/caché que permitan verificar ese 100%. La prueba real actual quedó limitada por Work. | Matriz de dispositivos, preparación inicial, pérdida de red, actualización y persistencia de borradores. |
| IA y revisión institucional | Informes: arte IA; nuevo encargo: preguntas revisadas con psicólogo | Arte y Espejo actuales son locales/predefinidos. Hay borradores de preguntas, pero no se identificó la versión de la revisión institucional. | Versiones de app e instrumento, constancia de revisión y permisos; distinguir implementación actual de propuesta. |

No se trasladaron cifras históricas de eficacia a la interfaz, al perfil funcional ni a una presentación de resultados verificados. No se modificaron respuestas, informes o fechas de los originales.

## Propuesta futura

Antes de un nuevo estudio: fijar objetivo/constructo, instrumento autorizado y versión, protocolo ético institucional, consentimiento/asentimiento, muestra y diseño factibles, medidas repetibles y plan de análisis. Conservar una base pseudonimizada separada de Bitácora; no recolectar narraciones privadas para demostrar uso.

Si las bases históricas no existen o no se pueden recuperar, presentar esas cifras como declaraciones no verificadas y realizar un pilotaje prospectivo honesto. La evaluación de usabilidad y viabilidad técnica puede hacerse separadamente de la eficacia psicológica.

Referencias de contraste: permisos/límites de PSS en CMU y manual original de MSLQ enlazados en `PSYCHOMETRICS.md`. Esta revisión no determina que las declaraciones sean falsas; determina qué todavía no puede sostenerse con la evidencia disponible.
