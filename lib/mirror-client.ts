import {MIRROR_CONSENT_VERSION,mirrorRequestSchema,mirrorReplySchema,mirrorStatusSchema,localMirrorReply,type MirrorRequest} from './mirror-contract';

export async function fetchMirrorStatus(signal:AbortSignal,fetcher:typeof fetch=fetch){
 const response=await fetcher('/api/espejo',{method:'GET',cache:'no-store',credentials:'same-origin',signal});
 if(!response.ok)throw new Error('La guía local sigue disponible.');
 return mirrorStatusSchema.parse(await response.json());
}
export function prepareMirrorTransmission(stage:number,text:string,question:string|null,provider:'openai'|'anthropic',accepted:boolean):MirrorRequest{
 if(!accepted)throw new Error('Autoriza este envío o continúa con la guía local.');
 return mirrorRequestSchema.parse({stage,text,question,consent:{version:MIRROR_CONSENT_VERSION,accepted:true,provider}});
}
export async function sendMirrorTransmission(input:MirrorRequest,signal:AbortSignal,fetcher:typeof fetch=fetch){
 const data=mirrorRequestSchema.parse(input);if(signal.aborted)throw new DOMException('Canceled','AbortError');
 try {
  const response=await fetcher('/api/espejo',{method:'POST',cache:'no-store',credentials:'same-origin',signal,headers:{'Content-Type':'application/json','X-Warma-Consent':MIRROR_CONSENT_VERSION},body:JSON.stringify(data)});
  if(signal.aborted)throw new DOMException('Canceled','AbortError');
  const result=mirrorReplySchema.safeParse(await response.json());
  if(result.success)return result.data;
  return localMirrorReply(data.stage,response.status===429?'rate-limited':'provider-failed');
 }catch(error){if(signal.aborted)throw error;return localMirrorReply(data.stage,'provider-failed');}
}
