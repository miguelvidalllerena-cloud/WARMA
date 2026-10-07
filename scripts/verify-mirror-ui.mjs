import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {createTSLoader} from './test/ts-loader.mjs';
import {createHookHarness,walkElements} from './test/react-hooks.mjs';

const load=createTSLoader(),contract=load('lib/mirror-contract.ts'),client=load('lib/mirror-client.ts');
const source=ts.createSourceFile('mirror.tsx',fs.readFileSync('components/itaca/mirror-ai.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const node=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='MirrorAI');
const code=ts.transpileModule('('+node.getText(source).replace('export default function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const label=n=>Array.isArray(n)?n.map(label).join(''):typeof n==='string'?n:n?.props?label(n.props.children):'';
function harness(available){
 let release;const pending=new Promise(r=>release=r),calls=[],saved=[];const Modal=()=>null;
 const globals={React,...contract,prepareMirrorTransmission:client.prepareMirrorTransmission,AbortController,setTimeout,clearTimeout,Feather:()=>null,ShieldCheck:()=>null,X:()=>null,Modal,
  fetchMirrorStatus:async()=>({available,provider:available?'openai':null,providerLabel:available?'OpenAI':'Guía local',policyURL:available?'https://openai.com/policies/privacy-policy/':null,reason:available?'ready':'not-configured'}),
  sendMirrorTransmission:async(input,signal)=>{calls.push({input:structuredClone(input),signal});await pending;return {mode:'remote',provider:'openai',reason:'generated',reflection:{acknowledgement:'Ordenemos un paso.',question:'¿Qué está a tu alcance hoy?',nextStep:'Elige una acción breve.'}};},
  mutateWorld:async callback=>{const data={journal:[]};callback(data);saved.push(...data.journal);},uid:()=> 'fixture',act:async task=>{try{await task();return true;}catch{return false;}}
 };
 const view=createHookHarness(props=>vm.runInNewContext(code,globals)(props),globals,{onSupport(){}});
 const nodes=()=>walkElements(view.flush()),button=text=>{const b=nodes().find(n=>n.type==='button'&&label(n.props.children).trim().startsWith(text));assert.ok(b,text);return b;};
 return {view,nodes,button,Modal,calls,saved,release};
}
const disabled=harness(false);disabled.view.flush();await settle();assert.equal(disabled.nodes().filter(n=>n.type==='textarea').length,0);assert.equal(disabled.calls.length,0);disabled.view.unmount();
const active=harness(true);active.view.flush();await settle();
active.nodes().find(n=>n.type==='textarea').props.onChange({target:{value:'Tengo varias entregas.'}});
active.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});
assert.equal(active.nodes().find(n=>n.type===active.Modal).props.open,true);assert.equal(active.calls.length,0);
assert.equal(active.button('Enviar este texto').props.disabled,true);await active.button('Enviar este texto').props.onClick();assert.equal(active.calls.length,0);
// Consent applies to the reviewed snapshot, not a text edited afterwards.
active.nodes().find(n=>n.type==='textarea').props.onChange({target:{value:'Otro texto posterior'}});
active.nodes().find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}});
const send=active.button('Enviar este texto').props.onClick,one=send(),two=send();assert.equal(active.calls.length,1);
assert.equal(active.calls[0].input.text,'Tengo varias entregas.');assert.deepEqual(Object.keys(active.calls[0].input).sort(),['consent','question','stage','text']);
active.release();await Promise.all([one,two]);assert.ok(active.nodes().find(n=>label(n.props.children).includes('Respuesta generada')));
active.button('Pasar a Clarificar').props.onClick();active.nodes().find(n=>n.type==='textarea').props.onChange({target:{value:'Puedo organizar una tarea.'}});active.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});
assert.equal(active.button('Enviar este texto').props.disabled,true);active.button('Cancelar envío').props.onClick();assert.equal(active.calls.length,1);assert.equal(active.nodes().find(n=>n.type===active.Modal).props.open,false);
active.nodes().find(n=>n.type==='textarea').props.onChange({target:{value:'No estoy a salvo.'}});active.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});assert.ok(active.button('Hablar con una persona'));assert.equal(active.calls.length,1);active.view.unmount();
const canceled=harness(true);canceled.view.flush();await settle();canceled.nodes().find(n=>n.type==='textarea').props.onChange({target:{value:'Un texto privado.'}});canceled.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});canceled.nodes().find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}});
const underway=canceled.button('Enviar este texto').props.onClick();canceled.button('Cancelar envío').props.onClick();assert.equal(canceled.calls[0].signal.aborted,true);canceled.release();await underway;assert.ok(!canceled.nodes().find(n=>label(n.props.children).includes('Respuesta generada')));canceled.view.unmount();
const unmounted=harness(true);unmounted.view.flush();await settle();unmounted.nodes().find(n=>n.type==='textarea').props.onChange({target:{value:'Salida del módulo.'}});unmounted.nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});unmounted.nodes().find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}});const late=unmounted.button('Enviar este texto').props.onClick();unmounted.view.unmount();assert.equal(unmounted.calls[0].signal.aborted,true);unmounted.release();await late;
assert.ok(!source.text.includes('getWorld('));assert.ok(!source.text.includes('apiKey'));assert.ok(!source.text.includes('dangerouslySetInnerHTML'));
console.log('PASS: actual Espejo component with controlled hooks; unavailable leaves local routes; per-send consent, frozen payload, double-click guard, provider disclosure, no auto-save, cancellation/late response/unmount and human-support without transmission. No native modal/keyboard/model quality claimed.');
