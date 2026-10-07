import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createTSLoader} from './test/ts-loader.mjs';

assert.ok(webcrypto.subtle);
const {CryptoService,parseVaultEnvelope,KDF_ITERATIONS,MAX_PLAINTEXT_BYTES}=createTSLoader()('lib/crypto-service.ts');
assert.equal(KDF_ITERATIONS,600000);
const phrase='Tres senderos y un espacio propio 🌿';
await assert.rejects(CryptoService.create('corta'),/12 caracteres/);
await assert.rejects(CryptoService.create('a'.repeat(1025)));
const service=await CryptoService.create(phrase);
const vectors=['','Hola 🌿 · Ñ · 日本語 · العربية · \u0000','x'.repeat(2_000_000)];
for(const text of vectors){const e=await service.encrypt(text);assert.equal(await service.decrypt(e),text);const reopened=await CryptoService.open(phrase,JSON.parse(JSON.stringify(e)));assert.equal(reopened.plaintext,text);reopened.service.lock();}
const one=await service.encrypt('Registro sintético'),two=await service.encrypt('Registro sintético');
assert.notEqual(one.iv,two.iv);assert.notEqual(one.ciphertext,two.ciphertext);assert.notEqual(one.revision,two.revision);
assert.equal(one.algorithm,'AES-GCM');assert.equal(one.tagLength,128);assert.equal(atob(one.iv).length,12);
assert.equal(atob(one.kdf.salt).length,16);assert.equal(one.cryptoVersion,1);
assert.ok(!JSON.stringify(one).includes(phrase));assert.ok(!JSON.stringify(one).includes('Registro sintético'));
await assert.rejects(CryptoService.open('Otra frase de recuperación',one),e=>e.code==='AUTHENTICATION');
const alter=v=>v[0]==='A'?'B'+v.slice(1):'A'+v.slice(1);
for(const field of ['iv','ciphertext','revision','vaultId']){const e=structuredClone(one);e[field]=alter(e[field]);await assert.rejects(service.decrypt(e),e=>e.code==='AUTHENTICATION');}
const changedSalt=structuredClone(one);changedSalt.kdf.salt=alter(changedSalt.kdf.salt);await assert.rejects(service.decrypt(changedSalt),e=>e.code==='AUTHENTICATION');
const tagBytes=Uint8Array.from(atob(one.ciphertext),c=>c.charCodeAt(0));tagBytes[tagBytes.length-1]^=1;
await assert.rejects(service.decrypt({...one,ciphertext:btoa(String.fromCharCode(...tagBytes))}),e=>e.code==='AUTHENTICATION');
const wrongDomain={...one,record:'other'};await assert.rejects(service.decrypt(wrongDomain),e=>e.code==='FORMAT');
for(const e of [{...one,cryptoVersion:2},{...one,extra:'unexpected'},{...one,kdf:{...one.kdf,iterations:1}},{...one,iv:'invalid'}])assert.throws(()=>parseVaultEnvelope(e));
await assert.rejects(service.decrypt({...one,ciphertext:'A'.repeat(24)}),e=>e.code==='AUTHENTICATION');
const nativeOne=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(phrase),'PBKDF2',false,['deriveKey']);
const nativeKey=await webcrypto.subtle.deriveKey({name:'PBKDF2',salt:Uint8Array.from(atob(one.kdf.salt),c=>c.charCodeAt(0)),iterations:KDF_ITERATIONS,hash:'SHA-256'},nativeOne,{name:'AES-GCM',length:256},false,['decrypt']);
assert.equal(nativeKey.extractable,false);await assert.rejects(webcrypto.subtle.exportKey('raw',nativeKey));
const aad=new TextEncoder().encode(JSON.stringify([one.kind,one.cryptoVersion,one.record,one.algorithm,one.tagLength,one.vaultId,one.revision,one.kdf.name,one.kdf.hash,one.kdf.iterations,one.kdf.salt,one.iv]));
const nativePlaintext=await webcrypto.subtle.decrypt({name:'AES-GCM',iv:Uint8Array.from(atob(one.iv),c=>c.charCodeAt(0)),additionalData:aad,tagLength:128},nativeKey,Uint8Array.from(atob(one.ciphertext),c=>c.charCodeAt(0)));
assert.equal(new TextDecoder().decode(nativePlaintext),'Registro sintético');
const many=await Promise.all(Array.from({length:64},()=>service.encrypt('mismo texto')));assert.equal(new Set(many.map(e=>e.iv)).size,64);
await assert.rejects(service.encrypt('x'.repeat(MAX_PLAINTEXT_BYTES+1)),e=>e.code==='LIMIT');
service.lock();await assert.rejects(service.decrypt(one),e=>e.code==='LOCKED');await assert.rejects(service.encrypt(''),e=>e.code==='LOCKED');
const recovered=await CryptoService.open(phrase,one);assert.equal(recovered.plaintext,'Registro sintético');recovered.service.lock();
console.log('PASS: native Web Crypto AES-256-GCM; Unicode/empty/2 MB; PBKDF2-SHA256 600000; nonextractable key; random 96-bit IVs; repeated input differs; ciphertext/IV/AAD/salt tampering and wrong key rejected; strict version/domain/size limits; lock/key-loss and passphrase reopening. No real-browser persistence claimed.');
