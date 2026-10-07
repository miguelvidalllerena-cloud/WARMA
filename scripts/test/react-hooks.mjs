// Deterministic callback/effect runner, not DOM or native-browser automation.
export function createHookHarness(component,globals,initialProps={}){
 const slots=[];let cursor=0,dirty=true,props=initialProps,tree,effects=[];
 const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
 globals.useState=initial=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],value=>{const next=typeof value==='function'?value(slots[i]):value;if(!Object.is(next,slots[i])){slots[i]=next;dirty=true;}}];};
 globals.useRef=value=>{const i=cursor++;return slots[i]||(slots[i]={current:value});};
 globals.useCallback=(fn,deps)=>{const i=cursor++;if(!slots[i]||!same(slots[i].deps,deps))slots[i]={deps,fn};return slots[i].fn;};
 globals.useEffect=(effect,deps)=>{const i=cursor++,old=slots[i];if(!old||!same(old.deps,deps)){slots[i]={deps,cleanup:old?.cleanup};effects.push(()=>{slots[i].cleanup?.();slots[i].cleanup=effect();});}};
 function flush(){let turns=0;do {if(++turns>30)throw new Error('Effect loop fixture');dirty=false;cursor=0;effects=[];tree=component(props);const current=effects;effects=[];current.forEach(f=>f());}while(dirty);return tree;}
 return {flush,update(next){props={...props,...next};dirty=true;return flush();},unmount(){for(const s of slots)if(s&&typeof s==='object')s.cleanup?.();},get slots(){return slots;}};
}
export function walkElements(tree){const nodes=[];function visit(n){if(Array.isArray(n))return n.forEach(visit);if(n&&typeof n==='object'&&n.props){nodes.push(n);visit(n.props.children);}}visit(tree);return nodes;}
