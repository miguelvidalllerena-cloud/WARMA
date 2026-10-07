# WARMA instrument permissions

Revisión: 2026-10-04. PSS-10 tiene **acceso obtenido** y estado **PENDING_PERMISSION**. Los archivos adjuntos no incluyen un acuerdo de licencia. No se han publicado los cuestionarios, traducción, instrucciones, tablas ni el PDF del manual en Git, dist, documentación o checkpoints.

## Paquete PSS-10 recibido

El ZIP original contiene únicamente el cuestionario DOCX y el manual PDF; sus bytes coinciden con los archivos individuales recibidos. Identificación: PSS-10 — Spain/Spanish — versión de 10 Oct 2024, `PSS-10_AU2.0_spa-ES_10OCT2024`. Scoring: Version 2.0, March 2023. El cuestionario reserva derechos de RST Assessments, LLC (2022); el manual reserva derechos de Mapi Research Trust (2023), prohíbe reproducción sin permiso escrito y pide contactar a Mapi antes de usar el cuestionario en un estudio.

El usuario informa que obtuvo el paquete desde ePROVIDE para un proyecto educativo, no financiado, con administración electrónica mediante WARMA. Ese dato se registra como declaración de acceso, **no como acuerdo verificable**. No se ha inspeccionado una confirmación específica de esos derechos ni su alcance.

| Aspecto | Evidencia actual | Estado |
| --- | --- | --- |
| Acceso al paquete | Archivos oficiales e identidad de versión verificados | Obtenido |
| Administración electrónica por WARMA | Declaración del flujo del usuario; falta acuerdo/confirmación aplicable | Pendiente |
| Uso con estudiantes menores / contexto COAR | Falta revisión del protocolo institucional y condiciones del acuerdo | Pendiente |
| Redistribución de textos en GitHub, JavaScript público o ZIP de código | No se aportó un permiso escrito con ese alcance | Pendiente; textos excluidos |
| Traducción es-ES utilizada | Versión recibida inspeccionada; no se atribuye a otra adaptación | Identificada; derechos de uso pendientes |
| Uso en Perú | No se confunde Spain/Spanish con validación en adolescentes peruanos | Evidencia local insuficiente |

SHA256 cuestionario: `20ddd425c10fb25825d0a2db471f3a59862b3dfd6d271cadfe3382929154931c`. SHA256 scoring: `fe2d798f7463eb753ba9a4cfe54d883a3f949799fea50661b57bae2145c2c218`. Sólo se conservan identidad y metadatos en código; los originales permanecen como adjuntos privados fuera del repositorio.

## Estados y controles

`AUTHORIZED` exige evidencia verificable para la administración concreta; `PENDING_PERMISSION` indica un permiso no acreditado; `RESEARCH_ONLY` no autoriza administración en WARMA; `DISABLED` impide administración. El acceso descargable no activa ninguno de los permisos.

El motor distingue administración electrónica de distribución pública. Una entrega `public-bundle` requiere permiso de redistribución adicional. Una entrega `controlled` requeriría proveedor privado autorizado, control de acceso y versión íntegra revisada. El interfaz `ProtectedInstrumentContentProvider` es sólo una frontera preparada: **no existe un endpoint ni un proveedor configurado**. No se han cargado ítems en frontend, secretos, SW, caché ni IndexedDB.

No se pretende ocultar ítems mediante ofuscación: todo texto entregado a un navegador puede ser leído por su receptor. La entrega controlada debe estar cubierta por el acuerdo y restringirse a receptores autorizados; no sustituye una licencia. Offline de ítems protegidos requeriría revisar también permiso de almacenamiento local. Los flags de un respaldo JSON no pueden habilitar administración.

## Siguiente evidencia necesaria

Recibir el acuerdo o confirmación de ePROVIDE/Mapi aplicable a WARMA y verificar proyecto, administraciones, población, idioma, versión, adaptación electrónica, alojamiento, offline, plazo y derechos de distribución. No se han enviado solicitudes ni contactado a terceros. ASQ-14 y los demás instrumentos anteriores siguen pendientes; obtener PSS-10 no concede sus derechos.

Fuente primaria de permisos y ausencia de puntos de corte: [Laboratorio de Cohen, CMU](https://www.cmu.edu/dietrich/psychology/stress-immunity-disease-lab/scales/index.html). Las restricciones del paquete suministrado prevalecen sobre su disponibilidad en sitios alternativos. Esta revisión documenta lo observado; no afirma un permiso concedido ni una decisión jurídica sobre un acuerdo que no se recibió.

El cifrado local opcional no concede derechos de administración/distribución. No se incorporó contenido protegido, proveedor ni flags autorizados. El bloqueo legal y el límite de población siguen intactos.

Checkpoint07 conserva todos los bloqueos. Endpoint /api/espejo es de reflexión opcional, no entrega instrumentos y no permite incluirlos en su contrato. Readiness PWA no acredita permiso de almacenamiento offline de ítems; éstos no existen en precache/código. No hubo contacto a terceros, acuerdo nuevo ni permiso activado.


## Continuación y onboarding — 2026-10-07

Se integró el módulo en el nuevo sistema visual de WARMA: introducción breve, preguntas de una en una en la rama autorizada, progreso accesible, omisión, resultado sin categorías clínicas, repetición voluntaria y borrado específico de respuestas/resultados. Las transacciones y el cifrado existentes siguen guardando el estado completo; no se agregó ningún endpoint ni transmisión de estas respuestas.

En esta continuación sólo se adjuntaron el ZIP de referencias visuales y el texto de misión. No se aportaron nuevamente el DOCX/PDF protegidos ni un acuerdo de autorización. Los hashes y metadatos previos se conservan como evidencia histórica; no sustituyen el cotejo del texto original ni una licencia.

Estado del release: `PSS10_ENABLED=false`. Los fixtures de pruebas son sintéticos y no contienen ítems ni etiquetas oficiales. El scoring existente se conserva: 0–40, inversión de los ítems 4/5/7/8 y protocolo de faltantes del paquete registrado. Pruebas adicionales cubren repetición explícita y borrado persistente sin afectar Bitácora ni datos académicos.

Para activar faltan: el acuerdo verificable de uso electrónico aplicable al proyecto y su población; su alcance sobre distribución pública de ítems en GitHub/bundles y caché offline; el ejemplar autorizado de la versión es-ES y su manual para cotejar redacción, instrucciones y respuestas; y el QA real del instrumento habilitado (teclado/lector de pantalla, persistencia/cifrado, offline y captura de tráfico sin respuestas fuera del dispositivo). Si los derechos no permiten distribución pública, el contenido no puede añadirse al bundle público; no se creará un proveedor remoto como atajo sin autorización del usuario.

El resultado permanece separado de los resultados académicos históricos, de los rankings y de los logros. No se introducen baremos, diagnósticos, predicciones psicológicas ni inferencias de crisis a partir de la puntuación.
