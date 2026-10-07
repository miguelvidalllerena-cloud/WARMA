import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
const root='dist/client',budget=JSON.parse(fs.readFileSync('performance-budget.json','utf8')),files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);entry.isDirectory()?walk(file):files.push(file);}}walk(root);
const js=files.filter(f=>f.endsWith('.js')),css=files.filter(f=>f.endsWith('.css'));
const metrics={jsGzipBytes:js.reduce((n,f)=>n+zlib.gzipSync(fs.readFileSync(f)).length,0),cssBytes:css.reduce((n,f)=>n+fs.statSync(f).size,0),clientBytes:files.reduce((n,f)=>n+fs.statSync(f).size,0)};
for(const [name,actual]of Object.entries(metrics))assert(actual<=budget[name],`${name}: ${actual} exceeds ${budget[name]} bytes; investigate rather than remove functionality`);
const serverOnly=['WARMA_AI_API_KEY','WARMA_AI_LIMITER','https://api.openai.com/v1/responses','https://api.anthropic.com/v1/messages','Eres Espejo de WARMA, una guía educativa breve'];
for(const file of js){const source=fs.readFileSync(file,'utf8');for(const marker of serverOnly)assert(!source.includes(marker),`Server-only marker in ${file}`);}
for(const file of files)assert(!/PSS-10_AU2\.0_spa-ES_10OCT2024\.docx|Scoring_PSS.*\.pdf|\.env(?:\.|$)|\.dev\.vars(?:\.|$)/.test(path.basename(file)),'Private file in public build');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');assert.match(sw,/const VERSION = 'itaca-v1-[a-f0-9]{12}'/,'Run prepare-pwa after build');
const precache=JSON.parse(sw.match(/const PRECACHE = (\[.*?\]);/)[1]);
assert.ok(precache.includes('/offline.html'),'The exact offline fallback must be cached');
assert.ok(precache.every(asset=>!asset.split('/').some(part=>part.startsWith('.'))),'Cloudflare does not serve internal files such as .assetsignore');
assert.ok(!precache.includes('/_headers')&&!precache.includes('/_redirects'),'Hosting directives are not public precache resources');
console.log('PASS: build budgets '+JSON.stringify(metrics)+'; server-only markers/private filenames absent, production SW prepared. Not a comprehensive secret/content scan or device benchmark.');
