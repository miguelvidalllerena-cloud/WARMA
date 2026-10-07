import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const file=process.argv[2]||'public/sw.js',source=fs.readFileSync(file,'utf8');
const dev=source.includes("const VERSION = 'itaca-v1-dev';");
const declared=JSON.parse(source.match(/const PRECACHE = (\[[\s\S]*?\]);/)[1].replaceAll("'",'"'));
const precache=dev?[...declared,'/fixture-app.js','/fixture-app.css']:declared;
const script=dev?source.replace("'itaca-v1-dev'","'itaca-v1-abcdefabcdef'").replace(/const PRECACHE = \[[\s\S]*?\];/,`const PRECACHE = ${JSON.stringify(precache)};`):source;
const version=script.match(/const VERSION = '([^']+)'/)[1];
const js=precache.find(p=>p.endsWith('.js')),css=precache.find(p=>p.endsWith('.css'));
const shell=label=>`<html><head><link rel="stylesheet" href="${css}"></head><body>${label}<script type="module" src="${js}"></script></body></html>`;
const mime=p=>p==='/'||p.endsWith('.html')?'text/html':p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.png')?'image/png':p.endsWith('.svg')?'image/svg+xml':p.endsWith('.json')?'application/json':p.endsWith('.webmanifest')?'application/manifest+json':'text/plain';
const response=(p,label='asset')=>new Response(p==='/'?shell(label):label,{headers:{'Content-Type':mime(p)}});
function harness(code=script){
 const handlers={},stores=new Map([['itaca-v1-old',new Map()],['unrelated-cache',new Map()]]);
 let online=true,claimed=false,skipped=false,failOpen=false,failPut=false,invalidPath=null;
 const key=r=>typeof r==='string'?new URL(r,'https://warma.test').pathname:new URL(r.url).pathname;
 const caches={keys:async()=>[...stores.keys()],delete:async k=>stores.delete(k),open:async name=>{if(failOpen)throw new Error('fixture cache unavailable');if(!stores.has(name))stores.set(name,new Map());const store=stores.get(name);return {addAll:async rs=>{for(const r of rs)store.set(key(r),key(r)===invalidPath?new Response('invalid HTML',{headers:{'Content-Type':'text/html'}}):response(key(r)));},match:async r=>store.get(key(r))?.clone(),put:async(r,res)=>{if(failPut)throw new Error('fixture cache quota');store.set(key(r),res);}};}};
 class LocalRequest extends Request{constructor(url,opts){super(new URL(url,'https://warma.test'),opts);}}
 vm.runInNewContext(code,{Request:LocalRequest,Response,URL,AbortController,setTimeout,clearTimeout,caches,fetch:async req=>{if(!online)throw new Error('fixture offline');return response(key(req),key(req)==='/'?'network':'fetched asset');},self:{location:{origin:'https://warma.test'},addEventListener:(n,fn)=>handlers[n]=fn,skipWaiting:async()=>{skipped=true;},clients:{claim:async()=>{claimed=true;}}}});
 return {handlers,stores,async lifecycle(name){let job;handlers[name]({waitUntil:p=>job=p});await job;},async status(assets=[],port=false){let status,job;handlers.message({data:{type:'CACHE_STATUS',assets},...(port?{ports:[{postMessage:m=>status=m}]}:{source:{postMessage:m=>status=m}}),waitUntil:p=>job=p});await job;return status;},fetch(url='https://warma.test/',mode='navigate',extra={}){let res;handlers.fetch({request:{method:'GET',url,mode,...extra},respondWith:p=>res=p});return res;},get cache(){return stores.get(version);},get skipped(){return skipped;},get claimed(){return claimed;},set online(v){online=v;},set failOpen(v){failOpen=v;},set failPut(v){failPut=v;},set invalidPath(v){invalidPath=v;}};
}
const h=harness();assert.equal((await h.status()).ready,false);
await h.lifecycle('install');assert(h.skipped);await h.lifecycle('activate');assert(h.claimed);assert(!h.stores.has('itaca-v1-old'));assert(h.stores.has('unrelated-cache'));
let status=await h.status([js,css],true);assert.equal(status.ready,true);assert.equal(status.cached,status.total);assert.equal(status.total,precache.length);
const original=h.cache.get(js);h.cache.delete(js);assert.equal((await h.status()).ready,false);h.cache.set(js,new Response('<html>fallback</html>',{headers:{'Content-Type':'text/html'}}));assert.equal((await h.status()).ready,false);h.cache.set(js,new Response('bad',{status:404}));assert.equal((await h.status()).ready,false);h.cache.set(js,original);
assert.equal((await h.status(['/another-build.js'])).ready,false);assert.equal((await h.status('invalid request')).ready,false);
const originalShell=h.cache.get('/');h.cache.set('/',new Response('<html><script src="/old-build.js"></script></html>',{headers:{'Content-Type':'text/html'}}));assert.equal((await h.status()).ready,false);h.cache.set('/',originalShell);
h.failOpen=true;assert.equal((await h.status()).ready,false);assert.match(await(await h.fetch()).text(),/network/,'Cache unavailable must not discard a good network response');h.failOpen=false;
h.failPut=true;assert.match(await(await h.fetch()).text(),/network/,'Cache quota must not discard a good network response');h.failPut=false;
assert.match(await(await h.fetch()).text(),/network/);h.online=false;assert.match(await(await h.fetch()).text(),/network/);
assert.equal(await(await h.fetch('https://warma.test/favicon.svg','same-origin')).text(),'asset');
for(const url of ['https://warma.test/api/espejo','https://warma.test/__rsc','https://warma.test/auth/session','https://warma.test/login','https://other.test/favicon.svg','https://warma.test/private-note.json','https://warma.test/?_rsc=1'])assert.equal(h.fetch(url,'cors'),undefined);
assert.equal(h.fetch('https://warma.test/', 'navigate',{method:'POST'}),undefined);
assert.equal(h.fetch('https://warma.test'+js,'cors',{headers:new Headers({RSC:'1'})}),undefined);
assert.equal(h.fetch('https://warma.test'+js,'cors',{headers:new Headers({Accept:'text/x-component'})}),undefined);
h.cache.delete('/');assert.equal(await(await h.fetch()).text(),'asset','Fallback offline.html');h.cache.delete('/offline.html');assert.equal((await h.fetch()).status,503);
h.online=true;h.cache.delete(js);assert.equal(await(await h.fetch('https://warma.test'+js,'cors')).text(),'fetched asset');
const invalid=harness();invalid.invalidPath=js;await assert.rejects(invalid.lifecycle('install'));assert.equal(invalid.skipped,false,'Invalid production cache must not replace working worker');
if(dev){const development=harness(source);await development.lifecycle('install');assert.equal((await development.status()).ready,false,'Dev cache without built bundle is not production-ready');}
if(file.startsWith('dist/')){for(const url of precache.filter(p=>p!=='/'))assert(fs.existsSync('dist/client'+url),`Missing precache asset ${url}`);assert(!precache.some(p=>/qa-mobile|\/_headers|\/_redirects|vinext-client-entry-manifest/.test(p)));assert(!precache.some(p=>/^\/(api|auth|login)(\/|$)/.test(p)));assert(precache.some(p=>p.endsWith('.js')));assert(precache.some(p=>p.endsWith('.css')));console.log('Production precache paths:',precache.length);}
console.log('PASS: SW VM install/activation, production resources/MIME, partial/invalid/mixed-version cache, port readiness, navigation/fallback, quota/storage errors, exclusions and RSC. Not native browser/offline certification.');
