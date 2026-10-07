'use client';
import {useEffect,useRef,useState} from 'react';
import {Download,LockKeyhole,ShieldCheck,Upload,Wind} from 'lucide-react';
import {useProtection,prepareLocalEncryption,downloadPreparedEncryption,activateLocalEncryption,discardPreparedEncryption,unlockWorld,lockWorld,downloadJSON,importJSON,encryptionAvailable} from '@/lib/itaca-store';
import {Modal,act} from './ui';

export function LocalProtectionControls(){
 const protection=useProtection();
 const [open,setOpen]=useState(false),[phrase,setPhrase]=useState(''),[confirmation,setConfirmation]=useState('');
 const [token,setToken]=useState(''),[backupSaved,setBackupSaved]=useState(false),[phraseSaved,setPhraseSaved]=useState(false);
 const submitting=useRef(false);
 const close=(value:boolean)=>{if(submitting.current)return;setOpen(value);if(!value){discardPreparedEncryption();setPhrase('');setConfirmation('');setToken('');setBackupSaved(false);setPhraseSaved(false);}};
 useEffect(()=>()=>discardPreparedEncryption(),[]);
 async function prepare(event:React.FormEvent){
  event.preventDefault();if(submitting.current)return;
  if(phrase!==confirmation){await act(async()=>{throw new Error('Las dos frases deben coincidir exactamente.');});return;}
  submitting.current=true;
  await act(async()=>{const prepared=await prepareLocalEncryption(phrase);downloadPreparedEncryption(prepared.token);setToken(prepared.token);setPhrase('');setConfirmation('');});
  submitting.current=false;
 }
 async function activate(){
  if(submitting.current||!backupSaved||!phraseSaved||!token)return;submitting.current=true;
  const ok=await act(()=>activateLocalEncryption(token,{backupSaved,phraseSaved}),'Cifrado local activado');
  submitting.current=false;if(ok)close(false);else {setToken('');setBackupSaved(false);}
 }
 return <div className="setting-section local-protection"><ShieldCheck size={26} strokeWidth={1}/>
  <h2>{protection.status==='unlocked'?'Un espacio protegido.':'Protege tus palabras.'}</h2>
  {protection.status==='unlocked'?<>
   <p>El contenido guardado y los nuevos respaldos están cifrados con tu frase. Mientras usas WARMA, la información está disponible en memoria.</p>
   <p className="small muted">Bloquear cierra las vistas y descarta la clave de memoria. Guarda cualquier formulario antes; necesitarás tu frase para volver a entrar.</p>
   <button className="btn secondary" disabled={protection.busy} onClick={lockWorld}><LockKeyhole size={16}/>Bloquear mi espacio</button>
  </>:<>
   <p>Activa el cifrado local para tu Bitácora, borradores, reflexiones y demás registros. No necesitas una cuenta.</p>
   <button className="btn secondary" disabled={protection.busy||!encryptionAvailable()} onClick={()=>setOpen(true)}><LockKeyhole size={16}/>Proteger con una frase</button>
   {!encryptionAvailable()&&<p className="small" role="status">Abre WARMA en HTTPS o localhost con un navegador compatible con Web Crypto. Los registros originales se conservan.</p>}
  </>}
  <Modal open={open} onOpen={close} title="Tus palabras, bajo tu llave." description="Cifrado local · sin cuenta · sin enviar tu frase" closeDisabled={protection.busy}>
   {!token?<form className="form-stack" onSubmit={prepare}>
    <p>Elige una frase larga y única. Guarda la frase fuera de este navegador: WARMA no puede recuperarla si la pierdes.</p>
    <label className="field-label">Tu frase<input type="password" autoComplete="new-password" minLength={12} maxLength={1024} required value={phrase} onChange={e=>setPhrase(e.target.value)}/></label>
    <label className="field-label">Repite tu frase<input type="password" autoComplete="new-password" minLength={12} maxLength={1024} required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>
    <p className="small muted">Primero se prepara y verifica un respaldo cifrado. La activación no sustituye tus registros hasta que confirmes que guardaste el archivo y la frase. No borra copias antiguas que ya descargaste.</p>
    <button className="btn primary" disabled={protection.busy}>Preparar respaldo cifrado <Download size={16}/></button>
   </form>:<div className="form-stack">
    <p>El respaldo se ha verificado antes de la migración. Comprueba que la descarga terminó y conserva también tu frase. No podemos comprobar que el archivo se haya guardado físicamente.</p>
    <button className="text-link" disabled={protection.busy} onClick={()=>void act(async()=>downloadPreparedEncryption(token))}><Download size={16}/>Descargar respaldo otra vez</button>
    <label className="vault-confirm"><input type="checkbox" checked={backupSaved} onChange={e=>setBackupSaved(e.target.checked)}/><span>He guardado el respaldo cifrado.</span></label>
    <label className="vault-confirm"><input type="checkbox" checked={phraseSaved} onChange={e=>setPhraseSaved(e.target.checked)}/><span>Conservo mi frase fuera de este navegador y entiendo que, sin ella, no podré recuperar este contenido.</span></label>
    <button className="btn primary" disabled={protection.busy||!backupSaved||!phraseSaved} onClick={activate}>Activar cifrado local <ShieldCheck size={17}/></button>
   </div>}
  </Modal>
 </div>;
}

