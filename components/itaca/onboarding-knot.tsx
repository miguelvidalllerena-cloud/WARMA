'use client';
import {useEffect,useRef} from 'react';
import {drawWarmaKnot} from '@/lib/warma-knot';
import {knotDisclaimer} from '@/lib/warma-psychometrics';
import type {FunctionalPreferences} from '@/lib/warma-onboarding';

export default function OnboardingKnot({preferences,stage,reduced}:{preferences:FunctionalPreferences;stage:number;reduced:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null),live=useRef({preferences,stage});live.current={preferences,stage};
 useEffect(()=>{
  const el=canvas.current,ctx=el?.getContext('2d');if(!el||!ctx)return;
  let frame=0,last=0,current=.52,disposed=false;
  const paint=(now:number)=>{
   if(disposed)return;
   const p=live.current.preferences,target=p.load==='alta'?.88:p.load==='ligera'?.18:.52;
   current=reduced?target:current+(target-current)*.08;
   const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
   const dpr=Math.min(window.devicePixelRatio||1,1.35);
   if(el.width!==Math.round(w*dpr)||el.height!==Math.round(h*dpr)){el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);}
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
   ctx.strokeStyle='#a8c5af22';ctx.lineWidth=1;
   ctx.beginPath();ctx.ellipse(w/2,h*.66,w*.4,h*.18,0,0,Math.PI*2);ctx.stroke();
   drawWarmaKnot(ctx,w/2,h*.49,Math.min(w,h)*.2,current,reduced?0:now/1000*(p.goal==='descansar'||p.energy==='baja'?.09:.18));
  };
  const loop=(now:number)=>{if(disposed||document.hidden)return;if(now-last>=50){paint(now);last=now;}frame=requestAnimationFrame(loop);};
  const resume=()=>{cancelAnimationFrame(frame);if(!document.hidden){paint(performance.now());if(!reduced)frame=requestAnimationFrame(loop);}};
  const observer=new ResizeObserver(resume);observer.observe(el);document.addEventListener('visibilitychange',resume);resume();
  return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',resume);};
 },[reduced]);
 useEffect(()=>{if(!reduced)return;const el=canvas.current,ctx=el?.getContext('2d');if(!el||!ctx)return;const w=el.clientWidth,h=el.clientHeight,dpr=Math.min(window.devicePixelRatio||1,1.35);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);drawWarmaKnot(ctx,w/2,h*.49,Math.min(w,h)*.2,preferences.load==='alta'?.88:preferences.load==='ligera'?.18:.52,0);},[preferences.load,reduced,stage]);
 return <figure className="onboarding-knot"><span className="eyebrow">W / TU PUNTO DE PARTIDA</span><canvas ref={canvas} aria-hidden="true"/><figcaption><span>{preferences.load?`Carga elegida: ${preferences.load==='media'?'intermedia':preferences.load}`:'Todavía sin registro'}</span><p>{knotDisclaimer}</p></figcaption></figure>;
}
