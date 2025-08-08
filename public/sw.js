// public/sw.js
self.addEventListener('push', function (event) {
    const data = event.data?.json() || {};

    console.log('🔔 Push notification received:', data);
  
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: '/icon.png',
      })
    );
  });

const CACHE_NAME = 'worker-app-v1'
const urlsToCache = [
  '/',
  '/worker.js',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data

  if (type === 'CACHE_DATA') {
    // Store data in IndexedDB or cache
    console.log('Caching data:', data)
    
    // In a real app, you'd store this in IndexedDB
    // For demo, we'll just log it
    self.registration.showNotification('Data Cached', {
      body: `Saved: ${data.name}`,
      icon: '/placeholder.svg?height=64&width=64'
    })
  }

  if (type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
    console.log('Cache cleared')
  }
})

// Background sync (when online again)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync cached data with server
      syncCachedData()
    )
  }
})

async function syncCachedData() {
  // In a real app, retrieve cached data and sync with server
  console.log('Syncing cached data with server...')
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification!',
    icon: '/placeholder.svg?height=64&width=64',
    badge: '/placeholder.svg?height=32&width=32'
  }

  event.waitUntil(
    self.registration.showNotification('Worker App', options)
  )
})
