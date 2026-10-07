import {knotPoint} from './warma-model';
import type {WorldState} from './itaca-store';
import {preferenceContext} from './warma-onboarding';
type V=[number,number,number];
export function visualTension(d:WorldState){const current=preferenceContext(d).preferences;const base=current.load==='alta'?.88:current.load==='ligera'?.18:.52;const last=d.wellbeing.pauses.at(-1);return Math.max(.08,base-(last&&Date.now()-Date.parse(last.createdAt)<3600000?.12:0));}
export function knotSurface(t:number,a:number,tension:number):{p:V;n:V}{const c=knotPoint(t,tension),p2=knotPoint(t+.001,tension),tan=p2.map((v,i)=>v-c[i]),len=Math.hypot(...tan);const T=tan.map(v=>v/len),N=[T[1],-T[0],0],nl=Math.hypot(...N);for(let i=0;i<3;i++)N[i]/=nl;const B=[T[1]*N[2]-T[2]*N[1],T[2]*N[0]-T[0]*N[2],T[0]*N[1]-T[1]*N[0]],n=N.map((v,i)=>v*Math.cos(a)+B[i]*Math.sin(a)) as V;return {p:c.map((v,i)=>v+n[i]*(.16+.03*tension)) as V,n};}
export function drawWarmaKnot(ctx:CanvasRenderingContext2D,cx:number,cy:number,r:number,tension:number,time:number){
 const tilt=.72,turn=-.42+Math.sin(time*.35)*.08;
 const rotate=(p:V):V=>{const[x,y,z]=p;const yy=y*Math.cos(tilt)-z*Math.sin(tilt),zz=y*Math.sin(tilt)+z*Math.cos(tilt);return [x*Math.cos(turn)-yy*Math.sin(turn),x*Math.sin(turn)+yy*Math.cos(turn),zz];};
 const project=(p:V)=>{const f=7/(7-p[2]);return [cx+p[0]*r*f,cy-p[1]*r*f];};
 const ring:ReturnType<typeof knotSurface>[][]=[];const S=172,R=12;
 for(let i=0;i<=S;i++){const row=[];for(let j=0;j<=R;j++){const v=knotSurface(i/S*Math.PI*2,j/R*Math.PI*2,tension);row.push({p:rotate(v.p),n:rotate(v.n)});}ring.push(row);}
 const faces:{points:V[];z:number;light:number;spec:number;t:number}[]=[];
 for(let i=0;i<S;i++)for(let j=0;j<R;j++){const vs=[ring[i][j],ring[i+1][j],ring[i+1][j+1],ring[i][j+1]],n=vs.reduce((a,v)=>a.map((x,k)=>x+v.n[k]/4) as V,[0,0,0] as V);if(n[2]<-.2)continue;faces.push({points:vs.map(v=>v.p),z:vs.reduce((a,v)=>a+v.p[2]/4,0),light:Math.max(0,n[0]*-.35+n[1]*.65+n[2]*.68),spec:Math.pow(Math.max(0,n[0]*-.18+n[1]*.48+n[2]*.86),20),t:i/S});}
 faces.sort((a,b)=>a.z-b.z);
 for(const f of faces){const warm=Math.max(0,Math.sin(f.t*6.28+1))*.55+tension*.18,base=[85+warm*90,173+warm*12,160-warm*16],c=base.map(v=>Math.round(Math.min(255,v*(.2+f.light*.9)+f.spec*95)));ctx.fillStyle=`rgb(${c.join(',')})`;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.6;ctx.beginPath();f.points.map(project).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();}
}
