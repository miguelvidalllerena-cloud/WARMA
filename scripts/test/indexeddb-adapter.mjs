// Deterministic test double for the existing IDB request/transaction boundary.
// It does not emulate browser quota, locking, private mode or cross-tab engines.
export function installIDBAdapter(initial){
 let record=initial===undefined?undefined:structuredClone(initial),failNext=false;
 const pending=[];let active=false;
 function pump(){if(active||!pending.length)return;active=true;pending.shift()();}
 const openings=[],messages=[],original={indexedDB:globalThis.indexedDB,window:globalThis.window,BroadcastChannel:globalThis.BroadcastChannel};
 const database={createObjectStore(){},transaction(store,mode){
  if(store!=='world')throw new Error('Unexpected object store');
  let aborted=false,put,started=false,request,finished=false;
  function finish(){if(finished)return;finished=true;active=false;pump();}
  function execute(){started=true;queueMicrotask(()=>{if(aborted){finish();return;}request.result=record===undefined?undefined:structuredClone(record);request.onsuccess?.();});
   setTimeout(()=>{if(aborted){finish();return;}if(failNext&&mode==='readwrite'){failNext=false;tx.error=new Error('Storage quota fixture');tx.onerror?.();finish();return;}if(put!==undefined)record=structuredClone(put);tx.oncomplete?.();finish();},0);
  }
  const tx={error:null,objectStore(){return {get(key){
   if(key!=='current')throw new Error('Unexpected key');
   const r=request={result:undefined};pending.push(execute);pump();
   return r;
  },put(value,key){if(key!=='current')throw new Error('Unexpected key');put=structuredClone(value);}};},abort(){aborted=true;queueMicrotask(()=>{tx.onabort?.();if(started)finish();});}};
  return tx;
 }};
 globalThis.indexedDB={open(name,version){openings.push({name,version});const r={result:database};queueMicrotask(()=>{if(record===undefined)r.onupgradeneeded?.();r.onsuccess?.();});return r;}};
 class Channel{postMessage(message){messages.push(structuredClone(message));}}
 globalThis.window={BroadcastChannel:Channel};globalThis.BroadcastChannel=Channel;
 return {get record(){return structuredClone(record);},openings,messages,replaceExternally(value){record=structuredClone(value);},failNext(){failNext=true;},restore(){for(const [name,value] of Object.entries(original))if(value===undefined)delete globalThis[name];else globalThis[name]=value;}};
}
