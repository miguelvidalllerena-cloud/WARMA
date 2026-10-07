import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the production callbacks with an in-memory browser history.
const source=ts.createSourceFile('app.tsx',fs.readFileSync('components/itaca/app.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const declarations=new Map();
function visit(node){if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name))declarations.set(node.name.text,node);ts.forEachChild(node,visit);}visit(source);
const ids=declarations.get('nav').initializer.elements.map(el=>el.properties.find(p=>p.name.getText(source)==='id').initializer.text);
let current='world',entries=['http://warma.test/'],index=0;
const location=new URL(entries[0]);
const context={location,nav:ids.map(id=>({id})),regions:ids.map(id=>({id})),reduced:true,travelTimer:{current:null},main:{current:{focus(){}}},setFocusDuration(){},setRegion:r=>current=r,setHover(){},setMenu(){},setZen(){},setStoryProgress(){},setTravel(){},navigateSound(){},clearTimeout(){},setTimeout:fn=>{fn();return 1;},window:{scrollTo(){}},history:{pushState(_state,_title,url){entries=entries.slice(0,index+1);entries.push(new URL(url,location).href);index++;location.href=entries[index];}}};
function callback(node){return vm.runInNewContext(ts.transpileModule('('+node.getText(source)+')',{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,context);}
const route=callback(declarations.get('route').initializer);
const navigate=callback(declarations.get('navigate').initializer.arguments[0]);
for(const region of ['path','mirror','journal','garden']){
 entries=['http://warma.test/'];index=0;location.href=entries[0];route();assert.equal(current,'world');
 navigate(region);assert.equal(current,region);assert.equal(location.hash,'#'+region);
 location.href=entries[--index];route({type:'popstate'});assert.equal(current,'world');assert.equal(location.hash,'');
 location.href=entries[++index];route({type:'popstate'});assert.equal(current,region);
 current='world';route();assert.equal(current,region,'Reload must derive the view from the URL');
 navigate('world');assert.equal(location.hash,'');assert.equal(current,'world');
}
location.hash='#mirror';route({type:'hashchange'});assert.equal(current,'mirror');
location.hash='';route({type:'hashchange'});assert.equal(current,'world');
console.log('PASS: Inicio ↔ Camino / Espejo / Bitácora / Mi jardín, Back, Forward, route reload, empty hash and direct hash changes (production callbacks; simulated browser).');
