# WARMA · seguridad local

Actualizado 2026-10-04. Cifrado **opcional, implementado**, sin activar ni migrar registros reales durante este trabajo. Producción intacta. Los perfiles legacy siguen siendo legibles hasta que su usuario activa la protección desde Preferencias; no se afirma que todas las instalaciones ya estén cifradas.

## Implementación

`CryptoService` usa Web Crypto nativo: AES-256-GCM, tag de 128 bits, IV aleatorio de 96 bits por escritura, sal aleatoria de 128 bits y PBKDF2-HMAC-SHA256 de 600 000 iteraciones. La clave derivada no es extraíble y permanece sólo en memoria. No hay clave hardcodeada, contraseña persistida, clave en localStorage/IndexedDB ni recuperación remota. Se usa la frase literalmente, sin recortar ni normalizar Unicode. Mínimo 12 caracteres; se aconseja una frase larga y única conservada fuera del navegador.

Formato `warma-vault`, versión criptográfica 1, independiente de schema 1 del mundo. AAD autentica versión, algoritmo, tag, dominio `world/current`, vaultId, revisión aleatoria, KDF/sal e IV. El parser rechaza versiones desconocidas, campos extra, parámetros KDF arbitrarios, base64 no canónico y tamaños fuera de límites. Se limita plaintext a 25 MB y archivos de respaldo a 40 MB. Nuevos IV usan CSPRNG y se comprueban contra los ya emitidos en la sesión; la unicidad entre sesiones/dispositivos es probabilística, no una garantía matemática. Este diseño no está destinado a miles de millones de cifrados bajo la misma clave.

Se cifra el snapshot completo: Bitácora, borrador, reflexiones, check-ins, evaluaciones/contexto preparados, preferencias, proyectos y demás registros. No quedan campos sensibles fuera del sobre. La administración PSS-10 permanece bloqueada y no se han recogido respuestas de estudiantes.

## Activación y migración

1. Crear frase y repetirla; derivar la clave sin guardar el secreto.
2. Leer el original y validar; cifrar y comprobar descifrado/esquema/igualdad. Preparar no escribe en IndexedDB.
3. Descargar un respaldo cifrado y pedir confirmación de archivo y frase guardados. WARMA verifica el contenido, pero no puede confirmar que el navegador guardó físicamente la descarga.
4. Comparar el original dentro de una transacción corta readwrite y reemplazarlo atómicamente. Si otra pestaña cambió los datos, exigir un respaldo nuevo. Cuota/abort dejan el original y la memoria previa intactos.
5. Sólo después del commit usar la nueva clave/snapshot. Se conserva la semilla y el estado legacy validado, con defaults aditivos. No se mantiene una segunda copia plaintext dentro de IndexedDB.

Web Crypto corre **fuera** de las transacciones abiertas. Las escrituras cifradas usan comparación atómica y hasta tres intentos ante concurrencia; las escrituras legacy mantienen la transacción existente. BroadcastChannel envía sólo `updatedAt`. Una pestaña antigua no puede interpretar el sobre como un mundo vacío ni sobrescribirlo silenciosamente. Estos recorridos están probados con un adaptador serial determinista; falta comprobar locking/durabilidad reales de cada navegador y una interrupción física del proceso.

Bloquear desmonta las vistas privadas, limpia el snapshot visible y descarta la referencia a la clave. Recargar/reabrir exige la frase; `pagehide` bloquea también el retorno por bfcache. Un guardado que ya alcanzó el commit puede terminar como ciphertext durante el cierre. No se garantiza borrado de todas las copias del heap, memoria del SO o renderizaciones antiguas.

## Respaldo y recuperación

Cuando hay protección, exportar descarga **el ciphertext comprometido**, incluso estando bloqueado; nunca exporta implícitamente su plaintext. Importar un respaldo cifrado autentica y valida antes de reemplazar. Si el espacio está desbloqueado y protegido conserva su frase actual al importar; un espacio legacy o bloqueado adopta la frase del respaldo cifrado. Importar JSON legacy en un espacio desbloqueado protegido vuelve a cifrarlo. Estando bloqueado, un JSON legacy no sustituye el archivo: se puede restaurar en otro perfil conservando el original.

