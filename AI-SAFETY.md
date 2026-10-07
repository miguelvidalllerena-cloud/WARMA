# WARMA · Espejo y límites de IA

Estado: **endpoint, adaptadores y UI implementados; generación remota deshabilitada y NO VERIFICADA**. No existe proveedor, secreto ni binding configurados y no se hicieron llamadas/gastos externos. La guía local de cuatro preguntas por ruta sigue completa. El modo remoto, si se configura y revisa, usa cinco etapas: escuchar, clarificar, preguntar, priorizar y próximo paso.

## Arquitectura y controles

Frontend → `/api/espejo` → AIProvider → OpenAI Responses o Anthropic Messages. La URL/proveedor/modelo nunca se aceptan desde el texto del estudiante; endpoints fijos y secreto sólo en bindings del Worker. No SDK ni dependencia nueva. GET sólo devuelve disponibilidad/destino/política, sin textos ni claves. POST y respuestas llevan no-store/private; SW excluye `/api`.

Cada envío requiere revisar un snapshot del texto, la pregunta anterior y la etapa; casilla de autorización se reinicia cada vez. Modificar el texto detrás del diálogo no cambia el payload ya revisado. El request estricto permite sólo etapa 0–4, texto 1–1500 caracteres, última pregunta ≤260/null y versión/aceptación/proveedor de consentimiento. No añade nombre, ID de mundo, Bitácora, PSS, historial ni conversación completa. No se guarda automáticamente una conversación; el último paso se puede guardar deliberadamente en Bitácora y sigue la protección local activa.

El endpoint exige origen de la app, JSON, header/versión de consentimiento y proveedor actual. Origin/header previenen CSRF de navegador, **no autentican personas ni demuestran consentimiento legal**. Un cliente programático puede declararlos. El flag de revisión del operador tampoco acredita permisos institucionales: son evidencia/protocolo externos pendientes.

Guardas: binding de rate limit obligatorio, máximo 700 tokens, cuerpo de entrada ≤8000 bytes, respuesta proveedor ≤32000, JSON/esquema/límites de texto y heurística secundaria de contenido. Timeout 12 s servidor/15 s UI, cancelación y limpieza; sólo HTTP 429 admite un reintento tras 400 ms (máximo dos intentos, cada uno pasa por límite). Fallo, negativa, JSON inválido, contenido rechazado o cuota activan **guía local identificada como predefinida**. Offline no se presenta como generación remota. Cancelar es best effort: una petición ya procesada por el proveedor puede tener coste aunque el usuario cierre la vista.

OpenAI pide `store:false`; eso no equivale a cero retención de seguridad/proveedor ni anonimato. Anthropic Messages no se describe como libre de retención. Revisar contrato vigente y finalidad/destino/edad antes de activar; enlaces de privacidad visibles. El alojamiento puede ver conexión/IP y request; el binding usa IP transitoria para cuota (compartida en un COAR/NAT) y un contador general. No se escriben logs de textos o claves por la app; políticas del alojamiento/proveedor siguen externas.

## Activación todavía pendiente

Variables/bindings exclusivamente servidor:

- `AI_REMOTE_ENABLED`: habilitación explícita; no configurada.
- `WARMA_AI_PROVIDER`: openai o anthropic; no configurado.
- `WARMA_AI_MODEL`: modelo compatible seleccionado por el operador; no se elige uno de pago durante este trabajo.
- `WARMA_AI_API_KEY`: secreto de servidor; nunca NEXT_PUBLIC/VITE ni Git.
- `WARMA_AI_POLICY_REVIEWED`: declaración tras revisar población/condiciones/protocolo; no prueba de aprobación.
- `WARMA_AI_LIMITER`: binding Rate Limiting obligatorio; no se creó ningún recurso cloud.

Cloudflare Rate Limiting es por ubicación y aproximado: **no es contador mundial, autenticación ni techo de gasto**. Antes de habilitar públicamente faltan control central de uso/coste, condiciones apropiadas para menores, revisión institucional, piloto supervisado de respuestas y prueba operativa del binding/proveedor. No se afirma que el endpoint esté aprobado para producción. `.dev.vars*` y `.env*` quedan ignorados; este checkout no contiene valores reales. Núcleo local no exige una cuenta y no se ha añadido sincronización.

## Seguridad del lenguaje

El prompt restringe a metacognición educativa y preguntas breves; no diagnósticos, tratamiento, scoring ni inferencia PSS. La UI trata toda salida como texto, no HTML/acciones. `needsHumanSupport` y el filtro de salida son heurísticas limitadas, con posibles omisiones y falsos positivos; no triaje ni vigilancia. Acceso a apoyo humano siempre visible e independiente; ninguna alerta a terceros. No afirmar detección fiable de peligro ni precisión/eficacia clínica. Un esquema JSON válido no garantiza una respuesta correcta o segura. Evaluación supervisada con modelos reales sigue pendiente.

PSS-10 no se transmite ni se administra. El cifrado opt-in protege sólo el almacenamiento local/respaldos; **no evita transmitir el texto explícitamente autorizado ni impide al proveedor leerlo**. No se envía la frase de cifrado.

## Evidencia

`verify-mirror.mjs` ejecuta contratos/cliente/handler/route/providers con Request/Response nativos y fetch sintético: configuración ausente, rechazo de campos/datos excesivos, consentimiento/origin, binding/cuota, cambio de proveedor, DTOs de ambos proveedores, límites, JSON/contenido, reintento y cancelación/deadline/fallback. `verify-mirror-ui.mjs` prueba callbacks/efectos reales con hooks controlados: snapshot revisado, autorización por turno, doble clic, cancelación/salida, no auto-save y apoyo humano sin transmisión. No son llamadas a un modelo ni pruebas nativas de modal/teclado.

Referencias primarias: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [OpenAI Under-18 guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance), [Anthropic Messages](https://platform.claude.com/docs/en/api/messages/create), [Cloudflare secrets](https://developers.cloudflare.com/workers/configuration/secrets/) y [Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/). Sin promesa de privacidad absoluta, seguridad clínica o consentimiento institucional obtenido.
