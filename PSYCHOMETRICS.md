## Actualización de protección local · 2026-10-04

El cifrado opt-in AES-GCM ya está conectado al snapshot completo, incluidos los espacios psicométricos/contextuales preparados. Legacy permanece legible hasta activación explícita. No modifica cálculo, versiones, población ni `PENDING_PERMISSION`, y no permite recoger ítems protegidos. Los párrafos históricos que describen cifrado pendiente corresponden al bloque 02. Arquitectura/recuperación/pruebas actuales: SECURITY.md y QA.md.

# WARMA estrategia psicométrica

Actualización PSS-10: 2026-10-04. Se continúa desde `06d11d6`, sin publicar, sin perder ASQ-14 ni los respaldos. **PSS-10 es ahora el instrumento prioritario preparado; ninguno está habilitado para administración.** El paquete oficial recibido permite verificar versión y scoring, pero no incluye un acuerdo de licencia aplicable a WARMA.

## Decisión actual

Paquete ePROVIDE / Mapi Research Trust: PSS-10 — Spain/Spanish — versión de 10 Oct 2024, `PSS-10_AU2.0_spa-ES_10OCT2024`. El manual es Scaling and Scoring Version 2.0, March 2023. DOCX/PDF coinciden byte por byte con el ZIP original. Se verificaron diez preguntas numeradas y ordenadas, opciones 0–4, instrucciones y copyright. El periodo de referencia del DOCX es **últimos 30 días**; no se reemplaza por una versión informal encontrada en Internet.

Estado legal: **PENDING_PERMISSION**. Acceso obtenido no equivale a administración electrónica ni redistribución pública acreditadas. El manual exige contacto previo y reserva su reproducción. Falta el acuerdo específico; no se han copiado los ítems, opciones, instrucciones ni documentos al repositorio o a los builds/checkpoints. Metadatos, hashes y la decisión de derechos en `INSTRUMENT-PERMISSIONS.md`.

PSS-10 mide estrés percibido global; no sólo académico. El paquete permite una puntuación global; eso no demuestra por sí solo una estructura factorial o validez en COAR. Spanish for Spain no es una validación en adolescentes peruanos. No se transfieren coeficientes de Freitas (universitarios), de EPGE-13 peruana o de otra traducción a este paquete. Falta revisión institucional de población, comprensión, consentimiento/asentimiento y protocolo. No se atribuye eficacia preventiva demostrada a la PWA.

## Corrección oficial implementada

`lib/psychometric-engine.ts` desacopla aritmética, versiones y permisos. `lib/pss10-instrument.ts` registra instrumento/idioma/versiones/copyright/referencias y `lib/pss10-store.ts` separa operaciones locales. ASQ-14 conserva su motor, esquema y repositorio previos. Su availability ya no depende del candidato seleccionado de otro instrumento.

Diez valores enteros 0–4. Se invierten 4, 5, 7 y 8 mediante 4 menos la respuesta. Se suman los diez valores corregidos para obtener 0–40. Con uno o dos faltantes se calcula la suma corregida disponible, se divide entre el número de respuestas válidas y se multiplica por 10. Con más de dos faltantes no hay puntuación. Las marcas múltiples cuentan como faltantes, incluso dos marcas iguales. Una marca única se conserva como respuesta; ausencia, null o cero marcas son faltantes. El valor **0 es una respuesta válida**, nunca una omisión.

Ejemplo sintético con nueve respuestas corregidas cuya suma es 33: total 33/9 × 10. Se conserva el valor numérico sin redondear ni completar el ítem ausente. La presentación visual puede abreviar decimales; no altera el valor guardado. No hay subescalas, puntos de corte, categorías de estrés, diagnóstico, percentiles ni comparaciones clínicas. Una puntuación mayor indica mayor estrés percibido dentro de los límites de la escala.

El motor rechaza valores inválidos, decimales de respuesta, claves ajenas, versiones distintas, más de cinco marcas por ítem y protocolos incompatibles. El registro se recalcula desde las respuestas: total, faltantes, número de respuestas y prorrateo inconsistentes se rechazan. La validez aritmética **no concede autorización de uso**. Resultados de PSS-10 no se admiten en el snapshot real mientras esté bloqueada.

