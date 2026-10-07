let context:AudioContext|null=null, master:GainNode|null=null, pan:StereoPannerNode|null=null;
let generation=0,desiredSound=false;
export async function setSound(enabled:boolean){
 const request=++generation;desiredSound=enabled;
 try {
  if(!enabled){if(master&&context){master.gain.setTargetAtTime(0,context.currentTime,.15);if(context.state!=='closed')await context.suspend();}return false;}
  if(!context){context=new AudioContext();master=context.createGain();master.gain.value=0;pan=context.createStereoPanner();pan.connect(master);master.connect(context.destination);[110,164.81,220.3].forEach(f=>{const o=context!.createOscillator(),g=context!.createGain();o.frequency.value=f;o.type='sine';g.gain.value=.018;o.connect(g);g.connect(pan!);o.start();});}
  await context.resume();
  if(request!==generation){if(!desiredSound&&context.state!=='closed')await context.suspend();return desiredSound&&context.state==='running';}
  master!.gain.setTargetAtTime(.5,context.currentTime,.5);return true;
 }catch {if(request===generation)throw new Error('Este navegador no pudo cambiar el audio.');return desiredSound&&context?.state==='running';}
}
export function navigateSound(position:number){if(context&&pan)pan.pan.setTargetAtTime(Math.max(-.5,Math.min(.5,position)),context.currentTime,.4);}
export function successSound(){if(!context||!master||!desiredSound||context.state!=='running'||master.gain.value===0)return;const o=context.createOscillator(),g=context.createGain();o.frequency.setValueAtTime(523.25,context.currentTime);o.frequency.exponentialRampToValueAtTime(783.99,context.currentTime+.2);g.gain.setValueAtTime(.04,context.currentTime);g.gain.exponentialRampToValueAtTime(.001,context.currentTime+.7);o.connect(g);g.connect(master);o.start();o.stop(context.currentTime+.8);}
