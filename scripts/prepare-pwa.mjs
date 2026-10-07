import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve('dist/client');
async function walk(dir){let out=[];for(const ent of await fs.readdir(dir,{withFileTypes:true})){const abs=path.join(dir,ent.name);if(ent.isDirectory())out.push(...await walk(abs));else out.push(abs);}return out;}
const files=(await walk(root)).filter(p=>!p.endsWith('.map')&&!p.endsWith('/sw.js')&&!p.includes('/.vite/')&&!p.endsWith('.br')&&!p.endsWith('.gz'));
// Hosting directives/build metadata are files in dist, not public fetch assets.
const assets=files.map(p=>'/'+path.relative(root,p).replaceAll(path.sep,'/')).filter(p=>!p.endsWith('.html')&&!p.split('/').some(part=>part.startsWith('.'))&&!['/_headers','/_redirects','/vinext-client-entry-manifest.json'].includes(p)&&!/^\/(api|__|auth|login)(\/|$)/.test(p));
const hash=crypto.createHash('sha256');for(const p of files.sort())hash.update(await fs.readFile(p));
const template=await fs.readFile('public/sw.js','utf8');
hash.update(template);
const code=template.replace("const VERSION = 'itaca-v1-dev';",`const VERSION = 'itaca-v1-${hash.digest('hex').slice(0,12)}';`).replace(/const PRECACHE = \[[\s\S]*?\];/,`const PRECACHE = ${JSON.stringify(['/', '/offline.html',...assets])};`);
await fs.writeFile(path.join(root,'sw.js'),code);
console.log(JSON.stringify({pwaAssets:assets.length,serviceWorker:path.join(root,'sw.js')}));
