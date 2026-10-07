import assert from 'node:assert/strict';
import {createTSLoader} from './test/ts-loader.mjs';
const load=createTSLoader(),pss=load('lib/pss10-instrument.ts'),engine=load('lib/psychometric-engine.ts'),store=load('lib/itaca-store.ts'),repo=load('lib/pss10-store.ts');
const ids=pss.pss10ItemIds,answers=value=>Object.fromEntries(ids.map(id=>[id,value]));
const inverted=new Set([3,4,6,7]);
const minimum=Object.fromEntries(ids.map((id,i)=>[id,inverted.has(i)?4:0]));
const maximum=Object.fromEntries(ids.map((id,i)=>[id,inverted.has(i)?0:4]));
assert.equal(pss.scorePss10(minimum).total,0);assert.equal(pss.scorePss10(maximum).total,40);
for(const [value,total] of [[0,16],[2,20],[4,24]])assert.equal(pss.scorePss10(answers(value)).total,total);
for(const [i,id] of ids.entries())for(let value=0;value<=4;value++)assert.equal(pss.scorePss10({...answers(2),[id]:value}).total,20+(inverted.has(i)?-1:1)*(value-2));
// Independently derive expected corrected sum, including each one/two-item omission.
const mixed=Object.fromEntries(ids.map((id,i)=>[id,i%5]));
for(let first=-1;first<10;first++)for(let second=-1;second<10;second++){
 const omitted=new Set([first,second].filter(i=>i>=0)),fixture={...mixed};
 let sum=0;
 for(let i=0;i<10;i++){if(omitted.has(i)){delete fixture[ids[i]];continue;}sum+=inverted.has(i)?4-i%5:i%5;}
 const outcome=pss.scorePss10(fixture),expected=omitted.size?sum/(10-omitted.size)*10:sum;
 assert.equal(outcome.total,expected);assert.equal(outcome.answered,10-omitted.size);assert.equal(outcome.prorated,omitted.size>0);
}
const fractional={...maximum,[ids[0]]:null,[ids[1]]:1};
assert.equal(pss.scorePss10(fractional).total,33/9*10);assert.ok(!Number.isInteger(pss.scorePss10(fractional).total));
const three={...answers(2),[ids[0]]:null,[ids[1]]:null,[ids[2]]:null};
assert.equal(pss.scorePss10(three).status,'INSUFFICIENT_DATA');assert.equal(pss.scorePss10(three).total,null);
assert.equal(pss.scorePss10({}).total,null);
for(const multiple of [[0,4],[2,2],[]]){
 const result=pss.scorePss10({...answers(2),[ids[3]]:multiple});
 assert.equal(result.total,20);assert.deepEqual(result.missingIds,[ids[3]]);assert.equal(result.prorated,true);
}
assert.equal(pss.scorePss10({...answers(2),[ids[3]]:[0]}).total,22);
for(const bad of [-1,5,1.5,NaN,Infinity,'2',undefined,true,[0,5],[NaN],[0,1,2,3,4,0]])assert.throws(()=>pss.scorePss10({...answers(2),[ids[0]]:bad}));
assert.throws(()=>pss.scorePss10({...answers(2),extra:0}));
for(const bad of [{...pss.pss10Protocol,itemIds:[]},{...pss.pss10Protocol,itemIds:[ids[0],ids[0]]},{...pss.pss10Protocol,maxMissing:10},{...pss.pss10Protocol,maxMissing:-1},{...pss.pss10Protocol,maxMissing:1.5},{...pss.pss10Protocol,reverse:['unknown']},{...pss.pss10Protocol,reverse:[ids[0],ids[0]]},{...pss.pss10Protocol,method:'invented'}])assert.throws(()=>engine.scoreInstrument(bad,answers(2)));
assert.equal(engine.scoreInstrument({itemIds:['a','b'],min:0,max:4,reverse:['b'],method:'mean',maxMissing:0,prorateMissing:false,multipleAnswers:'missing'},{a:4,b:0}).total,4);

