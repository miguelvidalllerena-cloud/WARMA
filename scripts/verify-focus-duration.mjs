import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
const source=ts.createSourceFile('focus.tsx',fs.readFileSync('components/itaca/focus-missions.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const component=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name.text==='Focus');
const compiled=ts.transpileModule('('+component.getText(source).replace('export function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
function setup(recommended,override,initialMinutes){
 let hook=0,saves=0;const data={timer:null,projects:[],sessions:[]};
 const context={React,useState(initial){const index=hook++;return [override&&index in override?override[index]:initial,()=>{}];},recommendation:()=>({minutes:recommended}),remainingSeconds:()=>0,uid:()=> 'test',mutateWorld:async callback=>{callback(data);saves++;},act:async callback=>callback()};
 for(const name of ['PersonalizationNote','ArrowUpRight','Pause','Play','Progress','ViewHeading','Choices','Pick','Confirm'])context[name]=()=>null;
 const tree=vm.runInNewContext(compiled,context)({data,tick:0,initialMinutes,onExit(){}}),nodes=[];
 function walk(node){if(Array.isArray(node)){node.forEach(walk);return;}if(node&&typeof node==='object'&&node.props){nodes.push(node);walk(node.props.children);}}walk(tree);
 return {data,nodes,get saves(){return saves;}};
}
for(const duration of [1,5,15,25,45,60,180]){
 const test=setup(duration),caption=test.nodes.find(n=>n.props.id==='focus-duration'),button=test.nodes.find(n=>n.props.className==='btn primary wide-button');
 assert.equal(caption.props.children,`Duración: ${duration} ${duration===1?'minuto':'minutos'}`);assert.equal(button.props.disabled,false);
 const choices=test.nodes.find(n=>n.props.label==='Duración de enfoque');assert(choices.props.options.includes(choices.props.value));
 await button.props.onClick();assert.equal(test.data.timer.total,duration*60);
}
for(const value of ['', '0','-1','181','1.5','not-a-number']){
 const test=setup(1,{0:'Personalizar',1:value}),button=test.nodes.find(n=>n.props.className==='btn primary wide-button');
 assert.equal(button.props.disabled,true);await button.props.onClick();assert.equal(test.saves,0);
}
for(const proposed of [5,15,25]){const test=setup(45,null,proposed),caption=test.nodes.find(n=>n.props.id==='focus-duration');assert.equal(caption.props.children,`Duración: ${proposed} minutos`);}
for(const invalid of [0,-1,1.5,181,NaN]){const test=setup(15,null,invalid),caption=test.nodes.find(n=>n.props.id==='focus-duration');assert.equal(caption.props.children,'Duración: 15 minutos');}
console.log('PASS: visible recommended durations including 1 minute; all presets; custom duration; empty, fractional, invalid and out-of-range values cannot start a session (production component).');
