import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const source=fs.readFileSync(file,'utf8');const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;const mod={exports:{}};cache.set(file,mod);const localRequire=id=>id.startsWith('.')?load(path.resolve(path.dirname(file),id+'.ts')):require(id);vm.runInThisContext('(function(require,module,exports){'+compiled+'\n})',{filename:file})(localRequire,mod,mod.exports);return mod.exports;}
const model=load('lib/warma-model.ts'),store=load('lib/itaca-store.ts'),knot=load('lib/warma-knot.ts');
const legacy=store.blankState(3821);delete legacy.wellbeing;legacy.journal=[{id:'j1',title:'Una estrategia',body:'Probar un paso más pequeño.',tags:[],createdAt:'2026-09-24T12:00:00Z'}];legacy.projects=[{id:'p1',title:'Proyecto previo',goal:'Conservar mi trabajo',deadline:'',notes:'nota',color:'#9ac9b8',tasks:[{id:'t1',title:'Paso anterior',done:true}],files:[],createdAt:'2026-09-24T12:00:00Z',finished:false}];legacy.journalDraft={title:'Borrador anterior',body:'Una idea sin guardar',tags:''};
const migrated=store.stateSchema.parse(legacy);assert.deepEqual(migrated.journal,legacy.journal);assert.deepEqual(migrated.projects,legacy.projects);assert.deepEqual(migrated.journalDraft,legacy.journalDraft);assert.equal(migrated.seed,3821);assert.equal(migrated.wellbeing.reminders.enabled,false);assert.equal(migrated.wellbeing.pauses.length,0);
migrated.wellbeing.pauses.push({id:'pause1',kind:'breathing',seconds:60,createdAt:'2026-09-25T12:00:00Z'});migrated.wellbeing.art.push({id:'art1',title:'Laguna',seed:100,palette:'lagoon',createdAt:'2026-09-25T12:00:00Z'});assert.deepEqual(store.stateSchema.parse(JSON.parse(JSON.stringify(migrated))),migrated);
const fresh=store.blankState(17);assert.equal(fresh.wellbeing.pauses.length,0);assert.equal(fresh.wellbeing.art.length,0);assert.notStrictEqual(fresh.wellbeing,migrated.wellbeing);
const timer={id:'timer1',title:'Paso',projectId:'',total:300,remaining:200,endsAt:null,createdAt:''};assert.equal(store.remainingSeconds(timer),200);assert.equal(store.remainingSeconds({...timer,endsAt:Date.now()-1000}),0);
for(const route of Object.values(model.mirrorRoutes))assert.equal(route.questions.length,4);assert.equal(model.needsHumanSupport('Necesito organizar un examen'),false);assert.equal(model.needsHumanSupport('No estoy a salvo'),true);assert.equal(model.needsHumanSupport('Estoy en peligro inmediato'),true);
for(const tension of [0,.2,.5,1]){const first=model.knotPoint(0,tension),last=model.knotPoint(Math.PI*2,tension);assert.ok(Math.hypot(...first.map((v,i)=>v-last[i]))<1e-10);for(let i=0;i<400;i++){const surface=knot.knotSurface(i/400*Math.PI*2,i*.34,tension);assert.ok([...surface.p,...surface.n].every(Number.isFinite));assert.ok(Math.abs(Math.hypot(...surface.n)-1)<1e-8);}}
const manifest=JSON.parse(fs.readFileSync('public/manifest.webmanifest','utf8'));assert.equal(manifest.short_name,'WARMA');assert.equal(manifest.id,'/');
console.log('WARMA verified: legacy backups and drafts preserved, local export roundtrip, clean reset defaults, paused timers, controlled reflection routes, finite closed knot geometry, stable PWA identity.');
