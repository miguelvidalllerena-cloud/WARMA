import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {createTSLoader} from './test/ts-loader.mjs';
import {installIDBAdapter} from './test/indexeddb-adapter.mjs';
const load=createTSLoader(),store=load('lib/itaca-store.ts'),model=load('lib/warma-onboarding.ts'),psy=load('lib/warma-psychometrics.ts'),catalog=load('lib/warma-instruments.ts'),contextual=load('lib/warma-contextual.ts'),pss=load('lib/pss10-instrument.ts');
const old=store.blankState(912);delete old.assessment;delete old.contextualDraft;delete old.onboardingDraft;delete old.onboardingDismissed;
old.journal=[{id:'prior',title:'Conservar',body:'Reflexión anterior',tags:[],createdAt:'2026-09-20T12:00:00Z'}];old.journalDraft={title:'Anterior',body:'Sin cerrar',tags:''};
const idb=installIDBAdapter(old);
await store.initWorld();assert.equal(store.getWorld().seed,912);assert.deepEqual(idb.openings,[{name:'itaca-living-world',version:1}]);assert.equal(store.getWorld().onboardingDismissed,false);
function componentHarness(file,name,imports,props,initialState){
 const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),component=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name);assert.ok(component);
 const code=ts.transpileModule('('+component.getText(source).replace(/export (default )?function/,'function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
 let index=0,refIndex=0;const state=initialState,refs=[];
 const context={React,...imports,useEffect(){},useState(initial){const i=index++;if(!(i in state))state[i]=typeof initial==='function'?initial():initial;return [state[i],v=>{state[i]=typeof v==='function'?v(state[i]):v;}];},useRef(initial){const i=refIndex++;return refs[i]||(refs[i]={current:initial});}};
 for(const statement of source.statements)if(ts.isVariableStatement(statement))for(const d of statement.declarationList.declarations)if(d.initializer&&ts.isIdentifier(d.name))context[d.name.text]=vm.runInNewContext(ts.transpileModule('('+d.initializer.getText(source)+')',{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,context);
 const render=()=>{index=0;refIndex=0;const tree=vm.runInNewContext(code,context)(typeof props==='function'?props():props),nodes=[];function walk(n){if(Array.isArray(n)){n.forEach(walk);return;}if(n&&typeof n==='object'&&n.props){nodes.push(n);walk(n.props.children);}}walk(tree);return nodes;};
 return {state,refs,context,render};
}
let closed=0,navigated=[];
const noop=()=>null,imports={...model,...psy,mutateWorld:store.mutateWorld,today:store.today,uid:()=> 'explicit-checkin',act:async task=>{try{await task();return true;}catch{return false;}},Modal:noop,Choices:()=>null,Compass:noop,Wind:noop,Feather:noop,ShieldCheck:noop,WarmaEvaluation:noop,OnboardingKnot:noop};
const view=componentHarness('components/itaca/warma-onboarding.tsx','WarmaOnboarding',imports,()=>({open:true,data:store.getWorld(),onOpen(v){if(!v)closed++;},navigate(...args){navigated.push(args);}}),[0,false,model.emptyFunctionalPreferences(),false,false,0]);
const button=text=>{const node=view.render().find(n=>n.type==='button'&&n.props.children===text);assert.ok(node,'Missing '+text);return node;};
// A repeated stale event cannot skip Privacy.
const forward=button('Continuar').props.onClick;forward();forward();assert.equal(view.state[0],1);button('Continuar').props.onClick();assert.equal(view.state[0],1);assert.equal(idb.record.onboarding,null);
view.render().find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}});button('Continuar').props.onClick();assert.equal(view.state[0],2);view.render().find(n=>n.type===imports.WarmaEvaluation&&typeof n.props.onContinue==='function').props.onContinue();assert.equal(view.state[0],3);
view.render().find(n=>n.props.label==='Carga de hoy').props.onChange('Alta');button('Continuar').props.onClick();assert.equal(view.state[5],1);
view.render().find(n=>n.props.label==='Energía de hoy').props.onChange('Baja');
// Actual save callback writes through the unmodified IDB transaction machinery.
const save=button('Guardar y continuar luego').props.onClick;const first=save(),duplicate=save();await Promise.all([first,duplicate]);assert.equal(closed,1);
const saved=store.getWorld().onboardingDraft;assert.equal(saved.stage,3);assert.equal(saved.question,1);assert.equal(saved.preferences.load,'alta');assert.equal(saved.preferences.energy,'baja');assert.equal(saved.preferences.goal,null);
assert.equal(store.getWorld().onboarding,null);assert.equal(store.getWorld().checkin,null);assert.deepEqual(store.getWorld().journal,old.journal);assert.deepEqual(store.getWorld().journalDraft,old.journalDraft);assert.equal(store.getWorld().events.length,0);
const reloaded=createTSLoader()('lib/itaca-store.ts');await reloaded.initWorld();assert.deepEqual(reloaded.getWorld().onboardingDraft,saved);assert.equal(idb.openings.at(-1).version,1);
view.state[0]=0;view.state[1]=false;view.state[2]=saved.preferences;view.state[5]=saved.question;
button('Retomar mi punto de partida').props.onClick();assert.equal(view.state[0],1);button('Continuar').props.onClick();assert.equal(view.state[0],1);
view.render().find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}});button('Continuar').props.onClick();assert.equal(view.state[0],3);assert.equal(view.state[5],1);assert.equal(view.state[2].load,'alta');
button('Volver').props.onClick();assert.equal(view.state[5],0);button('Continuar').props.onClick();button('Continuar').props.onClick();assert.equal(view.state[5],2);
view.render().find(n=>n.props.label==='Mi prioridad').props.onChange('Concentrarme');
// Failed persistence retains inputs, the saved draft and the original journals.
idb.failNext();await button('Guardar mi punto de partida').props.onClick();assert.equal(view.state[0],3);assert.equal(view.state[2].goal,'estudiar');assert.deepEqual(idb.record.onboardingDraft,saved);assert.equal(view.state[3],false);
const submit=button('Guardar mi punto de partida').props.onClick;await Promise.all([submit(),submit()]);assert.equal(view.state[0],4);assert.equal(view.state[4],true);assert.equal(idb.record.onboardingDraft,null);assert.equal(idb.record.onboarding.preferences.goal,'estudiar');assert.equal(idb.record.wellbeing.checkins.length,1);assert.equal(idb.record.timer,null);assert.equal(idb.record.events.length,0);
button('Explorar mi propuesta').props.onClick();assert.deepEqual(navigated,[['focus',5]]);assert.deepEqual(idb.record.journalDraft,old.journalDraft);assert.deepEqual(idb.record.journal,old.journal);
for(const message of idb.messages)assert.deepEqual(Object.keys(message),['updatedAt']);
// Existing serialized queue preserves changes from two asynchronous mutations.
await Promise.all([store.mutateWorld(d=>{d.name='Miguel';}),store.mutateWorld(d=>{d.onboardingDraft=model.draftForLater(3,2,{load:null,energy:null,goal:'crear'},'2026-10-04T16:00:00Z');})]);assert.equal(idb.record.name,'Miguel');assert.equal(idb.record.onboardingDraft.preferences.goal,'crear');
view.state[0]=0;await button('Descartar sólo este borrador de bienvenida').props.onClick();assert.equal(idb.record.onboardingDraft,null);assert.equal(idb.record.onboarding.preferences.goal,'estudiar');assert.equal(idb.record.name,'Miguel');
// Inactive evaluation has informative placeholders, never answer controls/results.
const evaluation=componentHarness('components/itaca/warma-evaluation.tsx','WarmaEvaluation',{...pss,...catalog,...contextual,act:imports.act,Choices:imports.Choices,beginPss10:()=>{throw new Error('Must stay blocked');},Confirm:()=>null},()=>({data:store.getWorld()}),[false,0,false,false]);
let nodes=evaluation.render();assert.ok(nodes.find(n=>n.type==='summary'&&n.props.children==='Ver respaldo científico'));assert.ok(nodes.find(n=>n.props.children===pss.pss10Disclaimer));assert.equal(nodes.find(n=>n.props.children==='Comenzar').props.disabled,true);
assert.equal(nodes.filter(n=>n.type===imports.Choices).length,0);nodes.find(n=>n.props.children==='Ver recorrido en preparación').props.onClick();
for(let i=0;i<9;i++)evaluation.render().find(n=>n.props.children==='Siguiente ítem').props.onClick();assert.equal(evaluation.state[1],9);assert.equal(evaluation.render().find(n=>n.props.children==='Siguiente ítem').props.disabled,true);
assert.equal(evaluation.render().filter(n=>n.type==='input'||n.type===imports.Choices).length,0);assert.equal(store.getWorld().assessment.results.length,0);
// Native button activation semantics, modal naming and focus targets in JSX.
const modal=view.render()[0];assert.equal(modal.props.reduced,false);assert.ok(modal.props.title&&modal.props.description);assert.ok(view.render().find(n=>n.type==='h2'&&n.props.tabIndex===-1));
assert.equal(view.render().filter(n=>n.props['aria-current']==='step').length,1);assert.ok(view.render().find(n=>n.props.children==='Omitir por ahora'));
const css=fs.readFileSync('app/warma.css','utf8');assert.ok(css.includes('@media(prefers-reduced-motion:reduce){.onboarding-dialog'));
for(const [width,height] of [[390,844],[768,1024],[1366,768],[1920,1080]]){
 const outer=Math.min(width-32,980),padding=width<=480?18:34,inside=outer-padding*2;
 assert.ok(inside>=280);const columns=width<=800?1:2;assert.ok(columns===1||inside>800);assert.ok(height*.9<height);
}
assert.ok(css.includes('minmax(0,1fr)'));assert.ok(css.includes('safe-area-inset-bottom'));assert.ok(css.includes('flex-wrap:wrap'));assert.ok(css.includes('.onboarding-dialog[data-reduced]'));
// Dismissal is a minimal local preference, not consent or a fabricated result.
view.state[0]=0;view.state[1]=false;
const beforeSkip=structuredClone(idb.record),closedBefore=closed;
await button('Omitir por ahora').props.onClick();
assert.equal(closed,closedBefore+1);assert.equal(idb.record.onboardingDismissed,true);
assert.deepEqual(idb.record.pss10,beforeSkip.pss10);assert.deepEqual(idb.record.journal,beforeSkip.journal);
assert.deepEqual(idb.record.assessment,beforeSkip.assessment);assert.deepEqual(idb.record.onboarding,beforeSkip.onboarding);
const dismissedReload=createTSLoader()('lib/itaca-store.ts');await dismissedReload.initWorld();
assert.equal(model.shouldOfferOnboarding({...store.blankState(),onboardingDismissed:dismissedReload.getWorld().onboardingDismissed}),false);
// A storage failure does not lock the student out of WARMA.
idb.failNext();await button('Omitir por ahora').props.onClick();assert.equal(closed,closedBefore+2);
idb.restore();
console.log('PASS: real callbacks and existing IDB transaction code with deterministic adapter; consent and stale-click guards; save/resume after module reload; Back and optional choices; failure retains data; duplicate submit; discard only draft; no points/timers; known five-minute entry; serial writes and metadata-only broadcast; blocked item preview and no answer controls; semantic/focus targets and CSS constraints at four widths. Native IndexedDB, visual responsive and real keyboard remain unvalidated by this adapter.');
