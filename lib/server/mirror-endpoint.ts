import {remoteAIEnabled,type FeatureEnvironment} from '../feature-flags';
import {mirrorRequestSchema,MIRROR_CONSENT_VERSION,localMirrorReply,humanSupportReply,requiresHumanSupport,type MirrorStatus} from '../mirror-contract';
import {createAIProvider,boundedText,ProviderFailure,type AIProviderConfig} from './mirror-provider';

type RateLimiter={limit(input:{key:string}):Promise<{success:boolean}>};
export type MirrorEnvironment=FeatureEnvironment & {WARMA_AI_PROVIDER?:string;WARMA_AI_MODEL?:string;WARMA_AI_API_KEY?:string;WARMA_AI_POLICY_REVIEWED?:string;WARMA_AI_LIMITER?:RateLimiter};
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff'};
function json(value:unknown,status=200){return new Response(JSON.stringify(value),{status,headers});}
function configuration(env:MirrorEnvironment):AIProviderConfig|null{
 const provider=env.WARMA_AI_PROVIDER;
 if(!remoteAIEnabled(env)||env.WARMA_AI_POLICY_REVIEWED!=='true'||typeof env.WARMA_AI_LIMITER?.limit!=='function'||!env.WARMA_AI_API_KEY||!env.WARMA_AI_MODEL||!['openai','anthropic'].includes(provider||''))return null;
 if(!/^[A-Za-z0-9._:-]{1,100}$/.test(env.WARMA_AI_MODEL))return null;
 return {provider:provider as AIProviderConfig['provider'],model:env.WARMA_AI_MODEL,apiKey:env.WARMA_AI_API_KEY};
}
export function mirrorStatus(env:MirrorEnvironment):MirrorStatus{
 const config=configuration(env);return config?{available:true,provider:config.provider,providerLabel:config.provider==='openai'?'OpenAI':'Anthropic',policyURL:config.provider==='openai'?'https://openai.com/policies/privacy-policy/':'https://www.anthropic.com/legal/privacy',reason:'ready'}:{available:false,provider:null,providerLabel:'Guía local',policyURL:null,reason:'not-configured'};
}
export function handleMirrorStatus(env:MirrorEnvironment){return json(mirrorStatus(env));}
async function delay(signal:AbortSignal){await new Promise<void>((resolve,reject)=>{
 const abort=()=>{clearTimeout(timer);reject(new DOMException('Canceled','AbortError'));};
 const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},400);
 if(signal.aborted){abort();return;}signal.addEventListener('abort',abort,{once:true});
});}
export async function handleMirrorRequest(request:Request,env:MirrorEnvironment,fetcher:typeof fetch=fetch){
 if(request.method!=='POST')return json({error:'method-not-allowed'},405);
 const origin=request.headers.get('origin');
 if(origin!==new URL(request.url).origin||request.headers.get('x-warma-consent')!==MIRROR_CONSENT_VERSION||!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))return json({error:'invalid-request'},403);
 let input;try {input=mirrorRequestSchema.parse(JSON.parse(await boundedText(request,8000)));}catch {return json({error:'invalid-request'},400);}
 if(requiresHumanSupport(input.text))return json(humanSupportReply());
 const config=configuration(env);
 if(!config)return json(localMirrorReply(input.stage));
 if(input.consent.provider!==config.provider)return json({error:'provider-changed'},409);
 const controller=new AbortController(),onAbort=()=>controller.abort();
 request.signal.addEventListener('abort',onAbort,{once:true});if(request.signal.aborted)controller.abort();
 const timeout=setTimeout(()=>controller.abort(),12000);
 try {
  const provider=createAIProvider(config,fetcher);
  for(let attempt=0;attempt<2;attempt++){
   if(controller.signal.aborted)throw new DOMException('Canceled','AbortError');
   // The binding is mandatory: absent/unavailable controls fail closed. It is
   // per Cloudflare location, NOT a global spending cap or authentication.
   const global=await env.WARMA_AI_LIMITER!.limit({key:'warma:mirror:all'});
   const ip=request.headers.get('cf-connecting-ip')||'unknown';
   const local=global.success?await env.WARMA_AI_LIMITER!.limit({key:'warma:mirror:'+ip}):{success:false};
   if(!global.success||!local.success)return json(localMirrorReply(input.stage,'rate-limited'),429);
   try {const reflection=await provider.generateReflection(input,controller.signal);return json({mode:'remote',provider:config.provider,reason:'generated',reflection});}
   catch(error){if(!(error instanceof ProviderFailure)||!error.transient||attempt===1||controller.signal.aborted)throw error;await delay(controller.signal);}
  }
 }catch {return json(localMirrorReply(input.stage,request.signal.aborted?'canceled':'provider-failed'));}
 finally {clearTimeout(timeout);request.signal.removeEventListener('abort',onAbort);}
 return json(localMirrorReply(input.stage,'provider-failed'));
}
