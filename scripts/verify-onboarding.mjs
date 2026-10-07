import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';

const require=createRequire(import.meta.url),cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
 const mod={exports:{}};cache.set(file,mod);
 vm.runInThisContext('(function(require,module,exports){'+code+'\n})',{filename:file})(id=>id.startsWith('.')?load(path.resolve(path.dirname(file),id+'.ts')):require(id),mod,mod.exports);
 return mod.exports;
}
const store=load('lib/itaca-store.ts'),model=load('lib/warma-onboarding.ts'),catalog=load('lib/warma-instruments.ts');
const old=store.blankState(27);delete old.onboarding;
old.journal=[{id:'private',title:'Mi registro',body:'Contenido local anterior',tags:[],createdAt:'2026-09-20T10:00:00Z'}];
old.journalDraft={title:'Sin terminar',body:'Conservar',tags:'ideas'};
const restored=store.stateSchema.parse(old);
assert.equal(restored.onboarding,null);assert.deepEqual(restored.journal,old.journal);assert.deepEqual(restored.journalDraft,old.journalDraft);
assert.equal(model.shouldOfferOnboarding(restored),false);
assert.equal(model.shouldOfferOnboarding(store.blankState()),true);
for(const collection of ['missions','projects','journal','subjects','knowledge','dreams','games','sessions','events']){
 const existing=store.blankState();existing[collection].push({id:'existing'});
 assert.equal(model.shouldOfferOnboarding(existing),false,`Do not interrupt a returning user with ${collection}`);
}
for(const load of [null,'ligera','media','alta'])for(const energy of [null,'baja','media','alta'])for(const goal of [null,'estudiar','organizarme','reflexionar','descansar','crear']){
 const preferences={load,energy,goal},p=model.functionalProfile(preferences,12);
 assert.deepEqual(p,model.functionalProfile(preferences,12));assert.ok(p.minutes>=1&&p.minutes<=180);assert.ok(p.reason.length>0);
 assert.equal('score' in p,false);assert.equal('diagnosis' in p,false);
 if(goal==='estudiar'&&(load==='alta'||energy==='baja'))assert.equal(p.minutes,5);
}
assert.equal(model.functionalProfile({load:'ligera',energy:'alta',goal:'estudiar'},23).minutes,5);
assert.equal(model.functionalProfile(model.emptyFunctionalPreferences(),12).region,'path');
assert.equal(catalog.instruments.length,6);
for(const i of catalog.instruments){assert.equal(catalog.administrationStatus(i.id).available,false);assert.equal('items' in i,false);assert.ok(i.source.startsWith('https://'));}
assert.equal(catalog.administrationStatus('unregistered').available,false);

