var V="imsakiya-v1-gh";
var ASSETS=["./","./index.html","./styles.css","./app.js","./data.js","./logo.png","./logo.svg","./manifest.webmanifest","./fonts/cairo.woff2","./fonts/naskh.woff2","./fonts/messiri.woff2","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(ASSETS.map(function(a){return c.add(a).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put("./index.html",cp)});return res}).catch(function(){return caches.match("./index.html")}));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(m){var f=fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}return res}).catch(function(){return m});return m||f}));
});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(self.clients.openWindow("./"))});
