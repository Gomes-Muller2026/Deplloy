// oi
// Service Worker - Consultório Control PWA
const CACHE_NAME = 'consultorio-app-v59';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/images/Patricia.avif',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
  'https://unpkg.com/lucide@latest'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia:
// - Navegação (HTML): Network First para sempre buscar versão nova no deploy
// - Assets estáticos: Cache First com atualização de cache em background
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  // Para páginas HTML, prioriza rede para refletir atualizações do GitHub Pages.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put('./index.html', responseToCache);
          });
        }
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Para assets (css/js/imagens), mantém cache-first com atualização de cache.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(request).then((response) => {
          if (!response || response.status !== 200) return;
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }).catch(() => null);
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      }).catch(() => null);
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || './';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client && 'postMessage' in client) {
          client.postMessage({ type: 'OPEN_REMINDER_ROUTE', url: targetUrl });
        }
        if (client && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      return null;
    })
  );
});

self.addEventListener('message', (event) => {
  const data = event && event.data ? event.data : {};
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
// att
