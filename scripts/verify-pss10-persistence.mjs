import assert from 'node:assert/strict';
import {createTSLoader} from './test/ts-loader.mjs';
import {installIDBAdapter} from './test/indexeddb-adapter.mjs';

const production=createTSLoader(),pss=production('lib/pss10-instrument.ts'),actual=production('lib/itaca-store.ts');
const legacy=actual.blankState(992);delete legacy.pss10;
legacy.journal=[{id:'previous',title:'Anterior',body:'Fixture privada conservada',tags:[],createdAt:'2026-09-20T12:00:00Z'}];
legacy.journalDraft={title:'Sin terminar',body:'No perder',tags:'local'};
const idb=installIDBAdapter(legacy);
try{
 await actual.initWorld();assert.deepEqual(actual.getWorld().pss10,pss.emptyPss10State());
 const blocked=production('lib/pss10-store.ts'),before=JSON.stringify(idb.record);
 for(const task of [()=>blocked.beginPss10(),()=>blocked.savePss10Answer(pss.pss10ItemIds[0],0),()=>blocked.finishPss10()])await assert.rejects(task,/no habilitada/);
 assert.equal(JSON.stringify(idb.record),before,'Permission failures must not mutate the snapshot');
 // Only the test loader substitutes authorization. No production flag/content is changed.
 // The fixture tests real repository callbacks and transaction code, not legal administration.
 const fixture={...pss,requirePss10(){},pss10ResultSchema:pss.pss10ScoredRecordSchema,
  pss10StateSchema:pss.pss10StateSchema.extend({results:pss.pss10ScoredRecordSchema.array().max(50)})};
 const overrides={'./pss10-instrument':fixture};
 const load=createTSLoader(overrides),store=load('lib/itaca-store.ts'),repo=load('lib/pss10-store.ts');
 await store.initWorld();
 await Promise.all([repo.beginPss10(),repo.beginPss10()]);
 const started=store.getWorld().pss10.draft.startedAt;assert.equal(store.getWorld().pss10.draft.cursor,0);
 await repo.savePss10Answer(pss.pss10ItemIds[0],0);assert.equal(store.getWorld().pss10.draft.responses[pss.pss10ItemIds[0]],0);
 await repo.navigatePss10(4);assert.equal(store.getWorld().pss10.draft.cursor,4);
 const saved=structuredClone(store.getWorld().pss10.draft),reload=createTSLoader(overrides)('lib/itaca-store.ts');
 await reload.initWorld();assert.deepEqual(reload.getWorld().pss10.draft,saved);
 assert.equal(reload.getWorld().seed,992);assert.deepEqual(reload.getWorld().journal,legacy.journal);assert.deepEqual(reload.getWorld().journalDraft,legacy.journalDraft);
 idb.failNext();await assert.rejects(repo.savePss10Answer(pss.pss10ItemIds[1],3));
 assert.deepEqual(idb.record.pss10.draft,saved,'Failed transaction retains original draft');
 assert.equal(store.getWorld().pss10.draft.responses[pss.pss10ItemIds[1]],null);
 await assert.rejects(repo.savePss10Answer('unknown',3));
 await assert.rejects(repo.savePss10Answer(pss.pss10ItemIds[1],1.5));
 await assert.rejects(repo.finishPss10(),/al menos ocho/);
 for(let i=1;i<8;i++)await repo.savePss10Answer(pss.pss10ItemIds[i],2);
 assert.equal(pss.pss10Progress(store.getWorld().pss10.draft).answered,8);
 const expected=pss.scorePss10(store.getWorld().pss10.draft.responses);
 const completion=await Promise.allSettled([repo.finishPss10(),repo.finishPss10()]);
 assert.equal(completion[0].status,'fulfilled');assert.equal(completion[1].status,'rejected');
 assert.equal(store.getWorld().pss10.results.length,1);assert.equal(store.getWorld().pss10.draft,null);
 const result=store.getWorld().pss10.results[0];assert.equal(result.rawTotal,expected.total);assert.equal(result.answered,8);assert.equal(result.prorated,true);
 assert.equal(result.scoringVersion,pss.pss10ScoringVersion);assert.equal(result.version,pss.pss10Version);
 assert.equal(store.getWorld().events.length,0);assert.equal(store.getWorld().timer,null);assert.deepEqual(store.getWorld().journalDraft,legacy.journalDraft);
 const reloaded=createTSLoader(overrides)('lib/itaca-store.ts');await reloaded.initWorld();assert.deepEqual(reloaded.getWorld().pss10.results,[result]);
 const json=JSON.stringify(reloaded.getWorld());await store.importJSON({size:json.length,text:async()=>json});assert.deepEqual(store.getWorld().pss10.results,[result]);
 const invalid=JSON.parse(json);invalid.pss10.results[0].rawTotal=40;
 const invalidJSON=JSON.stringify(invalid),previous=JSON.stringify(idb.record);
 await assert.rejects(store.importJSON({size:invalidJSON.length,text:async()=>invalidJSON}));assert.equal(JSON.stringify(idb.record),previous);
 await repo.beginPss10();assert.notEqual(store.getWorld().pss10.draft,null);await repo.discardPss10Draft();
 assert.equal(store.getWorld().pss10.draft,null);assert.equal(store.getWorld().pss10.results.length,1);assert.equal(store.getWorld().seed,992);
 assert.ok(started);assert.deepEqual(idb.openings[0],{name:'itaca-living-world',version:1});
 for(const message of idb.messages)assert.deepEqual(Object.keys(message),['updatedAt']);
}finally{idb.restore();}
console.log('PASS: actual PSS repository and existing transactions with deterministic IDB adapter; real permission block prevents writes; synthetic authorization fixture tests start/double start, zero answer, cursor/resume, quota rollback, invalid values, <8 completion denial, proration, duplicate finish, result reload/JSON roundtrip, forged total rejection and draft-only discard. Existing journals/seed/events/timers preserved; native IDB/legal administration not claimed.');