// Run the component's actual submit callback: consent, writes, failure and double click.
const source=ts.createSourceFile('onboarding.tsx',fs.readFileSync('components/itaca/warma-onboarding.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let complete;function visit(node){if(ts.isFunctionDeclaration(node)&&node.name?.text==='complete')complete=node;ts.forEachChild(node,visit);}visit(source);assert.ok(complete);
const callback=ts.transpileModule('('+complete.getText(source)+')',{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
function harness(consent,prefs,fail=false){
 let world=structuredClone(restored),writes=0,release;
 const transaction=new Promise(resolve=>release=resolve);
 const context={stage:3,question:2,consent,prefs,submitting:{current:false},onboardingSchema:model.onboardingSchema,today:store.today,uid:()=> 'checkin-one',setBusy(v){context.busy=v;},setSaved(v){context.saved=v;},setStage(v){context.stage=v;},act:async fn=>{try{await fn();return true;}catch{return false;}},mutateWorld:async change=>{writes++;await transaction;if(fail)throw new Error('storage failure');const next=structuredClone(world);change(next);world=store.stateSchema.parse(next);}};
 return {run:vm.runInNewContext(callback,context),context,release,get world(){return world;},get writes(){return writes;}};
}
const denied=harness(false,{load:'alta',energy:'baja',goal:'estudiar'});await denied.run();assert.equal(denied.writes,0);
const selected=harness(true,{load:'alta',energy:'baja',goal:'estudiar'}),first=selected.run(),second=selected.run();assert.equal(selected.writes,1);selected.release();await Promise.all([first,second]);
assert.equal(selected.context.stage,4);assert.equal(selected.context.saved,true);assert.equal(selected.context.busy,false);
assert.equal(selected.world.wellbeing.checkins.length,1);assert.equal(selected.world.checkin.load,'alta');assert.equal(selected.world.onboarding.kind,'preferences');
assert.deepEqual(selected.world.journal,restored.journal);assert.deepEqual(selected.world.journalDraft,restored.journalDraft);assert.deepEqual(selected.world.events,restored.events);
assert.deepEqual(store.stateSchema.parse(JSON.parse(JSON.stringify(selected.world))),selected.world);
const skipped=harness(true,model.emptyFunctionalPreferences()),skippedJob=skipped.run();skipped.release();await skippedJob;assert.equal(skipped.world.checkin,null);assert.equal(skipped.world.wellbeing.checkins.length,0);assert.ok(skipped.world.onboarding);
const failure=harness(true,model.emptyFunctionalPreferences(),true),failedJob=failure.run();failure.release();await failedJob;assert.deepEqual(failure.world,restored);assert.notEqual(failure.context.stage,4);assert.equal(failure.context.busy,false);assert.equal(failure.context.submitting.current,false);

const component=source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='WarmaOnboarding');
const componentCode=ts.transpileModule('('+component.getText(source).replace('export default function','function')+')',{compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
const local={React,...model,...catalog,today:store.today,knotDisclaimer:'El nudo es una representación visual de tus registros, no una medición clínica.',WarmaEvaluation:()=>null,OnboardingKnot:()=>null,Modal:()=>null,Choices:()=>null,Compass:()=>null,Feather:()=>null,ShieldCheck:()=>null,Wind:()=>null,useEffect(){},useState(){},useRef(){}};
for(const statement of source.statements)if(ts.isVariableStatement(statement))for(const d of statement.declarationList.declarations)if(d.initializer&&ts.isIdentifier(d.name))local[d.name.text]=vm.runInNewContext(ts.transpileModule('('+d.initializer.getText(source)+')',{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText);
function view(stage,consent=false){
 const state=[stage,consent,model.emptyFunctionalPreferences(),false,false];let index=0;
 local.useState=initial=>{const i=index++;if(!(i in state))state[i]=typeof initial==='function'?initial():initial;return [state[i],value=>{state[i]=typeof value==='function'?value(state[i]):value;}];};local.useRef=()=>({current:null});
 const render=()=>{index=0;const tree=vm.runInNewContext(componentCode,local)({open:true,onOpen(){},data:restored,navigate(){}}),nodes=[];
  function walk(node){if(Array.isArray(node)){node.forEach(walk);return;}if(node&&typeof node==='object'&&node.props){nodes.push(node);walk(node.props.children);}}walk(tree);return nodes;};
 return {state,render};
}
const privacy=view(1),privacyNodes=privacy.render();assert.equal(privacyNodes.find(n=>n.props.children==='Continuar').props.disabled,true);privacyNodes.find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}});assert.equal(privacy.render().find(n=>n.props.children==='Continuar').props.disabled,false);
const preferences=view(3,true);
let controls=preferences.render();assert.ok(controls.find(n=>n.type==='fieldset'));assert.equal(controls.filter(n=>n.props['aria-current']==='step').length,1);
for(const [i,[label,value]] of [['Carga de hoy','Intermedia'],['Energía de hoy','Baja'],['Mi prioridad','Concentrarme']].entries()){controls=preferences.render();assert.equal(controls.filter(n=>n.type===local.Choices).length,1);controls.find(n=>n.props.label===label).props.onChange(value);if(i<2)preferences.render().find(n=>n.props.children==='Continuar').props.onClick();}
assert.deepEqual(JSON.parse(JSON.stringify(preferences.state[2])),{load:'media',energy:'baja',goal:'estudiar'});
assert.equal(model.functionalProfile(preferences.state[2],12).minutes,5);
preferences.render().find(n=>n.props.children==='Prefiero no responder').props.onClick();assert.deepEqual(preferences.state[2],model.emptyFunctionalPreferences());
const evaluation=view(2).render();assert.equal(evaluation.filter(n=>n.props.type==='number').length,0);assert.ok(evaluation.find(n=>n.type===local.WarmaEvaluation));
console.log('PASS: old backup/draft compatibility; returning users preserved; 96 optional preference combinations; late-hour duration; six instruments blocked; real submit callback consent, duplicate guard, storage failure and JSON roundtrip; consent UI and preference controls. Native browser/IndexedDB not simulated as real QA.');
