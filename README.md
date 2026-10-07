# Portal Municipal – San Roque de Cumbaza

Portal informativo (PWA) de la Municipalidad Distrital de San Roque de Cumbaza: tasas y trámites con sus requisitos, directorio de oficinas con estado en vivo, actividades del mes, comunicados urgentes y reporte ciudadano por WhatsApp.

Es un sitio **estático** (HTML + CSS + JavaScript sin framework). No necesita servidor propio: se publica en cualquier hosting estático (Firebase Hosting, GitHub Pages, Netlify…).

## Estructura

```
index.html                   Página única, con pestañas (Inicio, Tasas, Oficinas, Reporte, Consultas)
manifest.json  sw.js         PWA: instalable y con modo sin conexión
css/
  input.css                  Fuente de estilos (Tailwind + estilos propios)
  styles.css                 CSS compilado (se versiona, no hay que compilar para publicar)
js/
  app.js                     Punto de entrada
  config.js                  Horario, teléfonos, oficinas y configuración de Firebase
  horario.js                 Lógica de "abierto/cerrado" (siempre en hora de Lima)
  estado.js                  Aplica el horario a toda la interfaz
  tramites.js                Lista, búsqueda y detalle de trámites
  oficinas.js  agenda.js  avisos.js  reporte.js  modal.js  tabs.js  firebase.js  utils.js
data/tramites.json           Los 90 trámites y tasas (TUPA y TUSNE)
docs/                        Formatos en PDF para descargar
assets/                      Fuentes Inter y Font Awesome alojadas en el propio proyecto
tests/                       Pruebas automáticas (horario y datos)
database.rules.example.json  Reglas recomendadas para Firebase
```

## Cómo hacer los cambios más comunes

| Quiero… | Edito… |
|---|---|
| Agregar o corregir un trámite o precio | `data/tramites.json` |
| Cambiar horario, teléfonos u oficinas | `js/config.js` |
| Publicar una actividad, un comunicado o cambiar si una oficina atiende | Firebase Realtime Database (nodos `agenda`, `aviso_urgente`, `oficinas/<id>`) |
| Cambiar un formato descargable | Reemplazar el PDF en `docs/` (mismo nombre) |

Cada entrada de `data/tramites.json` tiene: `tipo` (`TUPA` o `TUSNE`), `n` (nombre), `p` (precio), `icon` (icono de [Font Awesome](https://fontawesome.com/icons), versión gratuita) y `r` (requisitos, admite `<br>` y `<b>`).

Cuando cambies archivos de la aplicación, sube también el número `VERSION` de `sw.js` para que los celulares descarguen la versión nueva.

## Ejecutar en local

El sitio usa módulos de JavaScript, así que **no se abre con doble clic** en `index.html`; necesita un servidor local:

```bash
npm install        # solo la primera vez
npm run serve      # abre http://localhost:5173
npm test           # pruebas automáticas
```

Si cambias clases de Tailwind en el HTML o en `js/`, vuelve a compilar el CSS y sube el resultado:

```bash
npm run build:css
```

## Actualizar tu copia

```bash
git pull
```

No hace falta compilar nada: `css/styles.css` ya viene compilado.

## Firebase

El portal **solo lee** de Firebase. Las reglas recomendadas están en `database.rules.example.json`: lectura pública, escritura solo para usuarios autenticados. Revisa en la consola de Firebase que las reglas reales sean al menos así de estrictas; si están abiertas, cualquier persona podría cambiar la agenda o publicar un comunicado falso. El panel de administración que escribe los datos debe iniciar sesión con Firebase Auth para poder seguir escribiendo.

## Pendientes que requieren una decisión de la municipalidad

- **Logo:** sigue enlazado desde `contrataciones.pe` (sitio ajeno). Conviene descargarlo a `assets/logo.png`, generar íconos de 192 y 512 px y actualizar `index.html` y `manifest.json`.
- **Notificaciones push:** estaban a medio hacer y no funcionaban (faltaban la librería y las claves `messagingSenderId`/`appId`/VAPID). Se quitaron. Si se quieren, hay que crear la configuración en Firebase Cloud Messaging y un `firebase-messaging-sw.js`.
- **Pagos por WhatsApp:** el mensaje y el número del banner “Pague sus tributos desde cualquier lugar” están en `js/config.js`. Se recomienda usar un canal oficial de la municipalidad.
- **Texto de privacidad:** se corrigió para que sea exacto con lo que hace la web. Que lo revise quien corresponda en la municipalidad respecto a la Ley N.° 29733.
- **Precios y requisitos:** se mantuvieron tal cual estaban. Conviene contrastarlos con el TUPA/TUSNE vigente. Hay trámites parecidos que podrían unificarse (por ejemplo, las dos constancias negativas de catastro, o las licencias de funcionamiento).

## Qué cambió respecto a la versión original (v1.0.2 → v1.1.0)

- Un solo `index.html` de 1741 líneas pasó a módulos separados; los trámites se movieron a `data/tramites.json`.
- Se eliminó el código duplicado y muerto (4 funciones `init`, secciones duplicadas, restos de Supabase).
- El horario tiene una sola fuente de verdad y usa la **hora de Perú** aunque el celular esté en otra zona; antes había 5 copias con criterios distintos.
- Se corrigieron errores: `firebase.messaging()` rompía el script, el service worker se registraba y se borraba a la vez, la agenda tenía dos listeners en conflicto, las oficinas mostraban “undefined”, el mensaje de bienvenida nunca aparecía y el estado de las oficinas no se actualizaba pasada la hora de cierre.
- Seguridad: los datos de Firebase ya no se insertan como HTML (evita XSS) y se quitó el guardado de tokens de notificación.
- Se corrigió el mensaje de WhatsApp del reporte: si el vecino escribía `&` o `#`, el texto se cortaba.
- Rendimiento: Tailwind ya no se compila en el navegador, y las fuentes e iconos se sirven desde el propio sitio. Se quitó la espera artificial de 800 ms.
- Accesibilidad y SEO: pestañas con teclado, modal accesible, etiquetas en los formularios, textos más grandes y con mejor contraste, `meta description` y vista previa al compartir.
- PWA que sí funciona: guarda los archivos propios para uso sin conexión y nunca guarda en caché los datos en vivo de Firebase.
