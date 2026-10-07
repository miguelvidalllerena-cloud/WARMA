'use client';
import {counted} from '@/lib/warma-copy';
import {useState} from 'react';
import {ArrowRight,ArrowUpRight,Check,Feather,Plus,Route,Target,Wind} from 'lucide-react';
import {type Region,type WorldState,addMission,toggleMission} from '@/lib/itaca-store';
import {ViewHeading,act} from './ui';
import PersonalizationNote from './warma-personalization';

export default function WarmaPath({data,navigate,onPause}:{data:WorldState;navigate:(r:Region)=>void;onPause:()=>void}){
 const [title,setTitle]=useState(''),[busy,setBusy]=useState(false),[selected,setSelected]=useState<string|null>(null);
 const pending=data.missions.filter(m=>!m.done),completed=data.missions.filter(m=>m.done);
 const recent=completed.slice(-2),visible=[...recent,...pending.slice(0,6)];
 const active=visible.find(m=>m.id===selected)||pending[0]||recent.at(-1);
 const pauseCount=data.wellbeing.pauses.length;
 async function create(e:React.FormEvent){e.preventDefault();if(!title.trim()||busy)return;setBusy(true);try{if(await act(()=>addMission(title,'side',10,'Suave'),'Un paso añadido a tu camino'))setTitle('');}finally{setBusy(false);}}
 async function complete(){if(!active||active.done||busy)return;setBusy(true);try{await act(()=>toggleMission(active.id),'Paso completado. Puedes hacer una pausa.');}finally{setBusy(false);}}
 return <section className="workspace warma-path">
  <ViewHeading eyebrow="01 / CAMINO A WARMA" title="Un paso posible." description="Un recorrido que deja espacio para estudiar, respirar y cambiar de estrategia." action={<button className="btn secondary" onClick={()=>navigate('projects')}>Mis proyectos <ArrowUpRight size={16}/></button>}/>
  <PersonalizationNote data={data} place="path"/>
  <div className="path-composer"><label className="eyebrow" htmlFor="next-step">¿QUÉ PUEDES HACER EN 10 MINUTOS?</label><form onSubmit={create}><input id="next-step" aria-label="Mi siguiente microacción" placeholder="Por ejemplo, resolver un ejercicio…" maxLength={180} required value={title} onChange={e=>setTitle(e.target.value)}/><button className="btn primary" disabled={busy||!title.trim()}><Plus size={18}/>Añadir paso</button></form></div>
  <div className="path-terrain">
   <div className="path-map-head"><span className="eyebrow">TU RECORRIDO</span><span><i/>Acción <i className="rest-key"/>Pausa</span></div>
   {visible.length>0?<><ol className="path-tiles" aria-label="Casillas de mi camino">{visible.map((mission,i)=><li className="path-tile-pair" key={mission.id}>
    <button className={'path-tile '+(mission.done?'complete ':'')+(active?.id===mission.id?'current':'')} aria-pressed={active?.id===mission.id} onClick={()=>setSelected(mission.id)} aria-label={`${mission.done?'Completado':'Acción'}: ${mission.title}`}><span className="tile-order">{String(i*2+1).padStart(2,'0')}</span><span className="tile-icon">{mission.done?<Check size={25}/>:<Target size={25} strokeWidth={1.2}/>}</span><strong>{mission.title}</strong><small>{mission.done?'Paso realizado':`${mission.minutes} min · a tu ritmo`}</small></button>
    <button className="path-tile rest-tile" onClick={onPause}><span className="tile-order">{String(i*2+2).padStart(2,'0')}</span><span className="tile-icon"><Wind size={27} strokeWidth={1.3}/></span><strong>Un poco de aire</strong><small>Pausa disponible</small></button>
   </li>)}</ol><div className="path-selection" aria-live="polite"><div><span className="eyebrow">{active?.done?'UNA HUELLA EN TU CAMINO':'EL PASO QUE ELIGES AHORA'}</span><h2>{active?.title}</h2><p>{active?.done?'Está hecho. Descansar no borra lo que avanzaste.':'Puedes terminarlo, hacerlo más pequeño o continuar otro día.'}</p></div><div className="button-row">{!active?.done&&<button className="btn primary" disabled={busy} onClick={complete}><Check size={17}/>Marcar como hecho</button>}<button className="btn secondary" onClick={active?.done?onPause:()=>navigate('focus')}>{active?.done?<Wind size={17}/>:<Target size={17}/>} {active?.done?'Hacer una pausa':'Concentrarme'}</button></div></div></>:<div className="path-start"><div className="start-marker"><Route size={32} strokeWidth={1}/><span>01</span></div><div><h2>No necesitas tener todo el camino claro.</h2><p>Añade arriba una acción pequeña. Entre cada paso habrá un espacio de pausa.</p><button className="text-link" onClick={onPause}>También puedes empezar descansando <ArrowRight size={16}/></button></div></div>}
   {pending.length>6&&<button className="text-link" onClick={()=>navigate('missions')}>Ver {pending.length===1?'la':'las'} {counted(pending.length,'acción pendiente','acciones pendientes')} <ArrowRight size={16}/></button>}
  </div>
  <div className="path-reflection"><Feather size={25}/><div><h2>Antes de seguir: ¿qué te ayudó?</h2><p>Una estrategia que puedes repetir. Un ajuste que quieres probar.</p></div><button className="btn secondary" onClick={()=>navigate('journal')}>Ir a mi bitácora <ArrowUpRight size={15}/></button></div>
  <footer className="journey-record"><span>{counted(completed.length,'paso completado','pasos completados')}</span><span>{counted(pauseCount,'pausa registrada','pausas registradas')}</span><button className="text-link" onClick={()=>navigate('missions')}>Ver todas mis acciones <ArrowRight size={14}/></button></footer>
 </section>;
}
