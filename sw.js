var C="ledger-v12",PRE=["./","index.html","css/style.css","js/merge.js","js/app.js","js/summary.js","js/sync.js","manifest.json","img/icon-180.png","img/icon-192.png","img/icon-512.png","img/avatar-f.jpg","img/avatar-m.jpg"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(k){return Promise.all(PRE.map(function(u){return k.add(u).catch(function(){})}))}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var netPromise = fetch(e.request).then(function(r){
        if(r.ok){
          var c = r.clone();
          caches.open(C).then(function(k){ k.put(e.request, c); });
        }
        return r;
      });
      if(cached){
        netPromise.catch(function(){});
        return cached;
      }
      return netPromise.catch(function(){
        return caches.match("index.html");
      });
    })
  );
});
