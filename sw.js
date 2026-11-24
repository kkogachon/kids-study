// バージョン変更時はキャッシュ名を変更。SupabaseのAPI応答やconfig.jsはキャッシュしません。
const CACHE='moe-study-static-v3-20261111';
const STATIC=['./index.html','./manifest.webmanifest','./icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(STATIC)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('config.js'))return;  // 設定値をキャッシュしない
 if(!STATIC.some(p=>url.pathname.endsWith(p.slice(1))))return;
 // ネットワーク優先。未接続でも体験モードの画面は開ける。
 e.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{})}return res}).catch(()=>caches.match(req)));
});
