import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
export function createTSLoader(overrides={}){
 const cache=new Map();
 function load(file){
  file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
  const source=fs.readFileSync(file,'utf8'),compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const mod={exports:{}};cache.set(file,mod);
  const localRequire=id=>{
   if(id in overrides)return overrides[id];
   if(id.startsWith('.')||id.startsWith('@/')){const base=id.startsWith('@/')?path.resolve(id.slice(2)):path.resolve(path.dirname(file),id);return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx');}
   return require(id);
  };
  vm.runInThisContext('(function(require,module,exports){'+compiled+'\n})',{filename:file})(localRequire,mod,mod.exports);
  return mod.exports;
 }
 return load;
}
