# WARMA · privacidad actual

La aplicación no necesita una cuenta. Sus registros viven en el perfil del navegador de este dispositivo. El cifrado local es opcional: se activa con una frase desde Preferencias. Mientras no lo actives, son legibles. Si lo activas, el snapshot y los nuevos respaldos se guardan cifrados; la app los descifra en memoria mientras está desbloqueada.

## Datos locales

Preferencias visuales y nombre opcional; carga, energía y prioridad del día; tareas/proyectos; conocimientos; Bitácora y borrador; sesiones/temporizador; pausas y arte local; historial de acciones. La bienvenida guarda versión de información de privacidad, fecha y elecciones opcionales. Esto acredita el permiso funcional de guardado, no consentimiento para investigación, atención clínica o envío a IA.

El borrador de bienvenida permite continuar más tarde y puede descartarse sin eliminar otros registros. Los espacios `assessment`, `pss10` y `contextualDraft` están preparados para datos locales; ninguna evaluación ni cuestionario contextual está habilitado. No se han recogido respuestas de escalas en este bloque.

Las preferencias omitidas permanecen nulas; no generan una puntuación psicológica. El cálculo preparado PSS-10 permite hasta dos faltantes y prorratea el total según el manual sin inventar una respuesta al ítem. Actualmente no se administra. Sólo si se eligieron carga, energía y prioridad se incorpora un check-in del día. No se otorgan puntos por revelar contenido privado.

## Qué sale del dispositivo

Por defecto los módulos no transmiten registros a un modelo/nube. El nuevo modo opcional de Espejo sólo transmite texto revisado + última pregunta + etapa, tras consentimiento por envío, si un operador configura el servidor. Actualmente no está configurado ni se hicieron envíos. Nunca se añaden automáticamente Bitácora, evaluación, check-in, nombre o historial. El respaldo JSON contiene registros privados: ciphertext si la protección está activa, contenido legible en modo legacy. Compartirlo es una acción posterior fuera del control de la app. Un respaldo cifrado requiere su frase; WARMA no puede restablecerla. Las descargas antiguas sin cifrado siguen siendo legibles y quedan bajo control del usuario.

Cargar una página produce las solicitudes normales al alojamiento; éste puede recibir datos de conexión como dirección IP y URL según su configuración. Los enlaces a fuentes académicas y apoyo humano abren servicios externos. No se usa la ausencia de envío de textos como promesa de anonimato absoluto frente al proveedor o al dispositivo.

## Control del usuario

- Omitir bienvenida y preguntas, cerrar sin guardar y revisar preferencias después.
- Exportar/importar un respaldo desde Preferencias; el respaldo completo no es una exportación anonimizada de investigación.
- Usar controles existentes de eliminación y reinicio de forma explícita. No se eliminaron datos reales durante este trabajo.
- Recordatorios internos configurables; no se ha solicitado permiso de notificaciones del sistema ni de Push.

El modo de IA tiene consentimiento funcional por envío, finalidad/destino/payload visibles y cancelación/minimización. Investigación o sincronización futuras requieren consentimientos propios. No habilitar esos flujos reutilizando el consentimiento local. Para estudios con menores, documentar el protocolo institucional y los permisos/asentimientos apropiados antes de recoger respuestas de escalas.

PSS-10 no envía respuestas, resultados, Bitácora ni identificadores a servicios de IA/nube. La exportación JSON completa contiene datos privados, no es telemetría anonimizada. En este bloque sólo se usan fixtures sintéticas en pruebas; no se han recogido respuestas de estudiantes. Los documentos oficiales no se redistribuyen con la aplicación.

## Cifrado y control de acceso local

Activar protección es voluntario y exige conservar un respaldo cifrado verificable y la frase fuera del navegador. No crea una cuenta ni envía el secreto. Bloquear/recargar retira las vistas privadas y exige desbloquear; una frase perdida no puede recuperarse desde WARMA. El cifrado no impide a un script o extensión comprometidos leer la memoria durante el uso. La revisión técnica y los límites de recuperación están en SECURITY.md. No se han migrado datos reales en este entorno.

La autorización funcional del Espejo no acredita consentimiento/asentimiento institucional para estudios con menores. El alojamiento/proveedor pueden procesar conexión y texto autorizado según sus condiciones; AES local no cifra ese texto frente al proveedor. Datos de prueba sintéticos, sin llamadas reales. Ver AI-SAFETY.md para límites, cuotas por ubicación y activación pendiente.
