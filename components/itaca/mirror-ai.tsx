'use client';
import {useEffect,useRef,useState} from 'react';
import {Feather,ShieldCheck,X} from 'lucide-react';
import {mirrorStages,requiresHumanSupport,humanSupportReply,localMirrorReply,type MirrorReply,type MirrorRequest,type MirrorStatus} from '@/lib/mirror-contract';
import {fetchMirrorStatus,prepareMirrorTransmission,sendMirrorTransmission} from '@/lib/mirror-client';
import {mutateWorld,uid} from '@/lib/itaca-store';
import {Modal,act} from './ui';

export default function MirrorAI({onSupport}:{onSupport:()=>void}){
 const [status,setStatus]=useState<MirrorStatus|null>(null),[stage,setStage]=useState(0),[text,setText]=useState(''),[reply,setReply]=useState<MirrorReply|null>(null);
 const [pending,setPending]=useState<{stage:number;text:string;question:string|null}|null>(null),[accepted,setAccepted]=useState(false),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false);
 const submitting=useRef(false),controller=useRef<AbortController|null>(null),generation=useRef(0);
 useEffect(()=>{
  const cancel=new AbortController(),timeout=setTimeout(()=>cancel.abort(),5000);let current=true;
  void fetchMirrorStatus(cancel.signal).then(value=>{if(current)setStatus(value);}).catch(()=>{if(current)setStatus({available:false,provider:null,providerLabel:'Guía local',policyURL:null,reason:'not-configured'});}).finally(()=>clearTimeout(timeout));
  return ()=>{current=false;clearTimeout(timeout);cancel.abort();generation.current++;controller.current?.abort();};
 },[]);
 function cancel(){generation.current++;controller.current?.abort();controller.current=null;submitting.current=false;setBusy(false);setPending(null);setAccepted(false);}
 function request(event:React.FormEvent){
  event.preventDefault();if(submitting.current||!text.trim()||!status?.available||!status.provider)return;
  if(requiresHumanSupport(text)){setReply(humanSupportReply());return;}
  setPending({stage,text:text.trim(),question:reply?.reflection.question||null});setAccepted(false);
 }
 async function transmit(){
  if(submitting.current||!pending||!accepted||!status?.provider)return;
  let payload:MirrorRequest;try{payload=prepareMirrorTransmission(pending.stage,pending.text,pending.question,status.provider,accepted);}catch(error){await act(async()=>{throw error;});return;}
  submitting.current=true;setBusy(true);setSaved(false);const request=++generation.current,cancel=new AbortController();controller.current=cancel;
  const timeout=setTimeout(()=>cancel.abort(),15000);
  try {const result=await sendMirrorTransmission(payload,cancel.signal);if(request!==generation.current)return;setReply(result);setText('');setPending(null);setAccepted(false);}
  catch {if(request===generation.current){setReply(localMirrorReply(payload.stage,'provider-failed'));setPending(null);setAccepted(false);}}
  finally {clearTimeout(timeout);if(request===generation.current){submitting.current=false;controller.current=null;setBusy(false);}}
 }
 async function save(){
  if(!reply||submitting.current||saved)return;submitting.current=true;setBusy(true);
  const body=[reply.reflection.acknowledgement,reply.reflection.question,reply.reflection.nextStep].filter(Boolean).join('\n\n');
  const ok=await act(()=>mutateWorld(d=>{d.journal.push({id:uid(),title:'Un próximo paso · Espejo',body,tags:[reply.mode==='remote'?'Espejo con IA':'guía local'],createdAt:new Date().toISOString()});}),'Guardado en tu Bitácora local');
  submitting.current=false;setBusy(false);if(ok)setSaved(true);
 }
 if(!status)return <p className="small muted" role="status">La guía local está disponible. Comprobando el modo opcional…</p>;
 if(!status.available)return <p className="small muted">IA externa no configurada en esta instalación. Puedes usar todas las rutas de la guía local.</p>;
 return <details className="mirror-ai"><summary>Explorar con IA · opcional</summary>
  <div className="form-stack"><p>Una pregunta a la vez. Puedes continuar con la guía local sin enviar nada.</p>
   <span className="eyebrow">{String(stage+1).padStart(2,'0')} / 05 · {mirrorStages[stage]}</span>
   {reply&&<div className="mirror-ai-reply" aria-live="polite"><span className="privacy-line">{reply.mode==='remote'?`Respuesta generada · ${status.providerLabel}`:reply.mode==='human-support'?'Apoyo humano':'Guía local · respuesta predefinida'}</span><p>{reply.reflection.acknowledgement}</p><h3>{reply.reflection.question}</h3>{reply.reflection.nextStep&&<p>{reply.reflection.nextStep}</p>}</div>}
   {reply?.mode==='human-support'?<button className="btn primary" onClick={onSupport}>Hablar con una persona</button>:<>
    <form className="form-stack" onSubmit={request}><label className="field-label">{reply?'Lo que quieres responder':'La situación que quieres ordenar'}<textarea maxLength={1500} value={text} onChange={e=>setText(e.target.value)} disabled={busy} placeholder="Escribe sin nombres ni detalles que quieras mantener privados."/></label>
     <div className="button-row"><button className="btn secondary" disabled={busy||!text.trim()}>Revisar antes de enviar <ShieldCheck size={16}/></button>{busy&&<button type="button" className="text-link" onClick={cancel}>Cancelar <X size={16}/></button>}</div>
    </form>
    {reply&&<div className="button-row">{stage<4?<button className="text-link" disabled={busy} onClick={()=>{setStage(stage+1);setText('');}}>Pasar a {mirrorStages[stage+1]}</button>:<button className="btn secondary" disabled={busy||saved} onClick={save}><Feather size={16}/>{saved?'Guardado en mi Bitácora':'Guardar este próximo paso'}</button>}<button className="text-link" disabled={busy} onClick={()=>{cancel();setStage(0);setReply(null);setText('');setSaved(false);}}>Empezar de nuevo</button></div>}
   </>}
   <p className="small muted">No ofrece diagnósticos ni supervisa emergencias. Los textos enviados pueden ser procesados por el proveedor; la conversación no se guarda automáticamente.</p>
  </div>
  <Modal open={!!pending} onOpen={value=>{if(!value)cancel();}} title="Decide qué sale de tu espacio." description={`Destino: ${status.providerLabel} · una reflexión breve`}>
   <div className="form-stack"><p>Se enviarán únicamente este texto, la pregunta anterior visible y la etapa. No se añaden tu nombre, Bitácora, PSS-10 ni historial. Si el proveedor limita temporalmente la petición, se puede reintentar una vez.</p>
    {pending?.question&&<blockquote className="mirror-consent-text">{pending.question}</blockquote>}<p className="mirror-consent-text">{pending?.text}</p>
    {status.policyURL&&<a className="text-link" href={status.policyURL} target="_blank" rel="noopener noreferrer">Privacidad de {status.providerLabel}</a>}
    <label className="vault-confirm"><input type="checkbox" checked={accepted} disabled={busy} onChange={e=>setAccepted(e.target.checked)}/><span>Autorizo este envío al proveedor. Puedo elegir la guía local.</span></label>
    <div className="button-row"><button className="btn primary" disabled={busy||!accepted} onClick={transmit}>{busy?'Esperando respuesta…':'Enviar este texto'}</button><button className="btn secondary" onClick={cancel}>Cancelar envío</button></div>
   </div>
  </Modal>
 </details>;
}
