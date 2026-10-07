import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {createTSLoader} from './test/ts-loader.mjs';

const load=createTSLoader(),pss=load('lib/pss10-instrument.ts'),catalog=load('lib/warma-instruments.ts'),context=load('lib/warma-contextual.ts'),store=load('lib/itaca-store.ts');
const file='components/itaca/warma-evaluation.tsx',source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const declaration=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='WarmaEvaluation');
const code=ts.transpileModule('('+declaration.getText(source).replace('export default function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
const content={version:pss.pss10Version,instructions:'TEST instructions only',responseLabels:['Test 0','Test 1','Test 2','Test 3','Test 4'],items:pss.pss10ItemIds.map((id,i)=>({id,text:'TEST fixture '+i}))};
function harness(available){
 const data=store.blankState(77),state=[false,0,false,false],refs=[],calls=[];let index=0,refIndex=0;
 const Choices=()=>null,Confirm=()=>null,globals={React,...pss,...catalog,...context,Choices,Confirm,useEffect(){},useState(initial){const i=index++;if(!(i in state))state[i]=initial;return [state[i],v=>{state[i]=typeof v==='function'?v(state[i]):v;}];},useRef(value){const i=refIndex++;return refs[i]||(refs[i]={current:value});},act:async task=>{await task();return true;},
  pss10Availability:available?()=>({available:true,reason:'TEST FIXTURE ONLY'}):pss.pss10Availability,
  beginPss10:async()=>{calls.push(['begin']);data.pss10.draft=pss.createPss10Draft('2026-10-04T22:00:00Z');},
  savePss10Answer:async(id,value)=>{calls.push(['answer',id,value]);data.pss10.draft=pss.answerPss10(data.pss10.draft,id,value,'2026-10-04T22:01:00Z');},
  navigatePss10:async delta=>{calls.push(['move',delta]);data.pss10.draft=pss.movePss10(data.pss10.draft,delta);},
  finishPss10:async()=>{const draft=data.pss10.draft,score=pss.scorePss10(draft.responses);calls.push(['finish']);data.pss10.results.push(pss.pss10ScoredRecordSchema.parse({kind:'psychometric',instrumentId:'pss10',version:draft.version,scoringVersion:draft.scoringVersion,completedAt:'2026-10-04T22:02:00Z',responses:draft.responses,rawTotal:score.total,answered:score.answered,missingIds:score.missingIds,prorated:score.prorated,dimension:'perceived-stress'}));data.pss10.draft=null;},
  discardPss10Draft:async()=>{calls.push(['discard']);data.pss10.draft=null;},
  deletePss10Data:async()=>{calls.push(['delete']);data.pss10=pss.emptyPss10State();}
 };
 function render(){index=0;refIndex=0;const tree=vm.runInNewContext(code,globals)({data,content,onContinue:()=>calls.push(['continue'])}),nodes=[];function walk(n){if(Array.isArray(n))return n.forEach(walk);if(n&&typeof n==='object'&&n.props){nodes.push(n);walk(n.props.children);}}walk(tree);return nodes;}
 const button=label=>{const b=render().find(n=>n.type==='button'&&n.props.children===label);assert.ok(b,label);return b;};
 return {data,state,calls,Choices,Confirm,render,button};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const blocked=harness(false);assert.equal(blocked.button('Comenzar').props.disabled,true);
blocked.button('Comenzar').props.onClick();assert.equal(blocked.calls.length,0);
assert.equal(blocked.render().filter(n=>n.type==='input'||n.type===blocked.Choices).length,0,'Even a supplied content fixture cannot grant authorization');
blocked.button('Ver recorrido en preparación').props.onClick();
for(let i=0;i<9;i++)blocked.button('Siguiente ítem').props.onClick();assert.equal(blocked.state[1],9);
assert.equal(blocked.button('Siguiente ítem').props.disabled,true);assert.equal(blocked.render().find(n=>n.props.role==='progressbar').props['aria-valuemax'],10);
blocked.data.pss10.draft=pss.createPss10Draft('2026-10-04T22:00:00Z');
blocked.button('Descartar sólo este borrador PSS-10').props.onClick();await settle();assert.equal(blocked.data.pss10.draft,null);

// Authorized-mode branch is tested with a substituted gate and synthetic wording only.
const view=harness(true);view.button('Comenzar').props.onClick();assert.equal(view.calls.length,0);
view.render().find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}});
const start=view.button('Comenzar').props.onClick;start();start();await settle();assert.equal(view.calls.filter(c=>c[0]==='begin').length,1);
const empty=view.render().find(n=>n.type===view.Choices);assert.equal(empty.props.value,'');
empty.props.onChange('Unrecognized label');await settle();assert.equal(view.calls.filter(c=>c[0]==='answer').length,0);
empty.props.onChange('Test 0');await settle();assert.equal(view.calls.at(-1)[2],0);assert.equal(view.render().find(n=>n.type===view.Choices).props.value,'Test 0');
assert.equal(view.render().find(n=>n.props.role==='progressbar').props['aria-valuenow'],1);
assert.equal(view.button('Calcular mi registro').props.disabled,true);
for(let i=1;i<8;i++){view.button('Siguiente ítem').props.onClick();await settle();view.render().find(n=>n.type===view.Choices).props.onChange('Test 2');await settle();}
assert.equal(view.button('Calcular mi registro').props.disabled,false);
view.button('Omitir esta respuesta').props.onClick();await settle();assert.equal(view.button('Calcular mi registro').props.disabled,true);
view.render().find(n=>n.type===view.Choices).props.onChange('Test 2');await settle();
const finish=view.button('Calcular mi registro').props.onClick;finish();finish();await settle();assert.equal(view.calls.filter(c=>c[0]==='finish').length,1);assert.equal(view.data.pss10.results.length,1);
assert.ok(view.render().find(n=>n.props.children==='Es tu primer registro. No hay una comparación anterior para afirmar cambios.'));
for(const n of view.render())if(typeof n.props.children==='string')assert.ok(!/Tienes estrés (?:bajo|moderado|grave|severo)/i.test(n.props.children));
assert.equal(view.data.events.length,0);assert.equal(view.data.timer,null);
assert.ok(view.render().find(n=>n.type==='summary'&&n.props.children==='Ver respaldo científico'));
console.log('PASS: production evaluation component with controlled React hooks; pending permissions disable collection even with injected synthetic content; 10-slot bounds and progress; inert draft discard; synthetic authorized branch verifies consent, double-click guards, value 0, unknown label, omission and minimum eight answers, first-record history and no clinical labels. No real DOM/keyboard/administration claimed.');

// Every response option maps to its numeric value, with no good/bad colour semantics.
view.button('Elegir cómo continuar').props.onClick();assert.equal(view.calls.at(-1)[0],'continue');
assert.equal(view.button('Repetir autochequeo').props.disabled,true,'Repeat needs a fresh voluntary choice');
view.render().find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}});
view.button('Repetir autochequeo').props.onClick();await settle();
assert.equal(view.data.pss10.results.length,1,'Starting again does not erase the prior result');
for(let i=0;i<5;i++){view.render().find(n=>n.type===view.Choices).props.onChange('Test '+i);await settle();assert.equal(view.data.pss10.draft.responses[pss.pss10ItemIds[0]],i);}
view.button('Abandonar y descartar respuestas de esta evaluación').props.onClick();await settle();
view.button('Borrar mis respuestas y resultados PSS-10').props.onClick();
assert.equal(view.state[4],true);view.render().find(n=>n.type===view.Confirm).props.onConfirm();await settle();
assert.deepEqual(view.data.pss10,pss.emptyPss10State());assert.equal(view.data.events.length,0);assert.equal(view.data.timer,null);
console.log('PASS: result-to-personalization action, explicit consent for repetition, every response option and scoped PSS deletion with confirmation. Synthetic UI fixtures only.');
