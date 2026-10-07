import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const module={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/warma-copy.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:module.exports});
const {counted,plural,qualityName}=module.exports;
for(const [singular,multiple] of [['reflexión','reflexiones'],['misión','misiones'],['paso','pasos'],['pausa','pausas'],['acción','acciones'],['registro','registros'],['sesión','sesiones'],['cristal','cristales'],['conexión','conexiones']]){
 for(const n of [0,1,2,21]){assert.equal(plural(n,singular,multiple),n===1?singular:multiple);assert.equal(counted(n,singular,multiple),`${n} ${n===1?singular:multiple}`);}
}
assert.equal(qualityName('Essential · compatible'),'Esencial · compatible');assert.equal(qualityName('Balanced'),'Equilibrada');assert.equal(qualityName('Immersive'),'Inmersiva');
for(const f of fs.readdirSync('components/itaca').filter(f=>f.endsWith('.tsx'))){const text=fs.readFileSync('components/itaca/'+f,'utf8');assert(!/REGIÓN \d+ \/ (PROJECTS|MEMORY|OBSERVATORY|THE PATH)|DREAM BOARD|MEMORY PALACE|MOUNTAIN OF CHALLENGES/.test(text),f);}
console.log('PASS: Spanish singular/plural (0, 1, 2, 21), quality labels, and legacy English section headings.');
