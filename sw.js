// Service worker del portal. Sube VERSION cada vez que cambies archivos del "shell" para forzar la actualización.
const VERSION = 'v1.1.0';
const CACHE = `src-conecta-${VERSION}`;

// Archivos propios que hacen funcionar la app sin conexión.
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './assets/vendor/fontawesome/css/all.min.css',
  './assets/vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './assets/vendor/fontawesome/webfonts/fa-brands-400.woff2',
  './assets/vendor/fontawesome/webfonts/fa-regular-400.woff2',
  './assets/fonts/inter-latin-400-normal.woff2',
  './assets/fonts/inter-latin-600-normal.woff2',
  './assets/fonts/inter-latin-800-normal.woff2',
  './assets/fonts/inter-latin-900-normal.woff2',
  './data/tramites.json',
  './js/app.js',
  './js/agenda.js',
  './js/avisos.js',
  './js/config.js',
  './js/estado.js',
  './js/firebase.js',
  './js/horario.js',
  './js/modal.js',
  './js/oficinas.js',
  './js/reporte.js',
  './js/tabs.js',
  './js/tramites.js',
  './js/utils.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Todo lo externo (Firebase, logo, WhatsApp) va directo a la red: los datos en vivo nunca se sirven viejos.
  if (url.origin !== self.location.origin) return;

  // Páginas: red primero (siempre lo más nuevo); sin red, la versión guardada.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Archivos propios: devolver lo guardado al instante y actualizarlo en segundo plano.
  event.respondWith(
    caches.match(request).then((guardado) => {
      const red = fetch(request)
        .then((respuesta) => {
          if (respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(CACHE).then((c) => c.put(request, copia));
          }
          return respuesta;
        })
        .catch(() => guardado);
      return guardado || red;
    })
  );
});
