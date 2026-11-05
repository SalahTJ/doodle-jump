const VERSION='2';
const C='dj-v'+VERSION;
const PEER='https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js';
const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png'];

self.addEventListener('install',e=>{
 e.waitUntil((async()=>{
  const c=await caches.open(C);
  await c.addAll(FILES);
  // PeerJS is cross-origin: cache it as an opaque response; failure must not block install
  try{await c.put(PEER,await fetch(PEER,{mode:'no-cors'}))}catch(_){}
  await self.skipWaiting();
 })());
});

self.addEventListener('activate',e=>{
 e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});

self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);

 // PeerJS from CDN: cache first, then network (and remember it)
 if(req.url===PEER){
  e.respondWith(caches.match(PEER).then(m=>m||fetch(req).then(r=>{
   const cp=r.clone();caches.open(C).then(c=>c.put(PEER,cp)).catch(()=>{});return r})));
  return;
 }
 if(url.origin!==location.origin)return;

 // Own files: network first, fall back to cache when offline
 e.respondWith(fetch(req).then(r=>{
  if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{})}
  return r;
 }).catch(()=>caches.match(req).then(m=>m||caches.match('index.html'))));
});
