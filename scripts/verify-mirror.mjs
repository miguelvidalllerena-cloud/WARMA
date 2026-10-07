import assert from 'node:assert/strict';
import {createTSLoader} from './test/ts-loader.mjs';

const load=createTSLoader(),contract=load('lib/mirror-contract.ts'),client=load('lib/mirror-client.ts'),endpoint=load('lib/server/mirror-endpoint.ts');
const reflection={acknowledgement:'Podemos ordenar un paso.',question:'¿Qué puedes ajustar hoy?',nextStep:'Elige una acción pequeña, si te resulta cómoda.'};
const input=client.prepareMirrorTransmission(1,'Tengo dos entregas esta semana.','¿Qué quieres ordenar?','openai',true);
assert.throws(()=>client.prepareMirrorTransmission(0,'Texto',null,'openai',false));
const env={AI_REMOTE_ENABLED:'true',WARMA_AI_POLICY_REVIEWED:'true',WARMA_AI_PROVIDER:'openai',WARMA_AI_MODEL:'fixture-model',WARMA_AI_API_KEY:'server-fixture-token-not-real',WARMA_AI_LIMITER:{limit:async()=>({success:true})}};
const request=(body=input,extra={},signal)=>new Request('https://warma.test/api/espejo',{method:'POST',signal,headers:{origin:'https://warma.test','Content-Type':'application/json','X-Warma-Consent':contract.MIRROR_CONSENT_VERSION,...extra},body:JSON.stringify(body)});
let calls=[];
const fetcher=async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(reflection)}]}]}),{headers:{'Content-Type':'application/json'}});};
for(const partial of [{},{...env,AI_REMOTE_ENABLED:'false'},{...env,WARMA_AI_LIMITER:undefined},{...env,WARMA_AI_POLICY_REVIEWED:'false'},{...env,WARMA_AI_API_KEY:''},{...env,WARMA_AI_MODEL:'invalid model'}]){
 assert.equal(endpoint.mirrorStatus(partial).available,false);const response=await endpoint.handleMirrorRequest(request(),partial,fetcher);assert.equal((await response.json()).mode,'local');
}assert.equal(calls.length,0,'Missing config must never contact a provider');
for(const body of [{...input,name:'must-not-send'},{...input,journal:[]},{...input,pss10:[1,2]},{...input,consent:{...input.consent,accepted:false}},{...input,text:''},{...input,text:'x'.repeat(1501)},{...input,stage:5}]){
 assert.equal((await endpoint.handleMirrorRequest(request(body),env,fetcher)).status,400);
}
for(const headers of [{origin:'https://other.test'},{'X-Warma-Consent':'old'},{'Content-Type':'text/plain'}])assert.equal((await endpoint.handleMirrorRequest(request(input,headers),env,fetcher)).status,403);
assert.equal((await endpoint.handleMirrorRequest(request({...input,consent:{...input.consent,provider:'anthropic'}}),env,fetcher)).status,409);assert.equal(calls.length,0);
const limited=await endpoint.handleMirrorRequest(request(),{...env,WARMA_AI_LIMITER:{limit:async()=>({success:false})}},fetcher);assert.equal(limited.status,429);assert.equal((await limited.json()).reason,'rate-limited');assert.equal(calls.length,0);
const help=await endpoint.handleMirrorRequest(request({...input,text:'No estoy a salvo.'}),env,fetcher);assert.equal((await help.json()).mode,'human-support');assert.equal(calls.length,0);
const generated=await endpoint.handleMirrorRequest(request(),env,fetcher),value=await generated.json();assert.equal(value.mode,'remote');assert.deepEqual(value.reflection,reflection);assert.equal(generated.headers.get('cache-control'),'no-store, private');
assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.openai.com/v1/responses');assert.equal(calls[0].options.headers.Authorization,'Bearer '+env.WARMA_AI_API_KEY);assert.equal(calls[0].options.redirect,'error');
const dto=JSON.parse(calls[0].options.body);assert.equal(dto.store,false);assert.equal(dto.max_output_tokens,700);assert.deepEqual(JSON.parse(dto.input[0].content),{phase:'clarify',studentText:input.text,previousQuestion:input.question});assert.ok(!calls[0].options.body.includes('pss10'));assert.ok(!calls[0].options.body.includes('journal'));
const otherEnv={...env,WARMA_AI_PROVIDER:'anthropic'},otherRequest=request({...input,consent:{...input.consent,provider:'anthropic'}});
let anthropicPayload;const anthropic=await endpoint.handleMirrorRequest(otherRequest,otherEnv,async(url,options)=>{assert.equal(url,'https://api.anthropic.com/v1/messages');anthropicPayload=JSON.parse(options.body);return new Response(JSON.stringify({stop_reason:'end_turn',content:[{type:'text',text:JSON.stringify(reflection)}]}));});assert.equal((await anthropic.json()).provider,'anthropic');assert.equal(anthropicPayload.max_tokens,700);
const fail=async body=>(await (await endpoint.handleMirrorRequest(request(),env,async()=>new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:body}]}]})))).json());
for(const bad of ['not-json',JSON.stringify({...reflection,diagnosis:'x'}),JSON.stringify({...reflection,acknowledgement:'Tienes depresión'}),JSON.stringify({...reflection,question:'x'.repeat(261)}),'x'.repeat(33000)])assert.equal((await fail(bad)).mode,'local');
let attempts=0;const retried=await endpoint.handleMirrorRequest(request(),env,async(url,options)=>{attempts++;return attempts===1?new Response('',{status:429}):fetcher(url,options);});assert.equal((await retried.json()).mode,'remote');assert.equal(attempts,2);
attempts=0;const exhausted=await endpoint.handleMirrorRequest(request(),env,async()=>{attempts++;return new Response('',{status:429});});assert.equal((await exhausted.json()).mode,'local');assert.equal(attempts,2);
const cancel=new AbortController();let invoked=false;const canceled=endpoint.handleMirrorRequest(request(input,{},cancel.signal),env,async(_url,options)=>{invoked=true;return new Promise((_,reject)=>{options.signal.addEventListener('abort',()=>reject(new DOMException('Canceled','AbortError')),{once:true});});});
for(let i=0;i<10&&!invoked;i++)await new Promise(r=>setImmediate(r));assert.equal(invoked,true);cancel.abort();assert.equal((await (await canceled).json()).reason,'canceled');
// Deterministic deadline, without waiting twelve seconds or real networking.
const timer=globalThis.setTimeout;try{globalThis.setTimeout=(fn,ms,...args)=>timer(fn,ms===12000?0:ms,...args);const timed=await endpoint.handleMirrorRequest(request(),env,async(_url,options)=>new Promise((_,reject)=>{options.signal.addEventListener('abort',()=>reject(new DOMException('Timed out','AbortError')),{once:true});}));assert.equal((await timed.json()).reason,'provider-failed');}finally{globalThis.setTimeout=timer;}
let transmitted=0;const result=await client.sendMirrorTransmission(input,new AbortController().signal,async(url,options)=>{transmitted++;assert.equal(url,'/api/espejo');assert.deepEqual(JSON.parse(options.body),input);return new Response(JSON.stringify(value));});assert.equal(result.mode,'remote');assert.equal(transmitted,1);
const invalid={...input,journal:'unexpected'};await assert.rejects(client.sendMirrorTransmission(invalid,new AbortController().signal,async()=>{transmitted++;}));assert.equal(transmitted,1);
assert.equal((await client.sendMirrorTransmission(input,new AbortController().signal,async()=>{throw new Error('network');})).mode,'local');
const route=createTSLoader({'cloudflare:workers':{env:{}}})('app/api/espejo/route.ts');assert.equal((await (await route.GET()).json()).available,false);
assert.equal(contract.acceptableReflection({...reflection,acknowledgement:'Toma 20 mg'}),null);
console.log('PASS: real request/route/provider/client functions with synthetic fetch; consent/strict minimization/origin; no config no calls; mandatory limiter; provider-change; OpenAI/Anthropic DTOs; no-store; 700-token bounds; JSON/content validation; one 429 retry; cancellation/deadline; local/support fallbacks. No external API call, actual model quality or live limiter validated.');
