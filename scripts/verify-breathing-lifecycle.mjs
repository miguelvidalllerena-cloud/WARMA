import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {createHookHarness,walkElements} from './test/react-hooks.mjs';

const source=ts.createSourceFile('breathing.tsx',fs.readFileSync('components/itaca/warma-wellbeing.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const node=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='Decompression');
const code=ts.transpileModule('('+node.getText(source).replace('export function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
let now=0,nextTimer=0;const timers=new Map(),writes=[],vibrations=[],document={hidden:false};let release;
const pending=new Promise(resolve=>release=resolve);
const globals={React,document,performance:{now:()=>now},navigator:{vibrate:v=>vibrations.push(v)},setInterval:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearInterval:id=>timers.delete(id),
 recordPause:async(kind,seconds)=>{writes.push({kind,seconds});await pending;},act:async task=>{try{await task();return true;}catch{return false;}},Modal:()=>null,PauseAudio:()=>null,Switch:()=>null,ArrowRight:()=>null};
let opened=true;const view=createHookHarness(props=>vm.runInNewContext(code,globals)(props),globals,{open:true,onOpen:v=>opened=v,data:{},reduced:false});
const text=n=>Array.isArray(n)?n.map(text).join(''):typeof n==='string'?n:n?.props?text(n.props.children):'';
const nodes=()=>walkElements(view.flush());
const button=label=>{const b=nodes().find(n=>n.type==='button'&&text(n.props.children).startsWith(label));assert.ok(b,label);return b;};
function advance(ms){for(let i=0;i<ms/200;i++){now+=200;for(const fn of [...timers.values()])fn();view.flush();assert.ok(timers.size<=1,'At most one breathing interval');}}
view.flush();assert.equal(timers.size,1);advance(4000);button('Pausar guía').props.onClick();view.flush();assert.equal(timers.size,0);const elapsed=view.slots[0];advance(6000);assert.equal(view.slots[0],elapsed);
button('Continuar guía').props.onClick();view.flush();assert.equal(timers.size,1);document.hidden=true;advance(10000);assert.equal(view.slots[0],elapsed);document.hidden=false;
advance(56000);assert.equal(writes.length,1);assert.equal(writes[0].seconds,60);assert.equal(timers.size,0);
button('Continuar a mi ritmo').props.onClick();assert.equal(opened,false);view.update({open:false});assert.equal(timers.size,0);
view.update({open:true});assert.equal(view.slots[0],0);assert.equal(timers.size,1);
release();await new Promise(r=>setImmediate(r));view.flush();
assert.equal(view.slots[2],false,'Finishing the previous session must not mark the new one saved');
advance(60000);await new Promise(r=>setImmediate(r));view.flush();assert.equal(writes.length,2);assert.equal(view.slots[2],true);assert.equal(timers.size,0);
view.update({open:false});view.update({open:true});advance(1000);button('Salir de la pausa').props.onClick();view.update({open:false});assert.equal(writes.length,2,'Early exit must not record a full minute');
view.unmount();assert.equal(timers.size,0);assert.ok(vibrations.some(v=>v===0));
console.log('PASS: actual Respirar effects with deterministic clock/hooks; one interval, pause/resume, hidden-tab exclusion, completion once, reopen resets, stale save cannot mark a new session, early exit does not fabricate completion, timer/vibration cleanup. Native browser/audio timing unverified.');
