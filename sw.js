/**
 * CYBER WEATHER 2077 — Service Worker
 * 缓存策略：
 *   静态资源（HTML/CSS/JS/图标）→ Cache First（预缓存，后台更新）
 *   天气 API 请求              → Network First（优先联网，断网时走缓存兜底）
 */

const CACHE_VERSION  = 'v2.0';
const STATIC_CACHE   = `cyber-weather-static-${CACHE_VERSION}`;
const API_CACHE      = `cyber-weather-api-${CACHE_VERSION}`;
const API_CACHE_TTL  = 10 * 60 * 1000; // API 缓存有效期：10分钟（毫秒）

// ─── 预缓存资源列表 ──────────────────────────────────────────────
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  // JS 模块（与 index.html 引用保持一致）
  './js/config.js',
  './js/cities.js',
  './js/continents.js',
  './js/weather.js',
  './js/audio.js',
  './js/bg-map.js',
  './js/ascii-earth.js',
  './js/terminal-ui.js',
  './js/main.js',
  './js/pwa-install.js',
  './js/mobile-panel.js',
  './assets/world-map-bg.svg',
  // Favicon 图标
  './favicon/favicon.ico',
  './favicon/favicon.svg',
  './favicon/favicon-96x96.png',
  './favicon/apple-touch-icon.png',
  './favicon/web-app-manifest-192x192.png',
  './favicon/web-app-manifest-512x512.png',
  // icons/ 目录（完整集合）
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
];

// ─── 需要 Network First 的域名前缀 ──────────────────────────────
const API_ORIGINS = [
  'api.openweathermap.org',
  'openweathermap.org',
];

// ═══════════════════════════════════════════════════════════════
// INSTALL — 预缓存所有静态资源
// ═══════════════════════════════════════════════════════════════
self.addEventListener('install', event => {
  console.log('[SW] Installing CYBER WEATHER SW', CACHE_VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      // 逐个缓存，某个资源失败不影响整体安装
      return Promise.allSettled(
        PRECACHE_URLS.map(url =>
          cache.add(url).catch(err =>
            console.warn(`[SW] 预缓存失败: ${url}`, err.message)
          )
        )
      );
    }).then(() => {
      console.log('[SW] 预缓存完成，skipWaiting');
      return self.skipWaiting(); // 立即激活，不等旧 SW 释放
    })
  );
});

// ═══════════════════════════════════════════════════════════════
// ACTIVATE — 清理旧版本缓存
// ═══════════════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  console.log('[SW] Activating', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const deleteOld = cacheNames
        .filter(name =>
          name.startsWith('cyber-weather-') &&
          name !== STATIC_CACHE &&
          name !== API_CACHE
        )
        .map(name => {
          console.log('[SW] 删除旧缓存:', name);
          return caches.delete(name);
        });
      return Promise.all(deleteOld);
    }).then(() => {
      console.log('[SW] 旧缓存清理完毕，接管所有页面');
      return self.clients.claim(); // 立即控制所有已打开的页面
    })
  );
});

// ═══════════════════════════════════════════════════════════════
// FETCH — 请求拦截
// ═══════════════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理 http/https 请求
  if (!url.protocol.startsWith('http')) return;

  // ── 天气 API：Network First ──
  if (API_ORIGINS.some(origin => url.hostname.includes(origin))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // ── 静态资源：Cache First ──
  event.respondWith(cacheFirst(request));
});

// ─── Cache First 策略 ──────────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // 命中缓存，后台更新（Stale-While-Revalidate）
    refreshCache(request);
    return cached;
  }
  // 未命中，走网络并写入缓存
  return fetchAndCache(request, STATIC_CACHE);
}

// ─── Network First 策略 ────────────────────────────────────────
async function networkFirst(request) {
  try {
    const response = await fetch(request.clone());
    if (response.ok) {
      // 网络成功，异步写入 API 缓存（附带时间戳）
      const cache = await caches.open(API_CACHE);
      const cloned = response.clone();
      // 包装响应，注入缓存时间头
      const headers = new Headers(cloned.headers);
      headers.set('sw-cached-at', Date.now().toString());
      const body = await cloned.arrayBuffer();
      const cachedResponse = new Response(body, {
        status:     cloned.status,
        statusText: cloned.statusText,
        headers,
      });
      cache.put(request, cachedResponse);
    }
    return response;
  } catch (err) {
    // 网络失败，查找缓存
    console.warn('[SW] 网络请求失败，尝试 API 缓存:', request.url);
    const cached = await caches.match(request);
    if (cached) {
      // 检查缓存是否过期
      const cachedAt = parseInt(cached.headers.get('sw-cached-at') || '0', 10);
      const age = Date.now() - cachedAt;
      if (age < API_CACHE_TTL) {
        console.log(`[SW] API 缓存命中 (age: ${Math.round(age / 1000)}s)`);
        return cached;
      }
      console.warn('[SW] API 缓存已过期，但离线，仍返回旧数据');
      return cached;
    }
    // 彻底没有缓存，返回离线提示 JSON
    return new Response(
      JSON.stringify({ cod: 503, message: '离线模式：暂无缓存天气数据' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }
}

// ─── 辅助：网络获取并写入静态缓存 ─────────────────────────────
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // 静态资源也断网了：返回离线降级页
    const cached = await caches.match('./index.html');
    if (cached) return cached;
    return new Response('CYBER WEATHER — Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// ─── 辅助：后台静默刷新缓存（不阻塞当前响应）─────────────────
function refreshCache(request) {
  fetch(request).then(response => {
    if (response.ok) {
      caches.open(STATIC_CACHE).then(cache => cache.put(request, response));
    }
  }).catch(() => { /* 后台刷新失败无需处理 */ });
}

// ═══════════════════════════════════════════════════════════════
// MESSAGE — 支持手动触发更新（来自页面的 postMessage）
// ═══════════════════════════════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});

// ═══════════════════════════════════════════════════════════════
// PUSH — 推送通知（未来天气预警预留）
// ═══════════════════════════════════════════════════════════════
self.addEventListener('push', event => {
  const data = event.data?.json().catch(() => null);
  const title = data?.title || 'CYBER WEATHER 2077';
  const options = {
    body:    data?.body    || '天气数据已更新',
    icon:    './icons/icon-192.png',
    badge:   './icons/icon-96.png',
    tag:     'weather-update',
    renotify: false,
    data:    { url: data?.url || './' },
    actions: [
      { action: 'open',    title: '查看详情' },
      { action: 'dismiss', title: '稍后再说' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知点击跳转
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const targetUrl = event.notification.data?.url || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