## Experiencia y datos locales

Bienvenida → privacidad → evaluación inicial → perfil funcional → WARMA personalizada conserva el diseño editorial y nudo. Evaluación presenta PSS-10, diez slots informativos, periodo, duración estimada de diseño 2–4 minutos y «Ver respaldo científico». No se muestran preguntas ni se recogen respuestas por falta de permisos. Las preferencias siguen voluntarias, reanudables y separadas. El perfil activo no se hace pasar por puntuación psicológica.

El branch de interfaz y repositorio preparado permite respuesta única, volver, omitir, ocho respuestas mínimas, guardar/retomar y descartar sólo la evaluación. Su funcionamiento de callbacks se prueba con **fixtures sintéticas y una sustitución de autorización exclusiva del test**, sin administrar la escala. No se declara una evaluación clínica o jurídicamente autorizada.

La salida preparada muestra total, fecha y registros de la misma versión. Con un único registro no se afirma cambio. Dos registros muestran sólo una diferencia numérica; no demuestran mejoría, deterioro o efecto de WARMA. El perfil funcional y las recomendaciones siguen las preferencias/check-in real, no categorías inventadas a partir de la PSS. «¿Por qué WARMA me recomienda esto?» informa esa lógica. No se añade crecimiento al jardín por responder preguntas ni por revelar texto privado. El nudo mantiene la metáfora de registros explícitos; no visualiza una puntuación que no existe.

Campo aditivo `pss10` junto a `assessment` (ASQ), `contextualDraft` y onboarding. Nombre/versión/almacén de IndexedDB se mantienen; snapshots previos reciben el valor vacío. Borrador y resultados se distinguen por instrumento, versión del documento y versión de scoring. Actualmente es almacenamiento JSON legible; no cifrado, nube, IA ni sincronización. Los tests no utilizan estudiantes reales.

## Tres capas separadas

- Instrumento PSS-10: internacional oficial recibido, scoring verificado y administración pendiente. ASQ-14 y catálogo anterior conservados.
- Módulo Contextual WARMA: preguntas exactas y constancia de revisión aún no recibidas. La etiqueta profesional se reserva para esa versión; revisión no es validación. Se prepara un plan futuro de jueces, claridad/pertinencia/relevancia, V de Aiken documentada, piloto, consistencia y estructura cuando la muestra/protocolo lo permitan; nada de eso se presenta como ejecutado.
- Check-in de carga percibida: Ligera / Intermedia / Alta, energía/prioridad. Registro voluntario del día; no prueba psicológica.

Textos: «Esta evaluación estima estrés percibido dentro de los límites de la escala. No constituye un diagnóstico psicológico.» y «El nudo es una representación visual de tus registros y no una medición clínica.»

## Pruebas y activación pendiente

Cálculo de extremos 0/40, 50 variaciones de un ítem, 121 patrones de omisión, inversión de cada posición, fracciones sin redondeo, múltiples, datos inválidos, progreso, metadatos, permisos y score alterado. Tests de repositorio usan callbacks/transacciones existentes con adaptador determinista para reanudación, rollback, duplicados, roundtrip y conservación. Tests de UI usan hooks controlados para consentimiento, selección 0, omitir, datos sintéticos y bloqueo real. **No son navegador, IndexedDB nativo, administración autorizada ni validación psicométrica de la PWA.**

Para activar: acuerdo verificable con alcance digital/traducción/distribución, protocolo institucional y contenido íntegro revisado. Si no permite distribución pública, usar entrega controlada autenticada y no copiar ítems al frontend público, GitHub, ZIP o SW. La interfaz del proveedor está preparada, pero no hay proveedor/endpoints configurados. No basta cambiar una preferencia o importar un respaldo; tampoco ofuscar JavaScript resuelve derechos. No se enviaron solicitudes a terceros.

