'use client';
import {useEffect,useRef,useState} from 'react';
import {Compass,Feather,ShieldCheck,Wind} from 'lucide-react';
import type {Region,WorldState} from '@/lib/itaca-store';
import {mutateWorld,today,uid} from '@/lib/itaca-store';
import {draftForLater,emptyFunctionalPreferences,functionalProfile,onboardingSchema,type FunctionalPreferences} from '@/lib/warma-onboarding';
import {knotDisclaimer} from '@/lib/warma-psychometrics';
import {Choices,Modal,act} from './ui';
import WarmaEvaluation from './warma-evaluation';
import OnboardingKnot from './onboarding-knot';

const stages=['Bienvenida','Privacidad','Autochequeo','Mi ritmo','Entrar'];
const loads=['Ligera','Intermedia','Alta'],energies=['Baja','Intermedia','Alta'];
const goals={estudiar:'Concentrarme',organizarme:'Organizar un paso',reflexionar:'Escribir',descansar:'Hacer una pausa',crear:'Crear'};
const questions=['¿Cómo sientes tu carga hoy?','¿Con qué energía llegas?','¿Qué necesitas primero?'];
const preferenceKeys=['load','energy','goal'] as const;

export default function WarmaOnboarding({open,onOpen,data,navigate,reduced=false}:{open:boolean;onOpen:(open:boolean)=>void;data:WorldState;navigate:(r:Region,minutes?:number)=>void;reduced?:boolean}){
 const [stage,setStage]=useState(0),[consent,setConsent]=useState(false),[prefs,setPrefs]=useState<FunctionalPreferences>(emptyFunctionalPreferences),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false),[question,setQuestion]=useState(0);
 const submitting=useRef(false),heading=useRef<HTMLHeadingElement>(null),resume=useRef<{stage:number;question:number}|null>(null);
 // Reset only on opening: a successful save must not reset the current scene.
 useEffect(()=>{if(!open)return;setStage(0);setConsent(false);setPrefs(data.onboardingDraft?.preferences||data.onboarding?.preferences||emptyFunctionalPreferences());setQuestion(data.onboardingDraft?.question||0);setSaved(false);resume.current=null;},[open]);
 useEffect(()=>{if(open)heading.current?.focus({preventScroll:true});},[stage,question,open]);
 const profile=functionalProfile(prefs);
 async function complete(){
  if(submitting.current||!consent||stage!==3||question!==2)return;
  submitting.current=true;setBusy(true);
  try{
   const record=onboardingSchema.parse({version:1,kind:'preferences',privacyVersion:'2026-10-04',completedAt:new Date().toISOString(),preferences:prefs});
   if(await act(()=>mutateWorld(d=>{
    d.onboarding=record;d.onboardingDraft=null;d.onboardingDismissed=true;
    // Only an explicit complete check-in becomes today's register.
    if(prefs.load&&prefs.energy&&prefs.goal){
     d.checkin={date:today(),load:prefs.load,energy:prefs.energy,goal:prefs.goal};
     d.wellbeing.checkins.push({id:uid(),load:prefs.load,energy:prefs.energy,createdAt:record.completedAt});
    }
    if(prefs.goal)d.mood=prefs.goal==='descansar'?'REST':prefs.goal==='reflexionar'?'REFLECTION':prefs.goal==='crear'?'CREATIVITY':prefs.goal==='estudiar'?'FOCUS':'PROGRESS';
   }))){setSaved(true);setStage(4);}
  }finally{submitting.current=false;setBusy(false);}
 }
 async function saveForLater(){
  if(submitting.current||!consent||stage<2||stage>3)return;
  submitting.current=true;setBusy(true);
  try{const draft=draftForLater(stage,question,prefs,new Date().toISOString());if(await act(()=>mutateWorld(d=>{d.onboardingDraft=draft;d.onboardingDismissed=true;}),'Punto de partida guardado. Puedes retomarlo desde Inicio.'))onOpen(false);}finally{submitting.current=false;setBusy(false);}
 }
 async function discardDraft(){
  if(submitting.current||!data.onboardingDraft)return;
  submitting.current=true;setBusy(true);
  try{if(await act(()=>mutateWorld(d=>{d.onboardingDraft=null;}),'Borrador de bienvenida descartado')){setPrefs(data.onboarding?.preferences||emptyFunctionalPreferences());setQuestion(0);resume.current=null;}}finally{submitting.current=false;setBusy(false);}
 }
 async function omit(){
  if(submitting.current)return;
  submitting.current=true;setBusy(true);
  try{
   // A minimal local dismissal is not consent, an answer or an assessment.
   // Storage failure must never prevent access to the tools.
   await act(()=>mutateWorld(d=>{d.onboardingDismissed=true;}));
   onOpen(false);
  }finally{submitting.current=false;setBusy(false);}
 }
 function forward(){
  if(busy)return;
  if(stage===1){if(!consent)return;if(resume.current){setQuestion(resume.current.question);setStage(resume.current.stage);resume.current=null;return;}}
  if(stage===3){if(question<2)setQuestion(question+1);return;}
  if(stage===2)setQuestion(0);
  setStage(Math.min(4,stage+1));
 }
 function back(){if(stage===3&&question>0)setQuestion(question-1);else if(stage>0)setStage(stage-1);else return omit();}
 return <Modal open={open} onOpen={v=>{if(!busy){if(v||stage===4)onOpen(v);else void omit();}}} wide className="onboarding-dialog" reduced={reduced} closeDisabled={busy} title="Tu punto de partida" description="Un inicio voluntario. Puedes omitirlo y usar todas las herramientas.">
  <div className={'warma-onboarding '+(reduced?'onboarding-still':'')} data-stage={stage} aria-busy={busy}>
   <ol className="onboarding-stages" aria-label="Pasos de bienvenida">{stages.map((label,i)=><li key={label} aria-current={i===stage?'step':undefined}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><span>{label}</span></li>)}</ol>
   <div className="onboarding-layout">
    {open&&<OnboardingKnot preferences={prefs} stage={stage} reduced={reduced}/>}
    <div className="onboarding-content">
     <div className="onboarding-page" key={stage+'-'+(stage===3?question:'')}>
      <span className="eyebrow">WARMA / {String(stage+1).padStart(2,'0')}{stage===3?` · PREFERENCIA ${question+1} / 3`:''}</span>
      <h2 tabIndex={-1} ref={heading}>{stage===3?questions[question]:['Tu ritmo es el punto de partida.','Antes de escribir, tú decides.','Un momento para observarte.','','Tu espacio está listo.'][stage]}</h2>
      {stage===0&&<><p>Organizar, pausar y reflexionar. Elige qué necesitas ahora; podrás cambiar de dirección cuando quieras.</p><div className="onboarding-principles"><span><Compass size={22}/>Un paso posible</span><span><Wind size={22}/>Espacio para parar</span><span><Feather size={22}/>Tus propias palabras</span></div>{data.onboardingDraft&&<div className="onboarding-resume"><span className="eyebrow">UN INICIO QUE PUEDES RETOMAR</span><p>Tus elecciones están guardadas. Revisarás la privacidad antes de continuar.</p><button className="btn secondary" disabled={busy} onClick={()=>{resume.current={stage:data.onboardingDraft!.stage,question:data.onboardingDraft!.question};setStage(1);}}>Retomar mi punto de partida</button><button className="text-link" disabled={busy} onClick={discardDraft}>Descartar sólo este borrador de bienvenida</button></div>}<p className="onboarding-note">No necesitas una cuenta. Ninguna herramienta depende de completar esta bienvenida.</p></>}
      {stage===1&&<><div className="onboarding-privacy"><ShieldCheck size={25}/><div><h3>En este dispositivo</h3><p>Las preferencias y los registros se guardan en el navegador. Por defecto tus registros no se envían a una nube o modelo. El modo opcional con IA del Espejo, cuando esté disponible, pide permiso antes de cada envío y no añade tus evaluaciones ni Bitácora.</p><p>El cifrado local es opcional y se activa con una frase desde Preferencias. Mientras no lo actives, las personas con acceso a este navegador podrían leer tus registros. Si ya lo activaste, los nuevos registros y respaldos se guardan cifrados; son visibles mientras usas WARMA desbloqueada.</p></div></div><label className="onboarding-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Quiero guardar mis preferencias en este dispositivo. Entiendo cómo se almacenan.</span></label><p className="onboarding-note">Puedes salir sin guardar. Esto no autoriza compartir datos ni participar en una investigación. El autochequeo, cuando esté disponible, tendrá su propio consentimiento opcional.</p></>}
      {stage===2&&<WarmaEvaluation data={data} onContinue={()=>{setQuestion(0);setStage(3);}}/>}
      {stage===3&&<><p>Elige sólo lo que quieras. Estas preferencias orientan sugerencias y no generan una puntuación psicológica.</p><fieldset className="onboarding-fields" disabled={busy}><legend>Mi registro voluntario</legend>{question===0&&<div><span className="field-label">Mi carga hoy</span><Choices value={prefs.load?loads[['ligera','media','alta'].indexOf(prefs.load)]:''} onChange={v=>setPrefs(p=>({...p,load:(['ligera','media','alta'] as const)[loads.indexOf(v)]}))} options={loads} label="Carga de hoy"/></div>}{question===1&&<div><span className="field-label">Mi energía hoy</span><Choices value={prefs.energy?energies[['baja','media','alta'].indexOf(prefs.energy)]:''} onChange={v=>setPrefs(p=>({...p,energy:(['baja','media','alta'] as const)[energies.indexOf(v)]}))} options={energies} label="Energía de hoy"/></div>}{question===2&&<div><span className="field-label">Quiero empezar por</span><Choices value={prefs.goal?goals[prefs.goal]:''} onChange={v=>setPrefs(p=>({...p,goal:Object.keys(goals).find(k=>goals[k as keyof typeof goals]===v) as FunctionalPreferences['goal']}))} options={Object.values(goals)} label="Mi prioridad"/></div>}<button className="text-link" onClick={()=>{setPrefs(p=>({...p,[preferenceKeys[question]]:null}));if(question<2)setQuestion(question+1);}}>Omitir esta preferencia</button><button className="text-link" onClick={()=>{setPrefs(emptyFunctionalPreferences());setQuestion(0);}}>Prefiero no responder</button></fieldset><div className="functional-profile" aria-live="polite"><span className="eyebrow">TU PERFIL FUNCIONAL · PREFERENCIAS</span><h3>{profile.title}</h3>{data.checkin?.date===today()&&!(prefs.load&&prefs.energy&&prefs.goal)&&<p className="onboarding-note">El check-in de hoy seguirá teniendo prioridad. Guardar preferencias incompletas no sustituye ese registro.</p>}<details className="recommendation-explanation"><summary>¿Por qué WARMA me recomienda esto?</summary><p>{profile.reason}</p><p className="onboarding-note">No es un perfil psicológico. No usamos respuestas omitidas, IA, baremos ni un supuesto nivel de salud.</p></details></div></>}
      {stage===4&&<><div className="functional-profile"><span className="eyebrow">PREFERENCIAS GUARDADAS</span><h3>{profile.title}</h3><p>{profile.reason}</p></div><p>{knotDisclaimer}</p><p>Tu jardín crecerá con pausas y acciones reales. Completar esta bienvenida no otorga puntos ni modifica tus logros.</p><button className="btn primary" onClick={()=>{onOpen(false);navigate(profile.region,profile.region==='focus'?profile.minutes:undefined);}}>Explorar mi propuesta</button><button className="text-link" onClick={()=>onOpen(false)}>Volver a mi espacio</button></>}
     </div>
     {stage<4&&<div className="onboarding-actions"><button className="btn secondary" disabled={busy} onClick={back}>{stage>0?'Volver':'Omitir por ahora'}</button>{stage===2?null:stage===3&&question===2?<button className="btn primary" disabled={busy||!consent} onClick={complete}>{busy?'Guardando…':'Guardar mi punto de partida'}</button>:<button className="btn primary" disabled={busy||(stage===1&&!consent)} onClick={forward}>Continuar</button>}</div>}
     {stage>=2&&stage<4&&<button className="text-link onboarding-save" disabled={busy||!consent} onClick={saveForLater}>Guardar y continuar luego</button>}
     {stage>0&&stage<4&&<button className="text-link onboarding-skip" disabled={busy} onClick={()=>void omit()}>Omitir por ahora</button>}
    </div>
   </div>
   <span className="sr-only" role="status">{saved?'Preferencias guardadas en este dispositivo.':''}</span>
  </div>
 </Modal>;
}
