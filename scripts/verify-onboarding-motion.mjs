import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {createTSLoader} from './test/ts-loader.mjs';
const load=createTSLoader(),knot=load('lib/warma-knot.ts'),psy=load('lib/warma-psychometrics.ts');
const source=ts.createSourceFile('onboarding-knot.tsx',fs.readFileSync('components/itaca/onboarding-knot.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),component=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='OnboardingKnot');
const code=ts.transpileModule('('+component.getText(source).replace('export default function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
function scene(reduced,loadValue='alta',missingContext=false){
 let ref=0,frames=0,clears=0,disconnected=0,signature=0;const effects=[],pending=new Map(),listeners=new Map();
 const context={setTransform(...values){values.forEach(v=>assert.ok(Number.isFinite(v)));},clearRect(){clears++;},beginPath(){},ellipse(...values){values.forEach(v=>assert.ok(Number.isFinite(v)));},stroke(){},fill(){},closePath(){},moveTo(x,y){assert.ok(Number.isFinite(x)&&Number.isFinite(y));signature+=x+y;},lineTo(x,y){assert.ok(Number.isFinite(x)&&Number.isFinite(y));signature+=x+y;}};
 const canvas={width:0,height:0,clientWidth:320,clientHeight:300,getContext(){return missingContext?null:context;}};
 const document={hidden:false,addEventListener(name,fn){listeners.set(name,fn);},removeEventListener(name){listeners.delete(name);}};
 const local={React,drawWarmaKnot:knot.drawWarmaKnot,knotDisclaimer:psy.knotDisclaimer,window:{devicePixelRatio:3},document,performance:{now:()=>100},requestAnimationFrame(fn){const id=++frames;pending.set(id,fn);return id;},cancelAnimationFrame(id){pending.delete(id);},ResizeObserver:class{constructor(fn){this.fn=fn;}observe(){}disconnect(){disconnected++;}},useRef(initial){return {current:ref++===0?canvas:initial};},useEffect(fn){effects.push(fn);}};
 const tree=vm.runInNewContext(code,local)({preferences:{load:loadValue,energy:'baja',goal:'descansar'},stage:3,reduced}),cleanups=effects.map(fn=>fn());
 return {canvas,pending,document,listeners,tree,get clears(){return clears;},get signature(){return signature;},get disconnected(){return disconnected;},tick(now){const [id,fn]=pending.entries().next().value||[];if(fn){pending.delete(id);fn(now);}},cleanup(){cleanups.forEach(fn=>fn?.());}};
}
const still=scene(true);assert.equal(still.pending.size,0);assert.ok(still.clears>0);assert.equal(still.canvas.width,432);assert.equal(still.canvas.height,405);assert.ok(still.signature>0);
const light=scene(true,'ligera');assert.notEqual(light.signature,still.signature,'Chosen load changes actual knot geometry');
still.cleanup();light.cleanup();assert.equal(still.listeners.size,0);assert.equal(still.disconnected,1);
const moving=scene(false);assert.equal(moving.pending.size,1);const start=moving.clears;moving.tick(150);assert.ok(moving.clears>start);assert.equal(moving.pending.size,1);
moving.document.hidden=true;moving.listeners.get('visibilitychange')();assert.equal(moving.pending.size,0);
moving.document.hidden=false;moving.listeners.get('visibilitychange')();assert.equal(moving.pending.size,1);
moving.cleanup();assert.equal(moving.pending.size,0);assert.equal(moving.listeners.size,0);assert.equal(moving.disconnected,1);
const unavailable=scene(true,'alta',true);assert.equal(unavailable.pending.size,0);assert.equal(unavailable.clears,0);unavailable.cleanup();
console.log('PASS: actual knot Canvas renderer with finite coordinates, load-dependent geometry, DPR capped at 1.35; reduced motion schedules no animation; one RAF loop; hidden-tab suspension; listener/observer/frame cleanup; missing context safe. Synthetic Canvas adapter, not a GPU/device or screenshot test.');
