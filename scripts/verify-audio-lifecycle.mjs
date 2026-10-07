import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {createTSLoader} from './test/ts-loader.mjs';
import {createHookHarness,walkElements} from './test/react-hooks.mjs';

const instances=[],pending=[];
class AudioContextFixture{
 state='suspended';currentTime=0;destination={};resumeCount=0;suspendCount=0;closeCount=0;
 constructor(){instances.push(this);}
 createGain(){return {gain:{value:0,setTargetAtTime(){},setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}
 createStereoPanner(){return {pan:{value:0,setTargetAtTime(){}},connect(){}};}
 createOscillator(){return {frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}};}
 async resume(){this.resumeCount++;await new Promise(resolve=>pending.push(resolve));if(this.state!=='closed')this.state='running';}
 async suspend(){this.suspendCount++;if(this.state!=='closed')this.state='suspended';}
 async close(){this.closeCount++;this.state='closed';}
}
const original=globalThis.AudioContext;globalThis.AudioContext=AudioContextFixture;
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const release=async()=>{pending.splice(0).forEach(resolve=>resolve());await settle();};
try{
 const ambient=createTSLoader()('lib/itaca-audio.ts');
 const start=ambient.setSound(true);assert.equal(instances.length,1);await release();await start;
 assert.equal(instances[0].state,'running');await ambient.setSound(false);assert.equal(instances[0].state,'suspended','MUTE ALL must suspend the AudioContext, not only attenuate gain');
 const again=ambient.setSound(true);await ambient.setSound(false);await release();await again;assert.equal(instances[0].state,'suspended','A stale resume must not unmute after stop');assert.equal(instances.length,1);
 const root=ts.createSourceFile('app.tsx',fs.readFileSync('components/itaca/app.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 let toggleAudio;function find(n){if(ts.isFunctionDeclaration(n)&&n.name?.text==='toggleAudio')toggleAudio=n;ts.forEachChild(n,find);}find(root);
 const toggleCode=ts.transpileModule('('+toggleAudio.getText(root)+')',{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
 let indicatedSound=false;await vm.runInNewContext(toggleCode,{sound:false,setSound:async()=>false,setSoundState:v=>indicatedSound=v,notifyError(){}})();
 assert.equal(indicatedSound,false,'A canceled activation must leave the audio indicator off');
 const source=ts.createSourceFile('audio.tsx',fs.readFileSync('components/itaca/warma-pause-audio.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const node=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='PauseAudio');
 const code=ts.transpileModule('('+node.getText(source).replace('export default function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
 const listeners=new Map(),document={hidden:false,addEventListener:(event,fn)=>listeners.set(event,fn),removeEventListener:(event,fn)=>{if(listeners.get(event)===fn)listeners.delete(event);}};
 const globals={React,AudioContext:AudioContextFixture,document,Headphones:()=>null,VolumeX:()=>null};
 const component=props=>vm.runInNewContext(code,globals)(props),view=createHookHarness(component,globals,{active:true});
 const button=()=>walkElements(view.flush()).find(n=>n.type==='button');
 const before=instances.length,callback=button().props.onClick,one=callback(),two=callback();
 assert.equal(instances.length,before+1,'Double activation must create only one context');await release();await Promise.all([one,two]);assert.equal(button().props['aria-pressed'],true);
 const ctx=instances.at(-1);view.update({active:false});assert.equal(ctx.state,'closed');assert.equal(button().props['aria-pressed'],false);
 view.update({active:true});const late=button().props.onClick();view.update({active:false});await release();await late;assert.equal(instances.at(-1).state,'closed');assert.equal(button().props['aria-pressed'],false);
 view.update({active:true});const hiddenStart=button().props.onClick();await release();await hiddenStart;document.hidden=true;listeners.get('visibilitychange')();assert.equal(instances.at(-1).state,'closed');assert.equal(button().props['aria-pressed'],false);
 document.hidden=false;const final=button().props.onClick();await release();await final;view.unmount();assert.equal(instances.at(-1).state,'closed');assert.equal(listeners.size,0);
}finally{if(original===undefined)delete globalThis.AudioContext;else globalThis.AudioContext=original;}
console.log('PASS: actual ambient/PauseAudio callbacks with deterministic AudioContext fixture; mute suspends, stale resume cannot unmute, one context per double activation, pause/exit/hidden-tab/unmount close contexts and remove listeners. Real audio/browser playback unverified.');
