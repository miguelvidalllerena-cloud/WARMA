'use client';
import { useSyncExternalStore } from 'react';
import { z } from 'zod';
import {wellbeingSchema,emptyWellbeing} from './warma-model';
import {onboardingSchema,onboardingDraftSchema,functionalProfile,preferenceContext} from './warma-onboarding';
import {assessmentStateSchema,emptyAssessmentState} from './warma-psychometrics';
import {pss10StateSchema,emptyPss10State} from './pss10-instrument';
import {contextualDraftSchema} from './warma-contextual';
import {CryptoService,CryptoFailure,isVaultEnvelope,parseVaultEnvelope,MAX_BACKUP_BYTES,type VaultEnvelope} from './crypto-service';
import {readLocalRecord,replaceLocalRecord} from './local-vault';
export type Region = 'world'|'focus'|'projects'|'memory'|'journal'|'observatory'|'path'|'missions'|'games'|'dreams'|'settings'|'story'|'mirror'|'garden'|'body'|'art'|'support';
export type Mood = 'FOCUS'|'REFLECTION'|'CREATIVITY'|'REST'|'PROGRESS';
export type Quality = 'auto'|'essential'|'balanced'|'immersive';
const str=z.string().max(50000),id=z.string().max(100),date=z.string().max(40);
export const missionSchema=z.object({id,title:str,kind:z.enum(['daily','weekly','side','exploration','project']),minutes:z.number().min(1).max(480),difficulty:z.enum(['Suave','Media','Alta']),xp:z.number().min(0).max(100),done:z.boolean(),createdAt:date,completedAt:date.optional()});
export const projectSchema=z.object({id,title:str,goal:str,deadline:date,notes:str,color:z.string().max(20),tasks:z.array(z.object({id,title:str,done:z.boolean()})).max(1000),files:z.array(z.object({id,name:str,type:str,data:z.string().max(6000000).regex(/^data:[^,]*;base64,[A-Za-z0-9+/=]*$/)})).max(20),createdAt:date,finished:z.boolean()});
const subjectSchema=z.object({id,title:str,color:z.string().max(20),createdAt:date});
const knowledgeSchema=z.object({id,subjectId:id,title:str,body:str,kind:z.enum(['concept','formula','flashcard','note','image']),answer:str,image:z.string().max(3000000).refine(v=>!v||/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]*$/.test(v)).optional(),links:z.array(id).max(1000),reviews:z.number().min(0),due:date,createdAt:date});
export const stateSchema=z.object({onboardingDismissed:z.boolean().default(false),pss10:pss10StateSchema.default(emptyPss10State),onboardingDraft:onboardingDraftSchema.nullable().default(null),assessment:assessmentStateSchema.default(emptyAssessmentState),contextualDraft:contextualDraftSchema.nullable().default(null),onboarding:onboardingSchema.nullable().default(null),wellbeing:wellbeingSchema.default(emptyWellbeing),schema:z.literal(1),seed:z.number().int(),name:z.string().max(80),createdAt:date,updatedAt:date,mood:z.enum(['FOCUS','REFLECTION','CREATIVITY','REST','PROGRESS']),prefs:z.object({quality:z.enum(['auto','essential','balanced','immersive']),sound:z.boolean(),haptics:z.boolean(),reducedMotion:z.boolean(),textScale:z.number().min(1).max(1.4)}),checkin:z.object({date,energy:z.enum(['baja','media','alta']),load:z.enum(['ligera','media','alta']),goal:z.enum(['estudiar','organizarme','reflexionar','descansar','crear'])}).nullable(),missions:z.array(missionSchema).max(20000),projects:z.array(projectSchema).max(1000),subjects:z.array(subjectSchema).max(1000),knowledge:z.array(knowledgeSchema).max(20000),journal:z.array(z.object({id,title:str,body:str,tags:z.array(str).max(30),createdAt:date,unlockDate:date.optional()})).max(20000),sessions:z.array(z.object({id,title:str,projectId:id,seconds:z.number().min(0),target:z.number().min(1),completed:z.boolean(),createdAt:date})).max(20000),timer:z.object({id,title:str,projectId:id,total:z.number().min(60).max(10800),remaining:z.number().min(0),endsAt:z.number().nullable(),createdAt:date}).nullable(),dreams:z.array(z.object({id,title:str,why:str,done:z.boolean(),createdAt:date})).max(1000),games:z.array(z.object({id,game:id,score:z.number().min(0),seconds:z.number().min(0),createdAt:date})).max(20000),events:z.array(z.object({id,type:id,title:str,xp:z.number().min(0).max(1000),createdAt:date})).max(50000),journalDraft:z.object({title:str,body:str,tags:str})});
export type WorldState=z.infer<typeof stateSchema>;
export type Mission=z.infer<typeof missionSchema>;
export type Project=z.infer<typeof projectSchema>;
export type Knowledge=z.infer<typeof knowledgeSchema>;
export const uid=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
export const today=()=>new Date().toLocaleDateString('en-CA');
export function seeded(seed:number){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export function blankState(seed=0):WorldState{return {onboardingDismissed:false,pss10:emptyPss10State(),onboardingDraft:null,assessment:emptyAssessmentState(),contextualDraft:null,onboarding:null,wellbeing:emptyWellbeing(),schema:1,seed,name:'',createdAt:'',updatedAt:'',mood:'PROGRESS',prefs:{quality:'auto',sound:false,haptics:false,reducedMotion:false,textScale:1},checkin:null,missions:[],projects:[],subjects:[],knowledge:[],journal:[],sessions:[],timer:null,dreams:[],games:[],events:[],journalDraft:{title:'',body:'',tags:''}};}
let snapshot={data:blankState(),ready:false,error:'',saving:false};
const serverSnapshot=snapshot,listeners=new Set<()=>void>();
const emit=()=>listeners.forEach(f=>f());
let database:IDBDatabase|null=null,initialization:Promise<void>|null=null,chain:Promise<unknown>=Promise.resolve(),channel:BroadcastChannel|null=null;
type Protection={status:'plain'|'locked'|'unlocked';busy:boolean};
let protection:Protection={status:'plain',busy:false};
const serverProtection=protection;
let cipher:CryptoService|null=null,securityEpoch=0;
let prepared:{token:string;original:unknown;envelope:VaultEnvelope;service:CryptoService;data:WorldState}|null=null;
export const getProtection=()=>protection;
export const encryptionAvailable=()=>CryptoService.available;
export function useProtection(){return useSyncExternalStore(f=>{listeners.add(f);return ()=>listeners.delete(f);},()=>protection,()=>serverProtection);}
export const getWorld=()=>snapshot.data;
export function useWorld(){return useSyncExternalStore(f=>{listeners.add(f);return ()=>listeners.delete(f);},()=>snapshot,()=>serverSnapshot);}
function openDB():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open('itaca-living-world',1);r.onupgradeneeded=()=>r.result.createObjectStore('world');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Cierra las otras pestañas de WARMA para actualizar el almacenamiento.'));});}
function requireDatabase(){if(!database)throw new Error('El almacenamiento no está disponible. Tu formulario se conserva.');return database;}
function lockedError(){return new CryptoFailure('LOCKED','Desbloquea tu espacio antes de guardar. Tus datos cifrados se conservan.');}
function parseProtectedWorld(text:string){try{return stateSchema.parse(JSON.parse(text));}catch {throw new CryptoFailure('FORMAT','El contenido del respaldo no es compatible con esta versión. Se conserva el original.');}}
function publish(data:WorldState){snapshot={data,ready:true,error:'',saving:false};emit();}
function announce(data:WorldState){channel?.postMessage({updatedAt:data.updatedAt});}
function queued<T>(job:()=>Promise<T>):Promise<T>{
 const result=chain.then(async()=>{protection={...protection,busy:true};snapshot={...snapshot,saving:true};emit();return job();})
  .catch(error=>{snapshot={...snapshot,saving:false,error:error instanceof Error?error.message:'No se pudo guardar. Se conserva el original.'};emit();throw error;})
  .finally(()=>{protection={...protection,busy:false};snapshot={...snapshot,saving:false};emit();});
 chain=result.catch(()=>{});return result;
}
export function discardPreparedEncryption(){prepared?.service.lock();prepared=null;}
export function lockWorld(){
 securityEpoch++;discardPreparedEncryption();
 if(protection.status==='plain'&&!cipher)return;
 cipher?.lock();cipher=null;
 protection={...protection,status:'locked'};snapshot={data:blankState(),ready:false,error:'',saving:false};emit();
}
async function refreshFromStorage(){
 const record=await readLocalRecord(requireDatabase()),epoch=securityEpoch;
 if(isVaultEnvelope(record)){
  if(!cipher){protection={...protection,status:'locked'};snapshot={data:blankState(),ready:false,error:'',saving:false};emit();return;}
  try {const next=parseProtectedWorld(await cipher.decrypt(record));if(epoch===securityEpoch)publish(next);}catch(error){lockWorld();throw error;}
 }else {
  if(cipher||protection.status==='locked'){lockWorld();throw new Error('El almacenamiento cambió mientras estaba protegido. Conserva una copia y vuelve a abrir WARMA.');}
  publish(stateSchema.parse(record));
 }
}
export async function initWorld(){
 if(initialization)return initialization;
 initialization=(async()=>{try{
  database=await openDB();
  await new Promise<void>((resolve,reject)=>{
   const tx=database!.transaction('world','readwrite'),store=tx.objectStore('world'),r=store.get('current');let next:WorldState|undefined,encrypted=false;
   r.onsuccess=()=>{try{
    if(isVaultEnvelope(r.result)){protection={...protection,status:'locked'};encrypted=true;parseVaultEnvelope(r.result);}
    else if(r.result){next=stateSchema.parse(r.result);}
    else {if(protection.status==='locked')throw lockedError();next=blankState(crypto.getRandomValues(new Uint32Array(1))[0]);next.createdAt=next.updatedAt=new Date().toISOString();store.put(next,'current');}
   }catch(error){tx.abort();reject(error);}};
   tx.oncomplete=()=>{if(encrypted){snapshot={data:blankState(),ready:false,error:'',saving:false};emit();}else if(next)publish(next);resolve();};
   tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(new Error('No se pudieron leer tus datos. Conservamos el archivo original.'));
  });
  if('BroadcastChannel' in window){channel=new BroadcastChannel('itaca-world');channel.onmessage=()=>{void queued(refreshFromStorage).catch(()=>{});};}
 }catch(error){snapshot={...snapshot,ready:protection.status!=='locked',error:error instanceof Error?error.message:'No se pudo abrir el almacenamiento local.',saving:false};emit();initialization=null;throw error;}})();
 return initialization;
}
export function mutateWorld(change:(d:WorldState)=>void):Promise<void>{return queued(async()=>{
 const db=requireDatabase();if(protection.status==='locked')throw lockedError();
 if(cipher){
  const service=cipher,epoch=securityEpoch;
  for(let attempt=0;attempt<3;attempt++){
   const original=await readLocalRecord(db);
   if(!isVaultEnvelope(original)){lockWorld();throw new Error('El archivo protegido cambió. No se ha sobrescrito.');}
   let next:WorldState;try{next=parseProtectedWorld(await service.decrypt(original));}catch(error){lockWorld();throw error;}
   change(next);next.updatedAt=new Date().toISOString();next=stateSchema.parse(next);
   const envelope=await service.encrypt(JSON.stringify(next));
   if(epoch!==securityEpoch)throw lockedError();
   if(await replaceLocalRecord(db,original,envelope,()=>epoch===securityEpoch)){
    if(epoch===securityEpoch)publish(next);announce(next);return;
   }
  }
  throw new Error('Otra pestaña modificó tus datos. No se ha sobrescrito su cambio. Vuelve a intentarlo.');
 }
 await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction('world','readwrite'),store=tx.objectStore('world'),r=store.get('current');let next:WorldState;
  r.onsuccess=()=>{try{
   if(isVaultEnvelope(r.result)){protection={...protection,status:'locked'};lockWorld();throw lockedError();}
   next=stateSchema.parse(r.result||snapshot.data);change(next);next.updatedAt=new Date().toISOString();next=stateSchema.parse(next);store.put(next,'current');
  }catch(error){tx.abort();reject(error);}};
  tx.oncomplete=()=>{publish(next);announce(next);resolve();};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('No se pudo guardar. Conserva una copia y vuelve a intentarlo.'));
 });
});}

