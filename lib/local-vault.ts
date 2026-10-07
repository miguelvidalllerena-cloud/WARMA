// Keep asynchronous Web Crypto outside native IndexedDB transactions. The
// compare-and-replace transaction contains only synchronous request handlers.
export function readLocalRecord(database:IDBDatabase):Promise<unknown>{
 return new Promise((resolve,reject)=>{
  const tx=database.transaction('world','readonly'),request=tx.objectStore('world').get('current');
  let value:unknown;request.onsuccess=()=>{value=request.result;};
  tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('No se pudo leer el almacenamiento.'));
 });
}
export function replaceLocalRecord(database:IDBDatabase,expected:unknown,value:unknown,stillValid:()=>boolean=()=>true):Promise<boolean>{
 return new Promise((resolve,reject)=>{
  const tx=database.transaction('world','readwrite'),store=tx.objectStore('world'),request=store.get('current');
  let replaced=false;
  request.onsuccess=()=>{
   if(stillValid()&&JSON.stringify(request.result)===JSON.stringify(expected)){store.put(value,'current');replaced=true;}
  };
  tx.oncomplete=()=>resolve(replaced);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('No se pudo guardar. Se conserva el original.'));
 });
}
