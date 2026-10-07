import {z} from 'zod';

// No key, password or plaintext is persisted by this service. Version 1 is
// intentionally fixed: untrusted backups cannot request an expensive KDF.
export const CRYPTO_VERSION=1 as const;
export const KDF_ITERATIONS=600_000;
export const MAX_PLAINTEXT_BYTES=25_000_000;
export const MAX_BACKUP_BYTES=40_000_000;
const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true});
const base64=z.string().regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
const token=base64.length(24);
const kdfSchema=z.object({name:z.literal('PBKDF2'),hash:z.literal('SHA-256'),iterations:z.literal(KDF_ITERATIONS),salt:token}).strict();
export const vaultEnvelopeSchema=z.object({
 kind:z.literal('warma-vault'),cryptoVersion:z.literal(CRYPTO_VERSION),record:z.literal('world/current'),
 algorithm:z.literal('AES-GCM'),tagLength:z.literal(128),vaultId:token,revision:token,
 kdf:kdfSchema,iv:base64.length(16),ciphertext:base64.min(24).max(Math.ceil((MAX_PLAINTEXT_BYTES+16)/3)*4),
}).strict();
export type VaultEnvelope=z.infer<typeof vaultEnvelopeSchema>;
type Configuration=Pick<VaultEnvelope,'vaultId'|'kdf'>;
export class CryptoFailure extends Error {
 constructor(public readonly code:'UNAVAILABLE'|'FORMAT'|'AUTHENTICATION'|'LOCKED'|'LIMIT',message:string){super(message);this.name='CryptoFailure';}
}
const authenticationError=()=>new CryptoFailure('AUTHENTICATION','No se pudo desbloquear. La frase no coincide o el respaldo fue alterado. Tus datos se conservan.');
function webCrypto(){
 if(!globalThis.crypto?.subtle)throw new CryptoFailure('UNAVAILABLE','El cifrado necesita Web Crypto en HTTPS o localhost. Tus datos no se han cambiado.');
 return globalThis.crypto;
}
function encode(bytes:Uint8Array){let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(binary);}
function decode(value:string){
 const binary=atob(value),bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 if(encode(bytes)!==value)throw new CryptoFailure('FORMAT','El formato del respaldo cifrado no es compatible. Se conserva el original.');
 return bytes;
}
function random(length:number){return encode(webCrypto().getRandomValues(new Uint8Array(length)));}
export function parseVaultEnvelope(value:unknown):VaultEnvelope {
 const parsed=vaultEnvelopeSchema.safeParse(value);
 if(!parsed.success)throw new CryptoFailure('FORMAT','El formato o la versión del respaldo cifrado no son compatibles. Se conserva el original.');
 const e=parsed.data;
 for(const [value,length] of [[e.vaultId,16],[e.revision,16],[e.kdf.salt,16],[e.iv,12]] as const){if(decode(value).length!==length)throw new CryptoFailure('FORMAT','El respaldo cifrado contiene metadatos inválidos. Se conserva el original.');}
 const size=decode(e.ciphertext).length;
 if(size<16||size>MAX_PLAINTEXT_BYTES+16)throw new CryptoFailure('FORMAT','El respaldo cifrado tiene un tamaño inválido. Se conserva el original.');
 return e;
}
export function isVaultEnvelope(value:unknown):value is VaultEnvelope {return !!value&&typeof value==='object'&&'kind' in value&&value.kind==='warma-vault';}
export function validateNewPassphrase(passphrase:string){
 if(typeof passphrase!=='string'||[...passphrase].length<12||encoder.encode(passphrase).length>1024)throw new Error('Usa una frase de al menos 12 caracteres y hasta 1024 bytes. No se recortan ni normalizan sus espacios.');
}
async function derive(passphrase:string,configuration:Configuration){
 if(typeof passphrase!=='string'||!passphrase.length||encoder.encode(passphrase).length>1024)throw authenticationError();
 const bytes=encoder.encode(passphrase);
 try {
  const material=await webCrypto().subtle.importKey('raw',bytes,'PBKDF2',false,['deriveKey']);
  return await webCrypto().subtle.deriveKey({name:'PBKDF2',salt:decode(configuration.kdf.salt),iterations:KDF_ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 } finally {bytes.fill(0);}
}
function aad(e:Omit<VaultEnvelope,'ciphertext'>){
 return encoder.encode(JSON.stringify([e.kind,e.cryptoVersion,e.record,e.algorithm,e.tagLength,e.vaultId,e.revision,e.kdf.name,e.kdf.hash,e.kdf.iterations,e.kdf.salt,e.iv]));
}
export class CryptoService {
 #key:CryptoKey|null;
 #configuration:Configuration;
 #issuedIVs=new Set<string>();
 private constructor(key:CryptoKey,configuration:Configuration){this.#key=key;this.#configuration=structuredClone({vaultId:configuration.vaultId,kdf:configuration.kdf});}
 static get available(){return !!globalThis.crypto?.subtle;}
 static async create(passphrase:string){
  validateNewPassphrase(passphrase);
  const configuration:Configuration={vaultId:random(16),kdf:{name:'PBKDF2',hash:'SHA-256',iterations:KDF_ITERATIONS,salt:random(16)}};
  return new CryptoService(await derive(passphrase,configuration),configuration);
 }
 static async open(passphrase:string,value:unknown){
  const envelope=parseVaultEnvelope(value),service=new CryptoService(await derive(passphrase,envelope),envelope);
  try {return {service,plaintext:await service.decrypt(envelope)};}catch(error){service.lock();throw error;}
 }
 lock(){this.#key=null;this.#issuedIVs.clear();}
 get unlocked(){return this.#key!==null;}
 async encrypt(plaintext:string):Promise<VaultEnvelope>{
  if(!this.#key)throw new CryptoFailure('LOCKED','Desbloquea tu espacio antes de guardar.');
  const bytes=encoder.encode(plaintext);
  if(bytes.length>MAX_PLAINTEXT_BYTES)throw new CryptoFailure('LIMIT','El contenido supera 25 MB. No se ha modificado el almacenamiento.');
  let iv:string;do {iv=random(12);}while(this.#issuedIVs.has(iv));
  this.#issuedIVs.add(iv);
  const header:Omit<VaultEnvelope,'ciphertext'>={kind:'warma-vault',cryptoVersion:1,record:'world/current',algorithm:'AES-GCM',tagLength:128,...structuredClone(this.#configuration),revision:random(16),iv};
  try {const ciphertext=await webCrypto().subtle.encrypt({name:'AES-GCM',iv:decode(iv),additionalData:aad(header),tagLength:128},this.#key,bytes);return {...header,ciphertext:encode(new Uint8Array(ciphertext))};}
  finally {bytes.fill(0);}
 }
 async decrypt(value:unknown){
  if(!this.#key)throw new CryptoFailure('LOCKED','Desbloquea tu espacio antes de leerlo.');
  const e=parseVaultEnvelope(value);
  if(e.vaultId!==this.#configuration.vaultId||JSON.stringify(e.kdf)!==JSON.stringify(this.#configuration.kdf))throw authenticationError();
  try {
   const result=await webCrypto().subtle.decrypt({name:'AES-GCM',iv:decode(e.iv),additionalData:aad(e),tagLength:128},this.#key,decode(e.ciphertext));
   const bytes=new Uint8Array(result);try {return decoder.decode(bytes);}finally {bytes.fill(0);}
  }catch {throw authenticationError();}
 }
}
