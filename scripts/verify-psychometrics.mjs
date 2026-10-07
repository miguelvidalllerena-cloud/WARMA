import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {createTSLoader} from './test/ts-loader.mjs';
const load=createTSLoader(),model=load('lib/warma-psychometrics.ts'),store=load('lib/itaca-store.ts'),onboarding=load('lib/warma-onboarding.ts'),catalog=load('lib/warma-instruments.ts'),contextual=load('lib/warma-contextual.ts'),repository=load('lib/warma-assessment-store.ts');
const responses=value=>Object.fromEntries(model.assessmentItemIds.map(id=>[id,value]));
for(const [value,total] of [[1,14],[3,42],[5,70]])assert.equal(model.calculateRawScore(model.asq14Protocol,responses(value)),total);
assert.equal(model.calculateRawScore(model.asq14Protocol,Object.fromEntries(model.assessmentItemIds.map((id,i)=>[id,i%5+1]))),40);
assert.deepEqual(model.asq14Protocol.reverse,[]);
for(const id of model.assessmentItemIds)for(let value=1;value<=5;value++)assert.equal(model.calculateRawScore(model.asq14Protocol,{...responses(3),[id]:value}),42+value-3);
for(const invalid of [null,undefined,0,-1,6,1.5,NaN,Infinity,'3',true])assert.throws(()=>model.calculateRawScore(model.asq14Protocol,{...responses(3),[model.assessmentItemIds[7]]:invalid}));
assert.throws(()=>model.calculateRawScore(model.asq14Protocol,{}));
assert.throws(()=>model.calculateRawScore(model.asq14Protocol,{...responses(3),unknown:3}));
// Synthetic arithmetic fixture, never the items of another protected instrument.
const synthetic={itemIds:['a','b','c'],min:0,max:4,reverse:['b'],method:'sum'};
assert.equal(model.calculateRawScore(synthetic,{a:2,b:0,c:3}),9);
assert.equal(model.calculateRawScore({...synthetic,method:'mean'},{a:2,b:0,c:3}),3);
assert.equal(model.calculateRawScore(synthetic,{a:2,b:4,c:3}),5);
for(const protocol of [{...synthetic,itemIds:[]},{...synthetic,itemIds:['a','a']},{...synthetic,reverse:['unknown']},{...synthetic,reverse:['b','b']},{...synthetic,min:4,max:0},{...synthetic,method:'unsupported'}])assert.throws(()=>model.calculateRawScore(protocol,{a:2,b:0,c:3}));
let draft=model.createAssessmentDraft('2026-10-04T14:00:00Z');assert.equal(model.assessmentProgress(draft).answered,0);assert.equal(model.assessmentProgress(draft).canFinish,false);
for(const [i,id] of model.assessmentItemIds.entries()){draft=model.answerAssessment(draft,id,3,'2026-10-04T14:01:00Z');assert.equal(model.assessmentProgress(draft).answered,i+1);}
assert.equal(model.assessmentProgress(draft).canFinish,true);
assert.equal(model.calculateRawScore(model.asq14Protocol,draft.responses),42);
const revisited=model.moveAssessment(draft,100);assert.equal(revisited.cursor,13);assert.equal(model.moveAssessment(revisited,-100).cursor,0);assert.deepEqual(revisited.responses,draft.responses);
assert.throws(()=>model.moveAssessment(draft,1.5));assert.throws(()=>model.answerAssessment(draft,'unknown',3,'2026-10-04T14:01:00Z'));assert.throws(()=>model.answerAssessment(draft,model.assessmentItemIds[0],1.5,'2026-10-04T14:01:00Z'));
assert.equal(model.assessmentDraftSchema.safeParse({...draft,version:'another-version'}).success,false);
assert.equal(model.assessmentDraftSchema.safeParse({...draft,kind:'contextual'}).success,false);
for(const i of catalog.instruments){assert.equal(catalog.administrationStatus(i.id).available,false);assert.ok(i.authors&&i.year&&i.itemCount&&i.permission&&i.limitations);}
assert.equal(model.assessmentAvailability().available,false);assert.ok(model.assessmentSlots.every(s=>s.text===null&&s.placeholder.includes('pendiente')));
assert.equal(model.assessmentPackage.instructions,null);assert.equal(model.assessmentPackage.recallPeriod,null);
for(const call of [()=>repository.beginAssessment(),()=>repository.saveAssessmentAnswer(model.assessmentItemIds[0],3),()=>repository.navigateAssessment(1),()=>repository.finishAssessment()])await assert.rejects(call,/Evaluación no habilitada/);
for(const total of [14,42,70]){
 const fabricated={kind:'psychometric',instrumentId:'asq14',version:model.assessmentVersion,completedAt:'2026-10-04T14:02:00Z',responses:responses(3),rawTotal:total,dimension:'cumulative-stressors'};
 assert.equal(model.assessmentResultSchema.safeParse(fabricated).success,false);
 const world=store.blankState();world.assessment.results.push(fabricated);assert.equal(store.stateSchema.safeParse(world).success,false);
}
assert.equal(contextual.contextualModule.review,null);assert.equal(contextual.contextualModule.questions.length,0);
assert.equal(contextual.contextualDraftSchema.safeParse({kind:'contextual',version:'pending',answers:{example:'A'},updatedAt:'2026-10-04T14:00:00Z'}).success,false);
const legacy=store.blankState(193);delete legacy.assessment;delete legacy.onboardingDraft;delete legacy.contextualDraft;
legacy.journalDraft={title:'Privado',body:'Conservar esta idea',tags:'tarea'};
const restored=store.stateSchema.parse(legacy);assert.deepEqual(restored.assessment,model.emptyAssessmentState());assert.equal(restored.contextualDraft,null);assert.equal(restored.onboardingDraft,null);assert.equal(restored.seed,193);assert.deepEqual(restored.journalDraft,legacy.journalDraft);
const preferences={load:'alta',energy:'baja',goal:'estudiar'};
restored.onboarding=onboarding.onboardingSchema.parse({version:1,kind:'preferences',completedAt:'2026-10-04T14:00:00Z',privacyVersion:'2026-10-04',preferences});
assert.equal(store.recommendation(restored).minutes,5);assert.equal(store.recommendation(restored).region,'focus');
for(const goal of ['descansar','reflexionar','crear','organizarme']){
 const copy=structuredClone(restored);copy.onboarding.preferences.goal=goal;
 assert.equal(store.recommendation(copy).region,{descansar:'body',reflexionar:'journal',crear:'art',organizarme:'path'}[goal]);
}
// The completed onboarding and its derived daily check-in must propose the same entry.
for(const goal of ['estudiar','organizarme','reflexionar','descansar','crear']){
 const daily=store.blankState();daily.checkin={date:store.today(),load:'alta',energy:'baja',goal};
 const expected=onboarding.functionalProfile(daily.checkin,12),actual=store.recommendation(daily);
 assert.equal(actual.region,expected.region,`Daily and entry region for ${goal}`);assert.equal(actual.minutes,expected.minutes);
}
restored.checkin={date:store.today(),load:'ligera',energy:'alta',goal:'crear'};assert.equal(store.recommendation(restored).region,'art');assert.equal(onboarding.preferenceContext(restored).source,'Tu check-in de hoy');
restored.checkin.date='2020-01-01';assert.equal(store.recommendation(restored).minutes,5);assert.equal(onboarding.preferenceContext(restored).source,'Tus preferencias de primer ingreso');
const visual=load('lib/warma-knot.ts');assert.equal(visual.visualTension(restored),.88);const daily=structuredClone(restored);daily.checkin={date:store.today(),load:'ligera',energy:'alta',goal:'estudiar'};assert.equal(visual.visualTension(daily),.18);
const noScore=store.recommendation(restored);restored.assessment.draft=draft;assert.deepEqual(store.recommendation(restored),noScore,'No private draft/score drives recommendations');
const roundtrip=store.stateSchema.parse(JSON.parse(JSON.stringify(restored)));assert.deepEqual(roundtrip.assessment.draft.responses,draft.responses);
// Inspect executable call sites in every new response/personalization module.
for(const file of ['lib/warma-psychometrics.ts','lib/warma-contextual.ts','lib/warma-assessment-store.ts','lib/warma-onboarding.ts','components/itaca/warma-onboarding.tsx','components/itaca/warma-evaluation.tsx','components/itaca/warma-personalization.tsx']){
 const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function visit(node){if(ts.isCallExpression(node)){const name=ts.isIdentifier(node.expression)?node.expression.text:ts.isPropertyAccessExpression(node.expression)?node.expression.name.text:'';assert.ok(!['fetch','sendBeacon','XMLHttpRequest','WebSocket','setItem'].includes(name),`Unexpected transport/persistence in ${file}: ${name}`);}ts.forEachChild(node,visit);}visit(source);
}
console.log('PASS: 14–70 reference scoring and 70 single-item variations; reverse/mean synthetic fixture; missing, unknown, fractional and out-of-range rejection; 14-item progress and cursor; version isolation; six permission gates and repository blocks; forged result imports rejected; contextual review gate; old backup compatibility; explainable preferences and daily precedence; no new network transport. No clinical or native-browser validation claimed.');
