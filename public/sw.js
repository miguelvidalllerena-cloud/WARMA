/* Build replaces these two constants with a content hash and local assets. */
const VERSION = 'itaca-v1-dev';
const PRECACHE = ['/', '/offline.html', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/icon-maskable.png'];
const CACHE = VERSION;
function validResource(path,response){
 if(!response?.ok||response.redirected||response.type==='opaque')return false;
 const mime=(response.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();
 if(path==='/'||path.endsWith('.html'))return mime==='text/html';
 if(path.endsWith('.js'))return /^(text|application)\/(javascript|ecmascript)$/.test(mime);
 if(path.endsWith('.css'))return mime==='text/css';
 if(path.endsWith('.webmanifest')||path.endsWith('.json'))return mime==='application/manifest+json'||mime==='application/json';
 if(path.endsWith('.png'))return mime==='image/png';
 if(path.endsWith('.svg'))return mime==='image/svg+xml';
 return mime!=='text/html';
}
async function shellMatches(shell){
 if(!validResource('/',shell))return false;
 const html=await shell.text();
 const refs=[...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["']/gi)].map(match=>new URL(match[1],self.location.origin)).filter(url=>url.origin===self.location.origin&&/\.(js|css)$/.test(url.pathname));
 return refs.some(url=>url.pathname.endsWith('.js'))&&refs.every(url=>PRECACHE.includes(url.pathname));
}
async function cacheStatus(assets=[]){
 let cached=0,ready=false;
 try{
  const cache=await caches.open(CACHE);
  const hits=await Promise.all(PRECACHE.map(async path=>validResource(path,await cache.match(path))));
  cached=hits.filter(Boolean).length;
  const production=/^itaca-v1-[a-f0-9]{12}$/.test(VERSION)&&PRECACHE.some(path=>path.endsWith('.js'))&&PRECACHE.some(path=>path.endsWith('.css'));
  const compatible=Array.isArray(assets)&&assets.length<=120&&assets.every(path=>typeof path==='string'&&path.length<=512&&PRECACHE.includes(path));
  ready=production&&cached===PRECACHE.length&&compatible&&await shellMatches(await cache.match('/'));
 }catch{}
 return {type:'CACHE_STATUS',ready,version:VERSION,total:PRECACHE.length,cached};
}
self.addEventListener('install', event => {
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(PRECACHE.map(url=>new Request(url,{cache:'reload',credentials:'same-origin'})));if(VERSION!=='itaca-v1-dev'&&!(await cacheStatus()).ready)throw new Error('WARMA precache incompleto o incompatible.');await self.skipWaiting();})());
});
self.addEventListener('activate', event => {
 event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('itaca-v')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());
});
self.addEventListener('fetch', event => {
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||/^\/(api|__|cdn-cgi|auth|login)(\/|$)/.test(url.pathname))return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{let cache;try{cache=await caches.open(CACHE);}catch{}const fallback=async()=>{try{return await cache?.match('/')||await cache?.match('/offline.html');}catch{return undefined;}};const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),3000);try{const response=await fetch(request,{signal:controller.signal});if(validResource('/',response)){if(await shellMatches(response.clone()))try{await cache?.put('/',response.clone());}catch{}return response;}return await fallback()||response;}catch{return await fallback()||new Response('WARMA necesita una primera visita con conexión.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}finally{clearTimeout(timeout);}})());return;
 }
 // Root fetches can be RSC/data requests; cached HTML is only for navigation.
 if(url.pathname==='/'||!PRECACHE.includes(url.pathname)||request.headers?.get('RSC')==='1'||request.headers?.get('Accept')?.includes('text/x-component'))return;
 event.respondWith((async()=>{let cache;try{cache=await caches.open(CACHE);const hit=await cache.match(url.pathname);if(validResource(url.pathname,hit))return hit;}catch{}const response=await fetch(request);if(validResource(url.pathname,response))try{await cache?.put(url.pathname,response.clone());}catch{}return response;})());
});
self.addEventListener('message',event=>{if(event.data?.type==='CACHE_STATUS')event.waitUntil((async()=>{const status=await cacheStatus(event.data.assets||[]);if(event.ports?.[0])event.ports[0].postMessage(status);else event.source?.postMessage(status);})());});
