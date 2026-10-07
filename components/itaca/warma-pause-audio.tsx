'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {Headphones,VolumeX} from 'lucide-react';

/** An optional sound texture, never a therapeutic or diagnostic claim. */
export default function PauseAudio({active}:{active:boolean}){
 const audio=useRef<AudioContext|null>(null),generation=useRef(0),pending=useRef(false);
 const [enabled,setEnabled]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const stop=useCallback(()=>{generation.current++;pending.current=false;const ctx=audio.current;audio.current=null;if(ctx&&ctx.state!=='closed')void ctx.close().catch(()=>{});setEnabled(false);setBusy(false);},[]);
 useEffect(()=>{if(!active)stop();},[active,stop]);
 useEffect(()=>{const onHide=()=>{if(document.hidden)stop();};document.addEventListener('visibilitychange',onHide);return ()=>{document.removeEventListener('visibilitychange',onHide);generation.current++;const ctx=audio.current;audio.current=null;if(ctx&&ctx.state!=='closed')void ctx.close().catch(()=>{});};},[stop]);
 async function toggle(){if(enabled){stop();return;}if(pending.current||busy||!active)return;pending.current=true;setBusy(true);setError('');const request=++generation.current;
  try{const ctx=new AudioContext();audio.current=ctx;const master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
   [200,204].forEach((frequency,i)=>{const oscillator=ctx.createOscillator(),pan=ctx.createStereoPanner();oscillator.type='sine';oscillator.frequency.value=frequency;pan.pan.value=i===0?-1:1;oscillator.connect(pan);pan.connect(master);oscillator.start();});
   await ctx.resume();if(request!==generation.current){if(ctx.state!=='closed')void ctx.close().catch(()=>{});return;}master.gain.setTargetAtTime(.018,ctx.currentTime,.8);setEnabled(true);
  }catch{if(request===generation.current){stop();setError('El audio no está disponible. La guía visual sigue funcionando.');}}
  finally{if(request===generation.current){pending.current=false;setBusy(false);}}
 }
 return <div className="pause-audio"><button className="btn secondary" disabled={!active||busy} aria-pressed={enabled} onClick={toggle}>{enabled?<VolumeX size={17}/>:<Headphones size={17}/>} {enabled?'Silenciar todo':busy?'Preparando audio…':'Activar sonido binaural'}</button><p>Opcional · auriculares y volumen cómodo. Es un ambiente sonoro, no un tratamiento.</p>{error&&<p role="status">{error}</p>}</div>;
}