const at='2026-10-04T22:00:00Z';let draft=pss.createPss10Draft(at);
assert.equal(pss.pss10Progress(draft).canFinish,false);assert.equal(pss.pss10Progress(draft).answered,0);
for(let i=0;i<8;i++){draft=pss.answerPss10(draft,ids[i],0,at);assert.equal(pss.pss10Progress(draft).answered,i+1);}
assert.equal(pss.pss10Progress(draft).canFinish,true);
draft=pss.answerPss10(draft,ids[0],null,at);assert.equal(pss.pss10Progress(draft).canFinish,false);
assert.equal(pss.movePss10(draft,100).cursor,9);assert.equal(pss.movePss10(draft,-100).cursor,0);
assert.throws(()=>pss.movePss10(draft,1.5));assert.throws(()=>pss.answerPss10(draft,'unknown',2,at));
assert.equal(pss.pss10DraftSchema.safeParse({...draft,version:'other'}).success,false);
assert.equal(pss.pss10DraftSchema.safeParse({...draft,scoringVersion:'old'}).success,false);
function record(responses,date=at){const score=pss.scorePss10(responses);return {kind:'psychometric',instrumentId:'pss10',version:pss.pss10Version,scoringVersion:pss.pss10ScoringVersion,completedAt:date,responses,rawTotal:score.total,answered:score.answered,missingIds:score.missingIds,prorated:score.prorated,dimension:'perceived-stress'};}
const valid=record(fractional);assert.equal(pss.pss10ScoredRecordSchema.safeParse(valid).success,true);
for(const invalid of [{...valid,rawTotal:40},{...valid,answered:10},{...valid,prorated:false},{...valid,missingIds:[]},{...valid,responses:three},{...valid,responses:{...fractional,unknown:2}},{...valid,version:'invented'},{...valid,dimension:'diagnosis'}])assert.equal(pss.pss10ScoredRecordSchema.safeParse(invalid).success,false);
assert.equal(pss.pss10ResultSchema.safeParse(valid).success,false,'Arithmetic validity does not authorize storage/administration');
assert.equal(pss.pss10History([]).delta,null);assert.equal(pss.pss10History([valid]).delta,null);
const prior=record(minimum,'2026-09-01T10:00:00Z');assert.equal(pss.pss10History([valid,prior]).delta,valid.rawTotal);assert.equal(pss.pss10History([valid,prior]).records[0].completedAt,prior.completedAt);
const subsecond=record(minimum,'2026-10-04T22:00:00.001Z');assert.equal(pss.pss10History([subsecond,valid]).latest.completedAt,subsecond.completedAt);

assert.equal(pss.pss10Permission.status,'PENDING_PERMISSION');assert.equal(pss.pss10Permission.accessObtained,true);assert.equal(pss.pss10Permission.administrationGranted,false);assert.equal(pss.pss10Permission.publicRedistributionGranted,false);
assert.equal(pss.pss10Availability().available,false);assert.ok(pss.pss10Slots.every(slot=>slot.text===null));
const granted={status:'AUTHORIZED',accessObtained:true,administrationGranted:true,publicRedistributionGranted:true,agreementReference:'TEST-ONLY-GRANT'};
for(const status of ['PENDING_PERMISSION','RESEARCH_ONLY','DISABLED'])assert.equal(engine.canAdminister({...granted,status},'controlled',true,true).available,false);
for(const delivery of ['public-bundle','controlled'])for(const administrationGranted of [false,true])for(const publicRedistributionGranted of [false,true])for(const contentReady of [false,true])for(const populationReviewed of [false,true]){
 const result=engine.canAdminister({...granted,administrationGranted,publicRedistributionGranted},delivery,contentReady,populationReviewed);
 assert.equal(result.available,administrationGranted&&contentReady&&populationReviewed&&(delivery==='controlled'||publicRedistributionGranted));
}
assert.equal(engine.canAdminister({...granted,agreementReference:null},'controlled',true,true).available,false);
const syntheticContent={version:pss.pss10Version,instructions:'TEST INSTRUCTIONS — no official wording',responseLabels:['Test 0','Test 1','Test 2','Test 3','Test 4'],items:ids.map((id,i)=>({id,text:'TEST FIXTURE '+i}))};
assert.equal(pss.protectedPss10ContentReady(syntheticContent),true);assert.equal(pss.pss10Availability(syntheticContent).available,false,'Content alone cannot grant administration');
for(const bad of [{...syntheticContent,version:'different'},{...syntheticContent,responseLabels:['0']},{...syntheticContent,items:[...syntheticContent.items].reverse()},{...syntheticContent,instructions:''},{...syntheticContent,instructions:0},{...syntheticContent,responseLabels:null}])assert.equal(pss.protectedPss10ContentReady(bad),false);
for(const task of [()=>repo.beginPss10(),()=>repo.savePss10Answer(ids[0],0),()=>repo.navigatePss10(1),()=>repo.finishPss10()])await assert.rejects(task,/PSS-10 no habilitada/);
const legacy=store.blankState(47);delete legacy.pss10;legacy.journalDraft={title:'Anterior',body:'Conservar',tags:''};
const migrated=store.stateSchema.parse(legacy);assert.deepEqual(migrated.pss10,pss.emptyPss10State());assert.equal(migrated.seed,47);assert.equal(migrated.journalDraft.body,'Conservar');
const forged=store.blankState();forged.pss10.results.push(valid);assert.equal(store.stateSchema.safeParse(forged).success,false);
assert.equal(pss.pss10Metadata.recallPeriod,'Últimos 30 días');assert.equal(pss.pss10Metadata.supportedAgeRange,null);assert.equal(pss.pss10Metadata.language,'Spanish for Spain (es-ES)');
console.log('PASS: official PSS-10 arithmetic 0–40; reversals 4/5/7/8; 50 single-item variations and 121 missing-pattern fixtures; one/two omissions prorated without rounding; three omissions blocked; multiple marks missing; invalid values/versions/forged scores rejected; progress, first-record history and permission/content gates; legacy snapshots preserved. Synthetic answers only; no licensed administration or native browser claimed.');
