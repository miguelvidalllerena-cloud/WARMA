'use client';
import {counted} from '@/lib/warma-copy';
import {useEffect,useRef,useState} from 'react';
import {createWorldRenderer} from '@/lib/world-renderer';
import {startEssentialScene} from '@/lib/essential-renderer';
import type {Mood,Quality,Region,WorldState} from '@/lib/itaca-store';
import {seeded,level,projectProgress} from '@/lib/itaca-store';
export const regions=[
 {id:'focus' as Region,name:'ENFOQUE',label:'Cámara de enfoque',point:[-3,1,-5],color:'#96d9bf'},
 {id:'projects' as Region,name:'PROYECTOS',label:'Planetas de proyectos',point:[4,-1,-6],color:'#9fbddd'},
 {id:'memory' as Region,name:'MEMORIA',label:'Palacio de la memoria',point:[-5,-2,-8],color:'#d6c7ac'},
 {id:'journal' as Region,name:'REFLEXIÓN',label:'Diario de estrellas',point:[0,4,-7],color:'#dac194'},
 {id:'observatory' as Region,name:'OBSERVATORIO',label:'Observatorio',point:[6,4,-9],color:'#a6c4d7'},
 {id:'path' as Region,name:'CAMINO',label:'Camino a WARMA',point:[0,-5,-8],color:'#9bbdab'}
];
export const moodColors:Record<Mood,string>={FOCUS:'#8fcdb9',REFLECTION:'#d9be91',CREATIVITY:'#91b8de',REST:'#99aaaa',PROGRESS:'#b6dec4'};
export default function Core({data,region,hover,mood,quality,reduced,focusProgress=0,storyProgress=0,onRegion,onProject,onQuality}:{data:WorldState;region:Region;hover:Region|null;mood:Mood;quality:Quality;reduced:boolean;focusProgress?:number;storyProgress?:number;onRegion:(r:Region)=>void;onProject:(id:string)=>void;onQuality:(q:string)=>void}){
 const host=useRef<HTMLDivElement>(null),fallback=useRef<HTMLCanvasElement>(null),[webgl,setWebgl]=useState(false);
 const live=useRef({data,region,hover,mood,reduced,focusProgress,storyProgress,onRegion,onProject,onQuality});live.current={data,region,hover,mood,reduced,focusProgress,storyProgress,onRegion,onProject,onQuality};
 useEffect(()=>{if(!host.current)return;setWebgl(false);if(quality==='essential'){onQuality('Essential');return;}try{const cleanup=createWorldRenderer(host.current,()=>live.current,quality,()=>{setWebgl(false);live.current.onQuality('Essential · adaptado');});setWebgl(true);return cleanup;}catch(e){console.warn('WARMA renderer unavailable',e instanceof Error?e.message:String(e));setWebgl(false);onQuality('Essential · compatible');}},[quality,data.seed]);
 useEffect(()=>{if(webgl||!fallback.current)return;return startEssentialScene(fallback.current,()=>live.current);},[webgl,data.seed]);
 return <div className={'world-canvas '+(region==='world'||region==='story'?'':'in-region')} ref={host}><canvas className={'essential-canvas '+(webgl?'hidden':'')} ref={fallback} aria-hidden="true"/><span className="sr-only">Nudo WARMA. Metáfora visual, no medición clínica. {counted(data.missions.filter(m=>m.done).length,'misión completada','misiones completadas')}, {counted(data.journal.length,'reflexión','reflexiones')}.</span></div>;
}