export function prepareLocalEncryption(passphrase:string){const requestedEpoch=securityEpoch;return queued(async()=>{
 if(requestedEpoch!==securityEpoch)throw lockedError();
 if(protection.status!=='plain')throw new Error('Este espacio ya tiene cifrado.');
 discardPreparedEncryption();const original=await readLocalRecord(requireDatabase());
 if(isVaultEnvelope(original)){protection={...protection,status:'locked'};lockWorld();throw lockedError();}
 const data=stateSchema.parse(original),service=await CryptoService.create(passphrase);
 try {
  const envelope=await service.encrypt(JSON.stringify(data));
  if(JSON.stringify(parseProtectedWorld(await service.decrypt(envelope)))!==JSON.stringify(data))throw new Error('No se pudo verificar el respaldo. El original no se ha cambiado.');
  if(requestedEpoch!==securityEpoch)throw lockedError();
  const token=uid();prepared={token,original,envelope,service,data};return {token,filename:`warma-respaldo-cifrado-${today()}.json`};
 }catch(error){service.lock();throw error;}
});}
export function downloadPreparedEncryption(token:string){
 if(!prepared||prepared.token!==token)throw new Error('Prepara de nuevo el respaldo cifrado.');
 downloadBlob(new Blob([JSON.stringify(prepared.envelope,null,2)],{type:'application/json'}),`warma-respaldo-cifrado-${today()}.json`);
}
export function activateLocalEncryption(token:string,acknowledgement:{backupSaved:boolean;phraseSaved:boolean}){return queued(async()=>{
 if(!acknowledgement.backupSaved||!acknowledgement.phraseSaved)throw new Error('Confirma que conservas el respaldo y tu frase antes de activar el cifrado.');
 const p=prepared;if(!p||p.token!==token||protection.status!=='plain')throw new Error('Prepara de nuevo el respaldo cifrado.');
 if(!await replaceLocalRecord(requireDatabase(),p.original,p.envelope)){
  discardPreparedEncryption();throw new Error('Tus datos cambiaron después del respaldo. Prepara uno nuevo; el original sigue intacto.');
 }
 cipher=p.service;prepared=null;securityEpoch++;protection={...protection,status:'unlocked'};publish(p.data);announce(p.data);
});}
export function unlockWorld(passphrase:string){const requestedEpoch=securityEpoch;return queued(async()=>{
 const db=requireDatabase(),epoch=requestedEpoch;if(epoch!==securityEpoch)throw lockedError();
 for(let attempt=0;attempt<3;attempt++){
  const original=await readLocalRecord(db);if(!isVaultEnvelope(original))throw new Error('No hay un archivo cifrado compatible para desbloquear.');
  const opened=await CryptoService.open(passphrase,original);
  try {
   const data=parseProtectedWorld(opened.plaintext);
   if(JSON.stringify(await readLocalRecord(db))!==JSON.stringify(original)){opened.service.lock();continue;}
   if(epoch!==securityEpoch)throw lockedError();
   cipher?.lock();cipher=opened.service;securityEpoch++;protection={...protection,status:'unlocked'};publish(data);return;
  }catch(error){opened.service.lock();throw error;}
 }
 throw new Error('Otra pestaña cambió el archivo. Vuelve a intentarlo.');
});}
export function reward(d:WorldState,key:string,type:string,title:string,xp:number){if(!d.events.some(e=>e.id===key))d.events.push({id:key,type,title,xp,createdAt:new Date().toISOString()});}
export function addMission(title:string,kind:Mission['kind']='side',minutes=15,difficulty:Mission['difficulty']='Media'){if(!title.trim())throw new Error('Escribe el objetivo.');const m:Mission={id:uid(),title:title.trim(),kind,minutes,difficulty,xp:difficulty==='Alta'?35:difficulty==='Media'?20:10,done:false,createdAt:new Date().toISOString()};return mutateWorld(d=>{d.missions.push(m);});}
export function toggleMission(id:string){return mutateWorld(d=>{const m=d.missions.find(m=>m.id===id);if(!m)return;m.done=!m.done;m.completedAt=m.done?new Date().toISOString():undefined;if(m.done)reward(d,'mission:'+id,'mission_completed',m.title,m.xp);});}
export function saveProject(p:Project){return mutateWorld(d=>{const i=d.projects.findIndex(x=>x.id===p.id);if(i<0)d.projects.push(p);else d.projects[i]=p;if(projectProgress(p)===100)reward(d,'project:'+p.id,'project_completed',p.title,100);});}
export function projectProgress(p:Project){return p.tasks.length?Math.round(p.tasks.filter(t=>t.done).length/p.tasks.length*100):p.finished?100:0;}
export const xp=(d:WorldState)=>d.events.reduce((n,e)=>n+e.xp,0);
export const levels=['Núcleo','Pequeña isla','Ecosistema','Arquitectura','Ciudad del conocimiento','Sistema planetario','Universo personal'];
export const thresholds=[0,40,150,400,900,1800,3600];
export const level=(d:WorldState)=>thresholds.reduce((l,t,i)=>xp(d)>=t?i:l,0);
export function streak(d:WorldState){const days=new Set(d.events.map(e=>new Date(e.createdAt).toLocaleDateString('en-CA')));let n=0,dt=new Date();if(!days.has(today()))dt.setDate(dt.getDate()-1);while(days.has(dt.toLocaleDateString('en-CA'))){n++;dt.setDate(dt.getDate()-1);}return n;}
export function recommendation(d:WorldState){
 const hour=d.createdAt?new Date().getHours():12,c=d.checkin?.date===today()?d.checkin:null;
 if(c||d.onboarding){const context=preferenceContext(d),profile=functionalProfile(context.preferences,hour);return {...profile,reason:context.source+'. '+profile.reason};}
 const urgent=d.projects.find(p=>p.deadline&&projectProgress(p)<100&&new Date(p.deadline).getTime()-Date.now()<3*86400000);
 if(urgent)return {region:'projects' as Region,minutes:15,title:`Un paso en ${urgent.title}`,reason:'Este proyecto tiene una entrega próxima y trabajo pendiente. Puedes cambiar el siguiente paso.'};
 const minutes=hour>=22?5:15;
 return {region:'focus' as Region,minutes,title:`Haz espacio para ${minutes} minutos`,reason:hour>=22?'Es tarde en tu dispositivo. Sugerimos una sesión breve; tú decides.':'Aún no has hecho el check-in de hoy. Esta es una sugerencia inicial que puedes ajustar.'};
}
export const achievements=(d:WorldState)=>[{name:'Primer paso',description:'Completa una sesión de enfoque.',unlocked:d.sessions.some(s=>s.completed),object:'Semilla de cristal'},{name:'Cartógrafo',description:'Completa 10 misiones.',unlocked:d.missions.filter(m=>m.done).length>=10,object:'Brújula mineral'},{name:'Arquitecto',description:'Finaliza un proyecto.',unlocked:d.projects.some(p=>projectProgress(p)===100),object:'Obelisco'},{name:'Astrónomo',description:'Escribe 30 reflexiones.',unlocked:d.journal.filter(j=>!j.unlockDate).length>=30,object:'Astrolabio'}];
export function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
export async function backupJSON(){
 // Export the committed original, including ciphertext while locked. This
 // never exports a decrypted copy of a protected world.
 const original=await readLocalRecord(requireDatabase());
 if(original===undefined)throw new Error('No hay un archivo que respaldar.');
 const text=JSON.stringify(original,null,2);
 if(isVaultEnvelope(original)&&new TextEncoder().encode(text).length>MAX_BACKUP_BYTES)throw new Error('El respaldo cifrado supera 40 MB. No se han cambiado tus datos.');
 return {text,encrypted:isVaultEnvelope(original)};
}
export async function downloadJSON(){const backup=await backupJSON();downloadBlob(new Blob([backup.text],{type:'application/json'}),`warma-respaldo-${backup.encrypted?'cifrado-':''}${today()}.json`);}
export async function importJSON(file:File,passphrase?:string){
 const requestedEpoch=securityEpoch;
 if(file.size>MAX_BACKUP_BYTES)throw new Error('El respaldo supera 40 MB.');
 const content=JSON.parse(await file.text());
 if(!isVaultEnvelope(content)){const next=stateSchema.parse(content);await mutateWorld(d=>{Object.assign(d,next);});return;}
 const opened=await CryptoService.open(passphrase||'',content);
 try {
  const next=parseProtectedWorld(opened.plaintext);
  await queued(async()=>{
   if(requestedEpoch!==securityEpoch)throw lockedError();
   const db=requireDatabase(),original=await readLocalRecord(db),epoch=securityEpoch;
   // An unlocked protected space keeps its current passphrase. A locked or
   // legacy space adopts the authenticated encrypted backup explicitly.
   const active=cipher,record=active?await active.encrypt(JSON.stringify(next)):parseVaultEnvelope(content);
   if(!await replaceLocalRecord(db,original,record,()=>epoch===securityEpoch))throw new Error('El almacenamiento cambió. El respaldo no se ha restaurado.');
   if(epoch!==securityEpoch)return;
   if(!active){cipher=opened.service;securityEpoch++;}
   protection={...protection,status:'unlocked'};discardPreparedEncryption();publish(next);announce(next);
  });
 }finally {if(cipher!==opened.service)opened.service.lock();}
}
export async function resetWorld(){await mutateWorld(d=>{const next=blankState(crypto.getRandomValues(new Uint32Array(1))[0]);next.createdAt=new Date().toISOString();Object.assign(d,next);});}
export function remainingSeconds(t:WorldState['timer']){return t?t.endsAt?Math.max(0,Math.ceil((t.endsAt-Date.now())/1000)):t.remaining:0;}
export async function finishSession(expectedId:string){return mutateWorld(d=>{const t=d.timer;if(!t||t.id!==expectedId)return;const left=remainingSeconds(t),seconds=Math.max(0,t.total-left);if(seconds>0){d.sessions.push({id:t.id,title:t.title,projectId:t.projectId,seconds,target:t.total,completed:left===0,createdAt:new Date().toISOString()});reward(d,'session:'+t.id,'focus_session_completed',t.title,Math.min(120,Math.floor(seconds/60)*2));}d.timer=null;});}
