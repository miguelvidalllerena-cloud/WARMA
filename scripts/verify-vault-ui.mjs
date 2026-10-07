import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {createTSLoader} from './test/ts-loader.mjs';

const file='components/itaca/local-protection.tsx',source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
function declaration(name){const node=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name);return ts.transpileModule('('+node.getText(source).replace('export function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;}
function walk(tree){const nodes=[];function visit(n){if(Array.isArray(n))return n.forEach(visit);if(n&&typeof n==='object'&&n.props){nodes.push(n);visit(n.props.children);}}visit(tree);return nodes;}
const text=n=>Array.isArray(n)?n.map(text).join(''):typeof n==='string'?n:n?.props?text(n.props.children):'';
let release;const wait=new Promise(r=>release=r),calls=[],protection={status:'plain',busy:false},errors=[];
const state=[],refs=[],cleanups=[];let index=0,refIndex=0;
const symbol=()=>null;
const globals={React,Download:symbol,LockKeyhole:symbol,ShieldCheck:symbol,Upload:symbol,Wind:symbol,Modal:()=>null,
 useEffect(effect){const cleanup=effect();if(cleanup)cleanups.push(cleanup);},useState(initial){const i=index++;if(!(i in state))state[i]=typeof initial==='function'?initial():initial;return [state[i],value=>state[i]=typeof value==='function'?value(state[i]):value];},useRef(value){const i=refIndex++;return refs[i]||(refs[i]={current:value});},
 useProtection:()=>protection,encryptionAvailable:()=>true,
 act:async task=>{try{await task();return true;}catch(e){errors.push(e.message);return false;}},
 prepareLocalEncryption:async()=>{calls.push('prepare');await wait;return {token:'prepared'};},downloadPreparedEncryption:token=>calls.push('download:'+token),discardPreparedEncryption:()=>calls.push('discard'),
 activateLocalEncryption:async(token,ack)=>{assert.deepEqual(JSON.parse(JSON.stringify(ack)),{backupSaved:true,phraseSaved:true});calls.push('activate:'+token);protection.status='unlocked';},lockWorld(){calls.push('lock');},
 unlockWorld:async()=>{calls.push('unlock');await wait;},RestoreBackupDialog:symbol,
};
const controls=vm.runInNewContext(declaration('LocalProtectionControls'),globals);
function render(){index=0;refIndex=0;return walk(controls());}
function button(label){const b=render().find(n=>n.type==='button'&&text(n.props.children).trim().startsWith(label));assert.ok(b,label);return b;}
button('Proteger con una frase').props.onClick();assert.equal(render().find(n=>n.type===globals.Modal).props.open,true);
let fields=render().filter(n=>n.type==='input'&&n.props.type==='password');assert.equal(fields.length,2);for(const f of fields){assert.equal(f.props.autoComplete,'new-password');assert.equal(f.props.minLength,12);}
fields[0].props.onChange({target:{value:'Una frase privada larga'}});fields[1].props.onChange({target:{value:'No coincide'}});
await render().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});assert.equal(calls.filter(c=>c==='prepare').length,0);assert.ok(errors.length);
render().filter(n=>n.props.type==='password')[1].props.onChange({target:{value:'Una frase privada larga'}});
const submit=render().find(n=>n.type==='form').props.onSubmit,first=submit({preventDefault(){}}),second=submit({preventDefault(){}});release();await Promise.all([first,second]);
assert.equal(calls.filter(c=>c==='prepare').length,1);assert.ok(calls.includes('download:prepared'));assert.equal(state[1],'');assert.equal(state[2],'');
assert.equal(button('Activar cifrado local').props.disabled,true);await button('Activar cifrado local').props.onClick();assert.equal(calls.filter(c=>c.startsWith('activate')).length,0);
for(const f of render().filter(n=>n.props.type==='checkbox'))f.props.onChange({target:{checked:true}});
assert.equal(button('Activar cifrado local').props.disabled,false);const activate=button('Activar cifrado local').props.onClick;await Promise.all([activate(),activate()]);assert.equal(calls.filter(c=>c.startsWith('activate')).length,1);
button('Bloquear mi espacio').props.onClick();assert.ok(calls.includes('lock'));

// Actual root component must short-circuit every private view while locked.
const appSource=ts.createSourceFile('app.tsx',fs.readFileSync('components/itaca/app.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const node=appSource.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='Itaca');
const appCode=ts.transpileModule('('+node.getText(appSource).replace('export default function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
const model=createTSLoader()('lib/itaca-store.ts'),data=model.blankState(1);data.journal=[{id:'private',title:'Private',body:'This must never render while locked',createdAt:'',tags:[]}];
const Gate=()=>null,Toaster=()=>null;let appIndex=0;
const app=vm.runInNewContext(appCode,{React,VaultGate:Gate,Toaster,useWorld:()=>({data,ready:false,error:'',saving:false}),useProtection:()=>({status:'locked',busy:false}),useEffect(){},useCallback:f=>f,useRef:v=>({current:v}),useState:v=>[typeof v==='function'?v():v,()=>{}],level:()=>0,recommendation:()=>({region:'focus',minutes:5}),remainingSeconds:()=>0});
const nodes=walk(app());assert.ok(nodes.find(n=>n.type===Gate));assert.equal(nodes.length,3);assert.ok(!text(nodes[0]).includes('This must never render'));
const css=fs.readFileSync('app/warma.css','utf8');assert.ok(css.includes('.vault-gate :focus-visible'));assert.ok(css.includes('.vault-entry input{width:100%;min-width:0}'));assert.ok(css.includes('prefers-reduced-motion'));
assert.ok(!/crypto\.subtle|AES-GCM|PBKDF2/.test(source.text),'UI must not implement cryptographic primitives');
console.log('PASS: actual activation callbacks, matching phrase, double-submit protection, pre-activation backup, both confirmations, cleared password inputs and explicit lock; root renders only gate/toaster while locked; CSS focus/overflow/reduced-motion constraints. Controlled React hooks, not native keyboard or visual QA.');
