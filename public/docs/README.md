# WARMA — Vuelve a tu centro

PWA educativa de autorregulación y metacognición para estudiantes de secundaria con alta exigencia académica. Su secuencia es organizar, pausar, reflexionar, regular y continuar. No diagnostica ni reemplaza apoyo humano; no se ha acreditado eficacia emocional o clínica.

## Empezar

1. Completa u omite la bienvenida. Tus preferencias explican la propuesta; no son un resultado psicológico.
2. Registra tu carga percibida si quieres. El nudo es una representación visual de registros, no una medición clínica.
3. En Camino, crea una microacción. «Necesito parar» abre una pausa voluntaria y conserva el tiempo de estudio restante.
4. El Espejo conserva preguntas locales. La conexión opcional a IA está preparada pero desactivada; si se configura, requiere revisar el texto y consentir cada envío.
5. Escribe en la Bitácora, guarda lo que elijas y usa modo Zen.
6. El jardín y Mi ritmo muestran acciones registradas; no hay rankings ni penalización por ausencia.
7. Proyectos, memoria, flashcards, microjuegos y horizontes siguen en «Todas las herramientas».

## Tus datos

IndexedDB local, sin cuenta ni sincronización remota. El cifrado AES-GCM es opt-in desde Preferencias: antes de activarlo los registros y respaldos legacy son legibles. Activarlo exige frase y respaldo previo; no se puede recuperar una frase perdida. Mientras la app está desbloqueada, puede leer los registros en memoria. Cifrado no protege frente a scripts o extensiones comprometidos durante el uso.

No se envían Bitácora, evaluación o identidad automáticamente a IA. El modo remoto no está configurado. Un respaldo protegido contiene ciphertext; los anteriores sin cifrar siguen siendo privados y legibles. El navegador puede borrar su almacenamiento: conserva una copia y su frase fuera del dispositivo. No compartas respaldos personales con el jurado; usa datos sintéticos.

PSS-10 continúa PENDING_PERMISSION: instrumento preparado, activación pendiente de autorización. No se muestran ni administran ítems protegidos. Preguntas contextuales y check-in cotidiano son independientes.

## Ejecutar y comprobar

Node >=22.13 y pnpm11.25.0. Instalar con `npx --yes pnpm@11.25.0 install --frozen-lockfile`, ejecutar con `npm run dev`. La arquitectura necesita Worker/servidor; el ZIP no es estático para Netlify Drop. `node scripts/verify-all.mjs` hace comprobaciones, build y precache.

Producción y respaldos anteriores no se han reemplazado. Build/tests controlados pasan; navegador/responsive/teclado, audio y GPU reales, IndexedDB nativo e instalación/offline requieren QA externa. Ver [Arquitectura](ARCHITECTURE.md), [PWA](PWA.md), [Marco WARMA](WARMA.md) y [QA](QA.md). Estas pruebas no acreditan superioridad sobre otros productos.
