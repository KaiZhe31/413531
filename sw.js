var C="ledger-v24",PRE=["./","index.html","css/style.css","js/merge.js","js/app.js","js/sync.js","manifest.json","img/icon-180.png","img/icon-192.png","img/icon-512.png","img/avatar-f.jpg","img/avatar-m.jpg","fonts/nunito-latin-600-normal.woff2","fonts/nunito-latin-800-normal.woff2"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(k){return Promise.all(PRE.map(function(u){return k.add(u).catch(function(){})}))}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function net(req) {
  // 网络很慢 / 假在线时，5 秒后改用缓存，不让页面一直转圈
  return new Promise(function (ok, no) {
    var t = setTimeout(function () {
      no(new Error("timeout"));
    }, 5000);
    fetch(req).then(
      function (r) {
        clearTimeout(t);
        ok(r);
      },
      function (e) {
        clearTimeout(t);
        no(e);
      },
    );
  });
}
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    net(e.request)
      .then(function (r) {
        if (r.ok) {
          var c = r.clone();
          caches.open(C).then(function (k) {
            k.put(e.request, c);
          });
        }
        return r;
      })
      .catch(function () {
        return caches.match(e.request, { ignoreSearch: true }).then(function (m) {
          return m || (e.request.mode === "navigate" ? caches.match("index.html") : Response.error());
        });
      }),
  );
});