export function RestoreBackupDialog({file,onClose}:{file:File|null;onClose:()=>void}){
 const [encrypted,setEncrypted]=useState<boolean|null>(null),[phrase,setPhrase]=useState(''),[error,setError]=useState(''),[confirmed,setConfirmed]=useState(false),[busy,setBusy]=useState(false);
 const submitting=useRef(false);
 useEffect(()=>{
  let current=true;setEncrypted(null);setError('');setPhrase('');setConfirmed(false);
  if(file&&file.size>40_000_000){setError('El respaldo supera 40 MB. El original no se ha cambiado.');}
  else if(file)void file.text().then(text=>{if(current)setEncrypted(JSON.parse(text)?.kind==='warma-vault');}).catch(()=>{if(current)setError('Este archivo no contiene un respaldo JSON legible. El original no se ha cambiado.');});
  return ()=>{current=false;};
 },[file]);
 async function restore(event:React.FormEvent){
  event.preventDefault();if(!file||!confirmed||encrypted===null||submitting.current)return;
  submitting.current=true;setBusy(true);
  const ok=await act(()=>importJSON(file,encrypted?phrase:undefined),'Tu respaldo se ha restaurado');
  setPhrase('');setBusy(false);submitting.current=false;if(ok)onClose();
 }
 return <Modal open={!!file} onOpen={value=>{if(!value&&!submitting.current)onClose();}} title="Restaurar tu espacio" description="Sustituirá los registros actuales de este dispositivo." closeDisabled={busy}>
  <form className="form-stack" onSubmit={restore}>
   <p>Conserva una copia del espacio actual antes de continuar. El archivo se valida antes de sustituirlo.</p>
   <button type="button" className="btn secondary" disabled={busy} onClick={()=>void act(downloadJSON)}><Download size={16}/>Descargar copia actual</button>
   {error&&<p role="alert">{error}</p>}
   {encrypted===null&&!error&&<p role="status">Comprobando el formato…</p>}
   {encrypted&&<label className="field-label">Frase del respaldo<input type="password" autoComplete="current-password" required maxLength={1024} value={phrase} onChange={e=>setPhrase(e.target.value)}/></label>}
   <label className="vault-confirm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/><span>Conservo mi copia actual y quiero sustituir estos registros.</span></label>
   <button className="btn primary" disabled={busy||!!error||encrypted===null||!confirmed||Boolean(encrypted&&!phrase)}>Restaurar respaldo <Upload size={16}/></button>
  </form>
 </Modal>;
}

export function VaultGate({error}:{error:string}){
 const protection=useProtection();const [phrase,setPhrase]=useState(''),[restore,setRestore]=useState<File|null>(null);const submitting=useRef(false);
 async function unlock(event:React.FormEvent){
  event.preventDefault();if(submitting.current||!phrase)return;submitting.current=true;
  await act(()=>unlockWorld(phrase));setPhrase('');submitting.current=false;
 }
 return <div className="itaca warma vault-gate">
  <header><Wind size={28} strokeWidth={1.3}/><span>WARMA <small>A TU RITMO</small></span></header>
  <main className="vault-entry" aria-labelledby="vault-title">
   <div className="eyebrow">TU ESPACIO / PROTEGIDO</div>
   <LockKeyhole className="vault-mark" size={52} strokeWidth={.8} aria-hidden="true"/>
   <h1 id="vault-title">Vuelve a<br/><em>tu espacio.</em></h1>
   <p>Tus registros siguen aquí, cifrados. Desbloquéalos con tu frase; no se envía a ningún servidor.</p>
   <form className="form-stack" onSubmit={unlock}>
    <label className="field-label" htmlFor="vault-phrase">Tu frase<input id="vault-phrase" type="password" autoComplete="current-password" required maxLength={1024} value={phrase} onChange={e=>setPhrase(e.target.value)} disabled={protection.busy}/></label>
    {error&&<p className="vault-error" role="alert">{error}</p>}
    {!encryptionAvailable()&&<p role="alert">Este navegador no dispone de Web Crypto. Usa HTTPS o localhost y conserva una copia cifrada.</p>}
    <button className="btn primary" disabled={protection.busy||!phrase||!encryptionAvailable()}>{protection.busy?'Desbloqueando…':'Entrar a mi WARMA'} <LockKeyhole size={17}/></button>
   </form>
   <details className="vault-recovery"><summary>¿Necesitas recuperar tu espacio?</summary>
    <p>WARMA no conoce ni puede restablecer tu frase. Un respaldo cifrado necesita la frase con la que fue creado. Antes de sustituir el archivo actual, conserva una copia.</p>
    <div className="button-stack"><button className="btn secondary" disabled={protection.busy} onClick={()=>void act(downloadJSON)}><Download size={16}/>Descargar archivo cifrado actual</button>
     <label className="btn secondary file-label"><Upload size={16}/>Restaurar otro respaldo cifrado<input type="file" accept="application/json,.json" className="sr-only" disabled={protection.busy} onChange={e=>{setRestore(e.target.files?.[0]||null);e.target.value='';}}/></label>
    </div>
    <p className="small muted">Si sólo conservas un respaldo sin cifrar, ábrelo en otro perfil del navegador desde Preferencias. Esta pantalla conserva el archivo protegido.</p>
   </details>
  </main>
  <RestoreBackupDialog file={restore} onClose={()=>setRestore(null)}/>
 </div>;
}
