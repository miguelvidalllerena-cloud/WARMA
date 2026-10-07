import fs from 'node:fs';
import {spawnSync,execFileSync} from 'node:child_process';
import path from 'node:path';
import zlib from 'node:zlib';

const checks=[['types','./node_modules/.bin/tsc',['--noEmit']],...['feature-flags','warma','onboarding','navigation','focus-duration','copy','psychometrics','onboarding-flow','onboarding-motion','pss10','pss10-persistence','pss10-ui','crypto','vault-persistence','vault-ui','audio-lifecycle','breathing-lifecycle','mirror','mirror-ui','offline-readiness','pwa-metadata'].map(name=>[name,'node',[`scripts/verify-${name}.mjs`]])];
const report={date:new Date().toISOString(),branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),scope:'Native Node Web Crypto; real callbacks with deterministic adapters. No browser/device certification.',checks:[],build:null,pwa:null,metrics:null};
function run(name,command,args){const r=spawnSync(command,args,{encoding:'utf8',maxBuffer:4*1024*1024});const item={name,command:[command,...args].join(' '),exit:r.status,result:r.status===0?'PASS':'FAIL',output:(r.stdout+r.stderr).replace(/\u001b\[[0-9;]*m/g,'')};console.log(`${item.result}: ${name}`);report.checks.push(item);if(r.status!==0){console.error(item.output);save();process.exit(r.status||1);}return item;}
const target=process.argv[2]||'qa/lambayeque-v2-latest.json';
function save(){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');}
for(const [name,command,args] of checks)run(name,command,args);
report.build=run('build','npm',['run','build']);
run('prepare-pwa','node',['scripts/prepare-pwa.mjs']);report.pwa=run('pwa','node',['scripts/verify-pwa.mjs','dist/client/sw.js']);
run('build-artifacts','node',['scripts/verify-build-artifacts.mjs']);
const files=[];function scan(root){for(const e of fs.readdirSync(root,{withFileTypes:true})){const file=path.join(root,e.name);e.isDirectory()?scan(file):files.push(file);}}scan('dist/client');
const js=files.filter(f=>f.endsWith('.js')),css=files.filter(f=>f.endsWith('.css'));
report.metrics={kind:'On-disk build artifact, not observed network/CWV/FPS',jsFiles:js.length,jsBytes:js.reduce((n,f)=>n+fs.statSync(f).size,0),jsGzipBytes:js.reduce((n,f)=>n+zlib.gzipSync(fs.readFileSync(f)).length,0),cssBytes:css.reduce((n,f)=>n+fs.statSync(f).size,0),clientBytes:files.reduce((n,f)=>n+fs.statSync(f).size,0)};
save();console.log('PASS: suite/build/precache; evidence '+target);
