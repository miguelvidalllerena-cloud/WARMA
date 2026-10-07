import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
import {createTSLoader} from './test/ts-loader.mjs';
const saved=new Map();function set(name,value){if(!saved.has(name))saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{value,configurable:true,writable:true});}
let clock=new Map(),clockId=0,channels=[];
class FixturePort{onmessage=null;closed=false;other=null;postMessage(data){this.other?.onmessage?.({data});}close(){this.closed=true;}}
class FixtureChannel{constructor(){this.port1=new FixturePort();this.port2=new FixturePort();this.port1.other=this.port2;this.port2.other=this.port1;channels.push(this);}}
set('MessageChannel',FixtureChannel);set('setTimeout',fn=>{const id=++clockId;clock.set(id,fn);return id;});set('clearTimeout',id=>clock.delete(id));
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
const status={type:'CACHE_STATUS',ready:true,version:'itaca-v1-abcdefabcdef',total:12,cached:12};
function fixture({controller=null,secure=true,registrationFails=false}={}){
 const worker=()=>({scriptURL:'https://warma.test/sw.js',state:'activated',requests:[],postMessage(data,ports){this.requests.push({data,port:ports[0]});},reply(data=status,index=this.requests.length-1){this.requests[index].port.postMessage(data);}});
 const workers=new EventTarget();workers.controller=controller;workers.ready=Promise.resolve({active:controller});workers.registrations=[];workers.register=async(...args)=>{workers.registrations.push(args);if(registrationFails)throw new Error('fixture offline update');return {};};
 const page=new EventTarget();page.isSecureContext=secure;
 const doc=new EventTarget();doc.hidden=false;doc.querySelectorAll=()=>[{getAttribute:n=>n==='src'?'/app.js?v=1':null},{getAttribute:n=>n==='src'?'/app.js?v=2':null},{getAttribute:n=>n==='href'?'/main.css':null},{getAttribute:n=>n==='src'?'https://external.test/third-party.js':null}];
 set('window',page);set('navigator',{serviceWorker:workers});set('document',doc);set('location',new URL('https://warma.test/#settings'));
 return {workers,page,doc,worker};
}
const observe=createTSLoader()('lib/offline-readiness.ts').observeOfflineReadiness;
try{
 const f=fixture(),values=[],stop=observe(v=>values.push(v));await flush();assert.deepEqual(f.workers.registrations,[['/sw.js',{updateViaCache:'none'}]]);assert.equal(values.at(-1),false,'Register + ready without controller/cache is not proof');
 const first=f.worker();f.workers.controller=first;f.workers.dispatchEvent(new Event('controllerchange'));assert.equal(values.at(-1),false);assert.deepEqual(first.requests.at(-1).data.assets,['/app.js','/main.css']);assert.equal(clock.size,1);
 first.reply();assert.equal(values.at(-1),true);assert.equal(clock.size,0);assert(channels.at(-1).port1.closed&&channels.at(-1).port2.closed);
 f.page.dispatchEvent(new Event('offline'));assert.equal(values.at(-1),false);first.reply({...status,ready:false,cached:11});assert.equal(values.at(-1),false);
 f.page.dispatchEvent(new Event('online'));first.reply({...status,version:'itaca-v1-dev'});assert.equal(values.at(-1),false);
 f.page.dispatchEvent(new Event('pageshow'));first.reply({...status,cached:11});assert.equal(values.at(-1),false);
 f.page.dispatchEvent(new Event('online'));const oldIndex=first.requests.length-1,second=f.worker();f.workers.controller=second;f.workers.dispatchEvent(new Event('controllerchange'));first.reply(status,oldIndex);assert.equal(values.at(-1),false,'Stale worker reply ignored');second.reply();assert.equal(values.at(-1),true);
 const before=second.requests.length;f.doc.hidden=true;f.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(second.requests.length,before);f.doc.hidden=false;f.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(values.at(-1),false);assert.equal(second.requests.length,before+1);
 const timeout=[...clock.values()][0];timeout();assert.equal(values.at(-1),false);assert.equal(clock.size,0);second.reply();assert.equal(values.at(-1),false,'Reply queued after timeout stays ignored');
 f.page.dispatchEvent(new Event('online'));const pending=second.requests.length-1,oldLength=values.length;stop();assert.equal(clock.size,0);second.reply(status,pending);f.page.dispatchEvent(new Event('online'));f.workers.dispatchEvent(new Event('controllerchange'));assert.equal(values.length,oldLength,'No late updates/events after disposal');
 const off=fixture({registrationFails:true}),existing=off.worker();off.workers.controller=existing;const offlineValues=[],dispose=observe(v=>offlineValues.push(v));await flush();existing.reply();assert.equal(offlineValues.at(-1),true,'Offline update failure can retain a verified existing controller');dispose();
 const insecure=fixture({secure:false}),blocked=[];observe(v=>blocked.push(v))();await flush();assert.deepEqual(blocked,[false]);assert.equal(insecure.workers.registrations.length,0);
 const unmount=fixture(),disposed=[];const remove=observe(v=>disposed.push(v));remove();await flush();assert.deepEqual(disposed,[false,false]);assert.equal(clock.size,0);
 // Exercise the root effect to ensure it delegates verification, never sets true.
 const source=ts.createSourceFile('app.tsx',fs.readFileSync('components/itaca/app.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let effect;function visit(n){if(ts.isCallExpression(n)&&n.expression.getText(source)==='useEffect'&&n.arguments[0].getText(source).includes('observeOfflineReadiness(setOfflineReady)'))effect=n.arguments[0];ts.forEachChild(n,visit);}visit(source);assert(effect);
 let rootReady=false,calls=0,cleanups=0;const context={ready:true,setOfflineReady:v=>rootReady=v,observeOfflineReadiness:change=>{calls++;change(false);return ()=>cleanups++;}};const cb=vm.runInNewContext(ts.transpileModule('('+effect.getText(source)+')',{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,context);cb()();assert.equal(rootReady,false);assert.equal(calls,1);assert.equal(cleanups,1);context.ready=false;cb();assert.equal(calls,1);assert.equal(rootReady,false);
 console.log('PASS: readiness callback/root effect, no optimistic register state; controlled port/cache responses, timeout, versions/assets/controller changes, offline update, events/disposal. Not a native browser test.');
}finally{for(const [name,descriptor]of saved){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}}
