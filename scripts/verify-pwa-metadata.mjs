import assert from 'node:assert/strict';
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('public/manifest.webmanifest','utf8'));
assert.equal(manifest.short_name,'WARMA');assert.equal(manifest.lang,'es');assert.equal(manifest.id,'/');assert.equal(manifest.start_url,'/');assert.equal(manifest.scope,'/');assert.equal(manifest.display,'standalone');
for(const field of ['theme_color','background_color'])assert.match(manifest[field],/^#[a-f\d]{6}$/i);
const sizes=[];
for(const icon of manifest.icons){
 assert(icon.src.startsWith('/')&&!icon.src.startsWith('//'));assert.equal(icon.type,'image/png');const bytes=fs.readFileSync('public'+icon.src);assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(bytes.subarray(12,16).toString(),'IHDR');const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);assert.equal(icon.sizes,`${width}x${height}`);sizes.push(icon.sizes);
}assert(sizes.includes('192x192')&&sizes.includes('512x512'));assert(manifest.icons.some(icon=>icon.purpose==='maskable'&&icon.sizes==='512x512'));
const html=fs.readFileSync('public/offline.html','utf8');assert.match(html,/lang="es"/);assert.match(html,/viewport/);assert.match(html,/href="\/"/);assert(!/\b(?:src|href)=["']https?:/.test(html),'Offline fallback must have no remote assets');
assert(fs.readFileSync('app/layout.tsx','utf8').includes("manifest:'/manifest.webmanifest'"));
const prep=fs.readFileSync('scripts/prepare-pwa.mjs','utf8');assert(prep.includes('hash.update(template)'),'SW logic must participate in version hash');
console.log('PASS: manifest scope/install metadata, local PNG dimensions, maskable declaration, Spanish self-contained fallback and version/hash seam. Installation/maskable rendering not tested natively.');
