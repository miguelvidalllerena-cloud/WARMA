'use client';
import {useEffect,useRef,useState} from 'react';
import type {WorldState} from '@/lib/itaca-store';
import {pss10Availability,pss10Disclaimer,pss10Metadata,pss10Permission,pss10Progress,pss10Slots,pss10History,type ProtectedInstrumentContent} from '@/lib/pss10-instrument';
import {beginPss10,savePss10Answer,navigatePss10,finishPss10,discardPss10Draft,deletePss10Data} from '@/lib/pss10-store';
import {act,Choices,Confirm} from './ui';

export default function WarmaEvaluation({data,content=null,onContinue}:{data:WorldState;content?:ProtectedInstrumentContent|null;onContinue?:()=>void}){
 const [preview,setPreview]=useState(false),[cursor,setCursor]=useState(0),[consent,setConsent]=useState(false),[busy,setBusy]=useState(false),[remove,setRemove]=useState(false);
 const working=useRef(false),question=useRef<HTMLHeadingElement>(null),status=pss10Availability(content),draft=data.pss10.draft;
 const live=status.available&&!!draft,current=live?draft.cursor:cursor,slot=pss10Slots[current],progress=draft?pss10Progress(draft):null;
 const history=status.available?pss10History(data.pss10.results):null,result=history?.latest;
 useEffect(()=>{if(preview||live||result)question.current?.focus({preventScroll:true});},[current,preview,live,result?.completedAt]);
 async function run(task:()=>Promise<void>){if(working.current)return;working.current=true;setBusy(true);try{await act(task);}finally{working.current=false;setBusy(false);}}
 const start=()=>{if(consent&&status.available)void run(beginPss10);};
 return <div className="warma-evaluation" aria-busy={busy}>
  {!live&&!result&&<>
   <div className="instrument-intro"><h3>Un autochequeo, si te sirve.</h3><p>Antes de comenzar, puedes responder 10 preguntas breves sobre cómo has percibido el último mes.</p></div>
   <p className="onboarding-disclaimer">No es un diagnóstico ni una evaluación psicológica. Tus respuestas pueden ayudarte a reflexionar y elegir cómo empezar en WARMA. Puedes omitirlo.</p>
   <p className="onboarding-note">Se guardan sólo en este dispositivo. No se envían a servidores, publicidad ni analytics. Si activas el cifrado en Preferencias, también quedan protegidas. No necesitas responder para usar las herramientas.</p>
   {!status.available&&<><p className="assessment-pending">El autochequeo PSS-10 está en preparación: todavía falta verificar la autorización para incorporarlo. Puedes entrar directamente o elegir cómo empezar, sin responderlo.</p>{onContinue&&<button className="btn primary" disabled={busy} onClick={onContinue}>Elegir cómo empezar</button>}</>}
  </>}
  {status.available&&!draft&&!result&&<>
   <p>{content?.instructions}</p>
   <label className="onboarding-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Quiero responder y guardar este autochequeo en este dispositivo. Puedo omitir o salir. Se necesitan al menos ocho respuestas válidas para calcular.</span></label>
   <button className="btn primary" disabled={!consent||busy} onClick={start}>Comenzar</button>
  </>}
  {!status.available&&draft&&<><p className="onboarding-note">Hay un borrador local. No se reanuda mientras el autochequeo siga desactivado.</p><button className="text-link" disabled={busy} onClick={()=>void run(discardPss10Draft)}>Descartar sólo este borrador PSS-10</button></>}
  {live&&content&&<div className="assessment-question">
   <div className="assessment-progress"><span className="eyebrow">PSS-10 · A TU RITMO</span><span aria-live="polite">{String(current+1).padStart(2,'0')} / 10</span></div>
   <div className="assessment-progress-track" role="progressbar" aria-label="Respuestas completadas" aria-valuemin={0} aria-valuemax={10} aria-valuenow={progress!.answered}><span style={{width:`${progress!.answered*10}%`}}/></div>
   <h4 ref={question} tabIndex={-1}>{content.items[current].text}</h4>
   <fieldset disabled={busy}><legend className="sr-only">Respuesta al ítem {current+1}</legend><Choices value={typeof draft.responses[slot.id]==='number'?content.responseLabels[draft.responses[slot.id] as number]:''} options={[...content.responseLabels]} label={`Respuesta al ítem ${current+1}`} onChange={label=>{const value=content.responseLabels.indexOf(label);if(value>=0)void run(()=>savePss10Answer(slot.id,value));}}/></fieldset>
   <div className="button-row"><button className="btn secondary" disabled={current===0||busy} onClick={()=>void run(()=>navigatePss10(-1))}>Anterior ítem</button><button className="btn secondary" disabled={current===9||busy} onClick={()=>void run(()=>navigatePss10(1))}>Siguiente ítem</button></div>
   <p className="onboarding-note">{progress!.answered} / 10 respuestas guardadas. Puedes salir y retomarlo voluntariamente. Hasta dos omisiones se calculan según el manual; con más, no se genera un resultado.</p>
   <div className="pss-actions"><button className="text-link" disabled={busy} onClick={()=>void run(()=>savePss10Answer(slot.id,null))}>Omitir esta respuesta</button><button className="btn primary" disabled={!progress!.canFinish||busy} onClick={()=>void run(async()=>{await finishPss10();setConsent(false);})}>Calcular mi registro</button></div>
   <button className="text-link" disabled={busy} onClick={()=>void run(discardPss10Draft)}>Abandonar y descartar respuestas de esta evaluación</button>
  </div>}
  {result&&!live&&<div className="functional-profile pss-result" role="region" aria-label="Mi registro de autochequeo">
   <span className="eyebrow">TU REGISTRO · PSS-10</span>
   <h3 ref={question} tabIndex={-1}>{result.rawTotal.toLocaleString('es-PE',{maximumFractionDigits:4})} / 40</h3>
   <p>Tu resultado refleja cómo percibiste determinadas situaciones durante el periodo consultado. No es un diagnóstico.</p>
   <p className="onboarding-note">{new Date(result.completedAt).toLocaleDateString('es-PE')} · {result.answered} respuestas válidas{result.prorated?' · cálculo prorrateado':''}. No clasifica tu salud ni tu rendimiento académico.</p>
   <p>Puedes organizar el siguiente paso, tomar una pausa, respirar o escribir en tu Bitácora. Tú eliges cómo continuar.</p>
   {onContinue&&<button className="btn primary" disabled={busy} onClick={onContinue}>Elegir cómo continuar</button>}
   <details className="instrument-library"><summary>Ver mis registros anteriores</summary><p>{history?.previous?`Diferencia numérica respecto al registro anterior: ${history.delta}. No acredita por sí sola una mejora o un empeoramiento clínico.`:'Es tu primer registro. No hay una comparación anterior para afirmar cambios.'}</p><ol aria-label="Registros PSS-10">{history?.records.map((r,i)=><li key={r.completedAt+'-'+i}>{new Date(r.completedAt).toLocaleDateString('es-PE')} · {r.rawTotal.toLocaleString('es-PE',{maximumFractionDigits:4})} / 40</li>)}</ol></details>
   <details className="instrument-library"><summary>Repetir voluntariamente</summary><p>{content?.instructions}</p><label className="onboarding-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Quiero responder nuevamente y guardar otro registro local. Puedo omitir o salir. No se borrará el registro anterior.</span></label><button className="btn secondary" disabled={!consent||busy} onClick={start}>Repetir autochequeo</button></details>
   <button className="text-link danger-text" disabled={busy} onClick={()=>setRemove(true)}>Borrar mis respuestas y resultados PSS-10</button>
  </div>}
  <details className="instrument-library"><summary>Ver respaldo científico</summary>
   <p>{pss10Disclaimer}</p>
   <dl className="assessment-science">
    <div><dt>Instrumento</dt><dd>{pss10Metadata.name}. {pss10Metadata.construct}</dd></div>
    <div><dt>Autores</dt><dd>{pss10Metadata.authors} · {pss10Metadata.year}</dd></div>
    <div><dt>Referencia</dt><dd>{pss10Metadata.reference}</dd></div>
    <div><dt>Versión e idioma</dt><dd>{pss10Metadata.version} · {pss10Metadata.language}</dd></div>
    <div><dt>Distribuidor y copyright</dt><dd>{pss10Metadata.distributor}. {pss10Metadata.copyright}</dd></div>
    <div><dt>Permisos</dt><dd>{pss10Permission.status}. Acceso al paquete obtenido; no acredita por sí solo administración electrónica, publicación de los textos ni su almacenamiento offline. Acuerdo verificable pendiente.</dd></div>
    <div><dt>Población y límites</dt><dd>{pss10Metadata.population} {pss10Metadata.limitations}</dd></div>
    <div><dt>Corrección preparada</dt><dd>Diez respuestas 0–4. Inversión de los ítems 4, 5, 7 y 8. Total 0–40. Hasta dos faltantes: media de respuestas corregidas disponibles × 10. Respuestas múltiples: faltantes. Sin redondeo añadido, diagnósticos ni umbrales clínicos.</dd></div>
    <div><dt>Manual</dt><dd>Scaling and Scoring Version 2.0, marzo de 2023; su redacción exacta debe volver a cotejarse con el documento autorizado antes de activar este módulo.</dd></div>
   </dl>
   <a href={pss10Metadata.source} target="_blank" rel="noopener noreferrer">Información del laboratorio de Cohen (otra pestaña)</a>
   {!status.available&&<>
    <button className="btn secondary" disabled onClick={start} aria-describedby="assessment-availability">Comenzar</button>
    <p id="assessment-availability" className="onboarding-note">{status.reason}</p>
    <button className="text-link" aria-expanded={preview} onClick={()=>setPreview(v=>!v)}>{preview?'Ocultar recorrido en preparación':'Ver recorrido en preparación'}</button>
    {preview&&<div className="assessment-question">
     <div className="assessment-progress"><span className="eyebrow">RECORRIDO TÉCNICO · NO ES UN TEST</span><span aria-live="polite">{String(current+1).padStart(2,'0')} / 10</span></div>
     <div className="assessment-progress-track" role="progressbar" aria-label="Posición en el recorrido de muestra" aria-valuemin={0} aria-valuemax={10} aria-valuenow={current+1}><span style={{width:`${(current+1)*10}%`}}/></div>
     <h4 ref={question} tabIndex={-1}>{slot.placeholder}</h4>
     <p className="onboarding-note">No contiene preguntas ni opciones protegidas. No acepta respuestas, no guarda datos ni genera resultados.</p>
     <div className="button-row"><button className="btn secondary" disabled={current===0||busy} onClick={()=>setCursor(c=>Math.max(0,c-1))}>Anterior ítem</button><button className="btn secondary" disabled={current===9||busy} onClick={()=>setCursor(c=>Math.min(9,c+1))}>Siguiente ítem</button></div>
    </div>}
   </>}
  </details>
  <Confirm open={remove} onOpen={setRemove} title="¿Borrar este autochequeo?" description="Se eliminarán de este dispositivo las respuestas, el borrador y los resultados PSS-10. Tu Bitácora, preferencias y demás registros se conservan. La eliminación no borra respaldos que ya hayas descargado." onConfirm={()=>void run(async()=>{await deletePss10Data();setConsent(false);setRemove(false);})}/>
 </div>;
}