Recuperación disponible: respaldo cifrado + su frase, o reabrir con la frase en el perfil existente. **No existe reset de contraseña, escrow ni llave de recuperación independiente.** Sin frase ni respaldo legible, el contenido cifrado es irrecuperable. La UI lo explica antes de activar y ofrece conservar el archivo actual antes de restaurar. Activar no borra respaldos plaintext descargados anteriormente. No hay borrado forense de los restos de la antigua base en disco.

## Threat model

| Protege contra | Control | Límite |
| --- | --- | --- |
| Lectura casual del archivo/base o copia del perfil mientras está bloqueado | Snapshot/respaldos cifrados, clave fuera del almacenamiento | Una frase débil puede sufrir ataque offline. El dispositivo desbloqueado puede capturar el secreto. |
| Alteración del ciphertext, IV o metadatos autenticados | Tag GCM, validación estricta, error explícito y original conservado | No hay mecanismo antirrollback contra reponer una copia antigua auténtica. |
| Frase incorrecta o pérdida de la clave de sesión | No hay fallback plaintext; archivo intacto y desbloqueo explícito | Sin la frase no hay recuperación automática. |
| Fallo de escritura o respaldo preparado obsoleto | Verificación previa y transacción CAS/rollback | Durabilidad, cuota y locking nativos aún no verificados. |
| Claves filtradas en el código o respaldo | CryptoKey no extraíble sólo en memoria; sin secretos persistidos | Un script del origen comprometido puede pedir descifrado mientras está desbloqueado. |

**No protege contra:** XSS/script del mismo origen, extensión maliciosa, malware, keylogger, acceso al dispositivo desbloqueado, capturas de pantalla, archivos plaintext previos, eliminación/reemplazo completo del perfil, pérdidas del dispositivo sin respaldo ni todas las copias en memoria. No es certificación, seguridad absoluta, cifrado de extremo a extremo ni sustituto de HTTPS y seguridad del alojamiento.

## Evidencia y referencias

`verify-crypto.mjs` usa Web Crypto nativo de Node, incluyendo un descifrado independiente: Unicode, vacío, 2 MB, IV/ciphertext distintos, claves no extraíbles, manipulación, frase incorrecta, formatos/versiones/tamaño y bloqueo/reapertura. `verify-vault-persistence.mjs` conecta el store real con el adaptador IDB serial: migración, confirmaciones, rollback, legado, import/export, concurrencia, pérdida de clave y conservación de datos. `verify-vault-ui.mjs` ejecuta callbacks reales con hooks controlados: confirmaciones, dobles eventos, limpieza de frases y gate que retira todas las vistas privadas. No sustituyen navegador, prueba de descarga física ni auditoría criptográfica independiente.

Fuentes primarias: [Web Crypto, W3C Recommendation](https://www.w3.org/TR/WebCryptoAPI/), [Web Cryptography Level 2 — borrador](https://www.w3.org/TR/webcrypto-2/), [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) y [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). PBKDF2 se elige por disponibilidad nativa sin dependencias WASM; el número de iteraciones sigue la guía de coste SHA256, no acredita FIPS ni una evaluación formal del producto.

## API de Espejo preparada

Secreto sólo Worker, endpoints fijos, DTO estricto, origen/consentimiento, payload mínimo, no-store, límites de contenido/tokens/tiempo y rate binding obligatorio. Backend deshabilitado: falta configuración, revisión de población/condiciones y control central de gasto antes de publicar. CSRF no es autenticación; limiter CF es por ubicación, no tope global. Ninguna key real o envío/gasto en este trabajo. Cifrar localmente no protege frente al proveedor el texto que se autoriza enviar. Ver AI-SAFETY.md.

## Caché pública · checkpoint 06

La caché guarda shell/recursos públicos locales; no guarda respuestas de /api/espejo ni raíz RSC/data, autenticación ni recursos externos. Los snapshots/diarios/escalas permanecen en IndexedDB, no en SW. Readiness valida presencia/MIME/versiones/referencias, no es firma criptográfica ni protección frente a XSS o manipulación del mismo origen. Es estado puntual; la política del navegador puede eliminarlo. Fuentes/fixtures en QA/PWA; instalación y actualización nativa pendientes.
