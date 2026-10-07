// Cambiamos la versión de caché para forzar la actualización
const CACHE_NAME = 'src-conecta-v1';

const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://www.contrataciones.pe/organizaciones/licitaciones-municipalidad-de-san-roque-de-cumbaza.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SRC CONECTA: Sistema cargado');
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); 
});
