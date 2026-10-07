'use client';
import {useEffect,useRef} from 'react';
import {ArrowUpRight,ArrowRight,Wind,Route,ScanLine,Feather,ShieldCheck,Sprout} from 'lucide-react';
import {type WorldState,type Region,mutateWorld,today,uid,recommendation} from '@/lib/itaca-store';
import {preferenceContext} from '@/lib/warma-onboarding';
import PersonalizationNote from './warma-personalization';
import {act} from './ui';
export default function WarmaHome({data,navigate,onPause,onCheckin,onOnboarding,onHover,saving,ready}:{data:WorldState;navigate:(r:Region,minutes?:number)=>void;onPause:()=>void;onCheckin:()=>void;onOnboarding:()=>void;onHover:(r:Region|null)=>void;saving:boolean;ready:boolean}){
 const scene=useRef<HTMLDivElement>(null);
 useEffect(()=>{const slot=scene.current,root=slot?.closest<HTMLElement>('.warma');if(!slot||!root)return;let frame=0;const measure=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const a=slot.getBoundingClientRect(),b=root.getBoundingClientRect();root.style.setProperty('--scene-left',`${a.left-b.left}px`);root.style.setProperty('--scene-top',`${a.top-b.top}px`);root.style.setProperty('--scene-width',`${a.width}px`);root.style.setProperty('--scene-height',`${a.height}px`);});};const observer=new ResizeObserver(measure);observer.observe(slot);observer.observe(root);measure();window.addEventListener('resize',measure);return ()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('resize',measure);};},[]);
 const load=data.checkin?.date===today()?data.checkin.load:null;
 const knotLoad=load||data.onboarding?.preferences.load||null;
 const rec=recommendation(data),preferences=preferenceContext(data).preferences,personalized=!!(preferences.load||preferences.energy||preferences.goal);
 const setLoad=(v:'ligera'|'media'|'alta')=>act(()=>mutateWorld(d=>{d.checkin={date:today(),energy:d.checkin?.energy||'media',goal:d.checkin?.goal||'organizarme',load:v};d.wellbeing.checkins.push({id:uid(),load:v,energy:d.checkin.energy,createdAt:new Date().toISOString()});}));
 return <section className="warma-home">
  <div className="home-overline"><span>UN ESPACIO PARA VOLVER A TI</span><span className="local-note"><ShieldCheck size={14}/> Personal · en este dispositivo</span></div>
  <div className="warma-intro"><span className="editorial-kicker">ORGANIZAR. PAUSAR. CONTINUAR.</span><h1>Vuelve a <br/>tu <em>centro.</em></h1><p>No tienes que resolverlo todo ahora.<br/>Haz espacio para tu siguiente paso.</p>
   <div className="home-checkin"><span>Check-in de carga percibida · ¿Cómo sientes tu carga hoy?</span><div className="load-options" role="group" aria-label="Check-in de carga percibida">{(['ligera','media','alta'] as const).map((v,i)=><button key={v} aria-pressed={load===v} className={load===v?'selected':''} onClick={()=>setLoad(v)}><span className={'load-mark load-'+i} aria-hidden="true"/>{['Ligera','Intermedia','Alta'][i]}</button>)}</div><button className="text-link" onClick={onCheckin}>También quiero registrar mi energía <ArrowRight size={14}/></button></div>
   <button className="btn primary hero-cta" onClick={()=>navigate(personalized?rec.region:'path',personalized&&rec.region==='focus'?rec.minutes:undefined)}>Elegir mi siguiente paso <ArrowUpRight size={18}/></button>
   <button className="text-link onboarding-entry" disabled={!ready} onClick={onOnboarding}>{data.onboardingDraft?'Retomar mi punto de partida':data.onboarding?'Revisar mi punto de partida':'Preparar mi punto de partida'} <ArrowRight size={14}/></button>
   <PersonalizationNote data={data} place="home"/>
  </div>
  <div className="home-scene" ref={scene}>
   <span className="scene-coordinate" aria-hidden="true">W / NUDO VIVO</span>
   <button className="knot-orbit orbit-reflect" onPointerEnter={()=>onHover('journal')} onPointerLeave={()=>onHover(null)} onFocus={()=>onHover('journal')} onBlur={()=>onHover(null)} onClick={()=>navigate('mirror')}><ScanLine size={17}/><span>Encontrar claridad</span><ArrowUpRight size={14}/></button>
   <button className="knot-orbit orbit-grow" onPointerEnter={()=>onHover('path')} onPointerLeave={()=>onHover(null)} onFocus={()=>onHover('path')} onBlur={()=>onHover(null)} onClick={()=>navigate('garden')}><Sprout size={17}/><span>Mi jardín</span><ArrowUpRight size={14}/></button>
   <div className="knot-label" aria-live="polite"><span className="knot-index">{knotLoad?(load?'TU CARGA DE HOY · ':'PREFERENCIA INICIAL · ')+({ligera:'LIGERA',media:'INTERMEDIA',alta:'ALTA'}[knotLoad]):'SIN REGISTRO · PUEDES OMITIRLO'}</span><p>{knotLoad==='alta'?'Podemos ir más despacio.':knotLoad==='ligera'?'Hay espacio para empezar.':'Un momento para observarte.'}</p><small>Una metáfora de tu registro, no una medición clínica.</small></div>
  </div>
  <div className="home-journeys"><button onClick={()=>navigate('path')}><span className="journey-number">01</span><Route size={25} strokeWidth={1.2}/><span><b>Una cosa a la vez</b><small>Organiza un paso posible</small></span><ArrowUpRight size={18}/></button><button onClick={onPause}><span className="journey-number">02</span><Wind size={25} strokeWidth={1.2}/><span><b>Un poco de aire</b><small>Pausa guiada · un minuto</small></span><ArrowUpRight size={18}/></button><button onClick={()=>navigate('journal')}><span className="journey-number">03</span><Feather size={25} strokeWidth={1.2}/><span><b>Ponerlo en palabras</b><small>Tu bitácora, sin juicios</small></span><ArrowUpRight size={18}/></button></div>
  <footer className="warma-home-footer"><span>Tu ritmo también cuenta.</span><span>{saving?'Guardando…':ready?'Guardado localmente':'Preparando tu espacio…'}</span></footer>
 </section>;
}