Fuente científica/permiso principal: [Laboratorio de Cohen, CMU](https://www.cmu.edu/dietrich/psychology/stress-immunity-disease-lab/scales/index.html). Referencia abreviada: Cohen S, Williamson GM (1988), Perceived stress in a probability sample of the United States, The Social Psychology of Health, pp. 31–67. El scoring y versión exacta se verificaron en los adjuntos privados; no se reemplazaron por otro cuestionario descargable.

## Historia del bloque 02

La sección siguiente conserva la comparación y decisión anterior por trazabilidad. Describe el checkpoint 02, **no el instrumento prioritario de la interfaz actual**, que es PSS-10 preparado y bloqueado. Las referencias siguen siendo útiles, pero no habilitan otras escalas ni transfieren sus propiedades a PSS-10.

## Comparación

| Instrumento / autores | Constructo y población revisada | Confiabilidad y estructura | Perú / adecuación a WARMA | Reproducción digital |
| --- | --- | --- | --- | --- |
| SISCO SV-21 · Arturo Barraza Macías, 2018 | Estrés académico: estresores, síntomas y afrontamiento; 21 reactivos principales. Estudio peruano de Olivas-Ugarte, Morales-Hernández y Solano-Jáuregui (2021): 560 universitarios, 18–50 años. | En Perú: tres factores correlacionados; CFI .929, TLI .920, RMSEA .083, SRMR .061; omega .90/.89/.89. Los autores aconsejan interpretar dimensiones por separado. | Evidencia universitaria; no son baremos de secundaria. Es cercano al constructo académico, pero requiere revisión adolescente. | Manual con reserva de derechos; el estudio peruano solicitó permiso al autor. Autorización digital de WARMA pendiente. |
| PSS-10 · Sheldon Cohen y colaboradores; referencia abreviada Cohen y Williamson, 1988 | Estrés percibido global del último mes. No equivale a estrés académico ni al check-in diario. | Estudio universitario de Freitas, Pattussi y Gonçalves (2025), n=399: alfa >.80, omega >.84; soluciones de dos factores y bifactor. El modelo de dos factores no mostró invariancia entre géneros. | Publicarse en una revista peruana no acredita una muestra peruana. No se verificó en esta revisión una validación de PSS-10 en secundaria COAR. | CMU exige tramitar permisos en MAPI/ePROVIDE; revisar además los derechos de la traducción concreta. No habilitada. |
| PSS-14 · Cohen, Kamarck y Mermelstein, 1983 | Estrés percibido global; versión original distinta de PSS-10 y EPGE-13. | La adaptación de Guzmán-Yacaman y Reyes-Bossio (2018) retuvo **13** ítems: dos dimensiones, alfa .79 y .77. Estos coeficientes no se atribuyen a PSS-14. | EPGE-13: 332 universitarios peruanos de Beca 18, 16–25 años. No constituye evidencia para aplicar automáticamente 14 ítems a secundaria. | Permisos del instrumento y traducción pendientes. La PSS no es diagnóstica ni dispone de puntos de corte clínicos según CMU. |
| ASQ-14 · Blanca, Escobar, Lima, Byrne y Alarcón, 2020 | Estresores cotidianos adolescentes. Estudio español: 561 participantes, 12–18 años. | España: un factor, consistencia interna .85 y test-retest .81. | Artículo peruano de Figueroa-Quiñones, Ipanaqué-Zapata y colaboradores, aceptado 29-09-2026: 982 escolares de 12–17 años; alfa/omega .85, CFI/TLI .96, RMSEA .08, SRMR .07. Invariancia regional parcial; IRT con límites de ajuste. **Sólo se consultó el resumen; versión final anunciada como pendiente.** | CC BY del artículo no resuelve automáticamente los derechos de los ítems de terceros o la versión traducida. Falta revisión de texto final, permisos y protocolo. |
| ESSA · Sun, Dunne, Hou y Xu, 2011 | Estrés educativo adolescente; 16 ítems y cinco componentes. Desarrollo original en China. | Validación griega de Moustaka y colaboradores (2023): 399 escolares, edad media 16.3; alfa total .878. No se importan normas griegas a Perú. | Es específica de educación. En la revisión no se verificó una adaptación española autorizada y validada para secundarios peruanos. | Derechos de escala y traducción sin confirmar; acceso a un artículo no es autorización de incorporación. No habilitada. |
| MSLQ · Pintrich, Smith, García y McKeachie, 1991 | Motivación y estrategias de aprendizaje; manual universitario, n=380. **No mide estrés.** | Instrumento multidimensional de 81 ítems; subescalas modulares. Autorregulación metacognitiva: 12 ítems, alfa .79 en el manual. | Complemento potencial de metacognición. La edad y el contexto universitario no acreditan adecuación a secundaria COAR; versión española y evidencia local pendientes. | Manual disponible en ERIC; confirmar alcance de reproducción/traducción y versión escogida. No asumir permiso irrestricto por estar descargable. |

No se encontró evidencia suficiente para declarar otro instrumento universalmente superior. La revisión es focalizada, no una revisión sistemática exhaustiva ni una evaluación profesional de todos los instrumentos disponibles.

## Decisión del bloque 02

**Instrumento principal habilitado: ninguno. Candidato principal preparado: ASQ-14.** La selección activa exige un permiso verificable; no se cumplió esa condición. No se sustituye esa falta con preguntas inventadas.

La preferencia por ASQ-14 es una decisión de diseño sustentada en la edad, brevedad, versión española estudiada y evidencia peruana reciente. No es una declaración de superioridad universal. Mide estresores cotidianos acumulados, no exclusivamente académicos. SISCO/ESSA serían opciones más específicas si el protocolo exige estrés académico, pero también tienen pendientes de derechos/adaptación. ASQ-14 no permite dibujar tres supuestas subescalas de síntomas, afrontamiento y autorregulación.

La revisión adicional de **AESI**, Ang y Huan (2006), encontró un instrumento de nueve ítems sobre expectativas académicas, dos factores y estudios con 721, 387 y 144 adolescentes asiáticos. El resumen informa fiabilidad/validez, sin coeficientes verificables en el acceso consultado. SAGE muestra acceso restringido y trámite de reutilización. No se confirmó permiso, traducción española ni validación peruana. No se eligió: es un constructo más estrecho y no resuelve esos pendientes. DOI: https://doi.org/10.1177/0013164405282461.

### Derechos y documentación que faltan

- Identificar el titular y obtener confirmación del uso digital de los 14 ítems y las instrucciones, incluyendo el alcance de distribución de código/ZIP y la traducción española exacta. El artículo de 2020 muestra © Psicothema; acceso al PDF no acredita permiso para el cuestionario. Revisar los derechos de la escala ASQ original y de su adaptación, sin asumir que el editor posee todos ellos.
- El artículo peruano aceptado el 29-09-2026 declara CC BY, pero el texto final y los ítems no estaban disponibles en la página consultada. Ese aviso no demuestra autorización de los ítems de terceros.
- Revisar texto final, orden, opciones, periodo de recuerdo, manejo de faltantes y adecuación a 4.º/5.º de secundaria con el responsable institucional. No importar baremos de España ni inventar baremos COAR.
- Documentar protocolo institucional, consentimiento/asentimiento apropiado y consentimiento específico de evaluación antes de habilitar administración. El checkbox de bienvenida sólo permite guardar preferencias.

No se contactó a autores, editores o profesionales en nombre del usuario. `administrationStatus` mantiene los seis instrumentos bloqueados; `assessmentAvailability` exige además contenido íntegro. Los ítems e instrucciones oficiales siguen **ausentes**. No se permite activar la escala desde un respaldo ni desde una preferencia del usuario.

### Corrección preparada, sin administración

`lib/warma-psychometrics.ts` implementa la referencia aritmética publicada por Blanca y colaboradores (2020), página 263: suma de catorce respuestas enteras de 1 a 5; rango 14–70; una dimensión de estresores acumulados. Esa versión no especifica inversión de ítems. No hay normalización a porcentajes, umbrales clínicos, imputación, percentiles, ni inferencia de otras dimensiones.

El motor exige todos los ítems, rechaza valores fuera de rango, decimales, claves ajenas y versiones distintas. La inversión del motor genérico se comprueba con una **fixture sintética**; no se ha implementado una PSS u otra escala de terceros sin permiso. Las pruebas aritméticas usan datos sintéticos, nunca estudiantes reales.

`lib/warma-assessment-store.ts` prepara inicio, respuesta, navegación, finalización y descarte a través de `mutateWorld`. Inicio/respuestas/finalización están bloqueados por permisos. La validación de resultados recalcula desde las respuestas y los rechaza cuando no está habilitada la escala; tampoco admite puntuaciones fabricadas por importación JSON. El interfaz puede mostrar un resultado bruto de una única dimensión cuando se habilite una versión verificada; hoy no genera ninguno.

La vista «Ver recorrido en preparación» muestra 01 / 14 y placeholders numerados. Sólo permite recorrer espacios vacíos, sin controles de respuesta, guardado ni resultado. **No es un test ni una administración abreviada.** La duración 3–5 minutos es una estimación de diseño pendiente de piloto; no se atribuye a una validación científica. El periodo de recuerdo queda pendiente; no se inventa un intervalo.

### Tres categorías independientes

| Categoría | Estado en este checkpoint | Interpretación permitida |
| --- | --- | --- |
| Instrumento psicométrico estudiado | Metadatos, motor de referencia, recorrido y repositorio preparados. Administración bloqueada. | Una sola dimensión ASQ-14 en una versión futura autorizada. Hoy ningún resultado personal. |
| Módulo Contextual WARMA | Metadatos y esquema aislado; sin preguntas activas. Los informes contienen borradores, no una versión revisada identificada. | Información contextual una vez documentada; revisión profesional no equivale a validación psicométrica. |
| Check-in cotidiano | Carga, energía y prioridad opcionales; independiente de ASQ-14. | Preferencias de organización, pausa y reflexión; no estrés clínico, capacidad o riesgo. |

La denominación «Preguntas contextuales revisadas por profesional de psicología institucional» se reserva para la versión documentada. La interfaz aclara que esa versión aún no está disponible. No se ha atribuido esa revisión a los borradores ni se han inventado preguntas para completarlos.

### Primer ingreso y perfil funcional

Cinco escenas mantienen la identidad verde/crema, tipografía editorial y nudo orgánico. Las preferencias se preguntan una a una; pueden omitirse y revisarse. «Guardar y continuar luego» persiste un borrador separado, sin cambiar el check-in, proyectos o Bitácora. Al retomarlo se confirma de nuevo la privacidad. Salir sin guardar conserva el último borrador almacenado; descartarlo es una acción explícita. Guardar el perfil lo sustituye por preferencias completas y elimina únicamente ese borrador.

Como la escala sigue bloqueada, el perfil activo es **funcional y basado en preferencias**, nunca «resultado de la evaluación». Las elecciones omitidas permanecen nulas. La hora del dispositivo puede acortar una propuesta nocturna; no es una medida psicológica. El check-in de hoy tiene prioridad sobre preferencias de bienvenida. Concentración confirma duración antes de comenzar y ninguna entrada inicia automáticamente un temporizador.

Inicio, Camino, Concentración, Pausas, Espejo y Jardín muestran «¿Por qué me recomienda esto?». No se usa IA ni una puntuación inexistente para personalizar. El nudo usa la carga explícita actual o inicial, distinguidas en su rótulo; la ausencia de registro no se sustituye por un diagnóstico. El jardín crece con acciones/pausas reales; bienvenida, respuestas y textos no otorgan recompensas.

Textos visibles:

> Esta evaluación estima aspectos relacionados con el estrés percibido/académico dentro de los límites del instrumento. No constituye un diagnóstico psicológico.

> El nudo es una representación visual de tus registros, no una medición clínica.

### Persistencia y futura protección

Campos aditivos `onboardingDraft`, `assessment` y `contextualDraft` en el snapshot existente. Respaldos antiguos reciben defaults y conservan sus datos. No cambia nombre/version/almacén de IndexedDB. El repositorio de evaluación separa dominio y almacenamiento para poder introducir protección posteriormente; **todavía es JSON legible, sin cifrado**. No hay transporte de respuestas, IA, nube o sincronización. Exportación JSON completa sigue siendo privada, no un dataset anonimizado.

### Comprobaciones y alcance

Pruebas de referencia: extremos 14/70, total intermedio, 70 variaciones individuales, inversión/mean de fixture sintética, faltantes/decimales/claves/versiones, progreso y todos los bloqueos. Flujo real de callbacks y transacciones existente con adaptador determinista: consentimiento, doble evento, guardado/reanudación, fallo, datos previos, omisión, no recompensas y entrada de cinco minutos. Canvas: geometría finita, movimiento reducido, DPR, pestaña oculta y limpieza.

La semántica y restricciones CSS se comprueban en fuente; **no equivalen a QA visual/teclado/IndexedDB nativos**. Se conserva la limitación del navegador de Work y no se elude. Detalles y comandos en `QA.md`.

## Fuentes primarias consultadas

1. Barraza Macías (2018), manual SISCO SV-21: https://www.ecorfan.org/libros/Inventario_SISCO_SV-21/Inventario_sist%C3%A9mico_cognoscitivista_para_el_estudio_del_estr%C3%A9s.pdf
2. Olivas-Ugarte et al. (2021): https://www.scielo.org.pe/scielo.php?pid=S2307-79992021000200001&script=sci_arttext — DOI 10.20511/pyr2021.v9n2.647.
3. Laboratorio de Cohen / CMU, permisos y límites PSS: https://www.cmu.edu/dietrich/psychology/stress-immunity-disease-lab/scales/index.html — referencias originales de 1983 y 1988 enlazadas allí. Los coeficientes originales detallados no se reextrajeron de los PDF escaneados en este bloque.
4. Freitas et al. (2025): https://revistaliberabit.edu.pe/index.php/Liberabit/article/view/1047 — DOI 10.24265/liberabit.2025.v31n1.1047.
5. Guzmán-Yacaman y Reyes-Bossio (2018): https://www.scielo.org.pe/scielo.php?pid=S0254-92472018000200013&script=sci_arttext — DOI 10.18800/psico.201802.012.
6. Blanca et al. (2020): https://reunido.uniovi.es/index.php/PST/article/view/17024 — DOI 10.7334/psicothema2019.288; PDF original https://www.psicothema.com/pdf/4601.pdf, especialmente p.263 para corrección.
7. Figueroa-Quiñones et al. (2026), resumen aceptado: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1978642/abstract.
8. Sun et al. (2011): https://journals.sagepub.com/doi/abs/10.1177/0734282910394976.
9. Moustaka et al. (2023), resumen de autores: https://pubmed.ncbi.nlm.nih.gov/36832421/ — DOI 10.3390/children10020292.
10. Pintrich et al. (1991), manual original, especialmente pp. 23–24: https://files.eric.ed.gov/fulltext/ED338122.pdf.

11. Ang y Huan (2006), AESI: https://journals.sagepub.com/doi/10.1177/0013164405282461 (resumen/editorial; texto íntegro restringido).

No se enviaron solicitudes de permiso en nombre del usuario ni se contactó a terceros.

## Cierre master · 2026-10-05

Los bloques de AES-GCM opt-in, Espejo endpoint y PWA no habilitan escalas. PSS permanece PENDING_PERMISSION; no resultados personales ni envío a proveedor. El contrato Espejo rechaza campos PSS/journal; defaults locales y tests sólo sintéticos. La ficha y motor no acreditan eficacia o validación COAR. Arte, check-in y nudo conservan su papel expresivo/autorreportado, sin nuevas dimensiones clínicas. Se requiere acuerdo/protocolo antes de cualquier administración.
