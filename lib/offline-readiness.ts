// Registering a worker is not proof that this page can open offline.
// Only the controller of this page may confirm its production precache.
export function observeOfflineReadiness(onChange:(ready:boolean)=>void):()=>void {
 onChange(false);
 if(typeof window==='undefined'||!window.isSecureContext||!('serviceWorker' in navigator)||typeof MessageChannel==='undefined')return ()=>{};
 const workers=navigator.serviceWorker;
 let active=true,generation=0,channel:MessageChannel|null=null,deadline:ReturnType<typeof setTimeout>|null=null;
 function clearPending(){if(deadline!==null)clearTimeout(deadline);deadline=null;channel?.port1.close();channel?.port2.close();channel=null;}
 function check(){
  if(!active)return;
  const request=++generation;clearPending();onChange(false);
  const target=workers.controller;
  if(!target||target.state!=='activated')return;
  try {
   const url=new URL(target.scriptURL);if(url.origin!==location.origin||url.pathname!=='/sw.js')return;
   const assets=[...new Set(Array.from(document.querySelectorAll<HTMLScriptElement|HTMLLinkElement>('script[src],link[rel="stylesheet"][href],link[rel="modulepreload"][href]')).map(node=>new URL(node.getAttribute('src')||node.getAttribute('href')||'',location.href)).filter(url=>url.origin===location.origin&&/\.(js|css)$/.test(url.pathname)).map(url=>url.pathname))];
   channel=new MessageChannel();
   channel.port1.onmessage=event=>{
    if(!active||generation!==request||workers.controller!==target)return;
    const data=event.data;
    const ready=target.state==='activated'&&data?.type==='CACHE_STATUS'&&data.ready===true&&/^itaca-v1-[a-f0-9]{12}$/.test(data.version)&&Number.isInteger(data.total)&&data.total>0&&data.cached===data.total;
    ++generation;clearPending();onChange(ready);
   };
   deadline=setTimeout(()=>{if(active&&generation===request){++generation;clearPending();onChange(false);}},3000);
   target.postMessage({type:'CACHE_STATUS',assets},[channel.port2]);
  }catch {++generation;clearPending();onChange(false);}
 }
 const onVisible=()=>{if(!document.hidden)check();};
 workers.addEventListener('controllerchange',check);
 window.addEventListener('online',check);window.addEventListener('offline',check);window.addEventListener('pageshow',check);
 document.addEventListener('visibilitychange',onVisible);
 check();
 // An existing controller remains usable if an update attempt fails offline.
 void Promise.resolve().then(()=>{if(active)return workers.register('/sw.js',{updateViaCache:'none'});}).then(async()=>{if(!active)return;await workers.ready;if(active)check();}).catch(()=>{if(active)check();});
 return ()=>{active=false;++generation;clearPending();workers.removeEventListener('controllerchange',check);window.removeEventListener('online',check);window.removeEventListener('offline',check);window.removeEventListener('pageshow',check);document.removeEventListener('visibilitychange',onVisible);};
}
