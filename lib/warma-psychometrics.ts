import {z} from 'zod';
import {administrationStatus} from './warma-instruments';

export const assessmentDisclaimer='Esta evaluación estima aspectos relacionados con el estrés percibido/académico dentro de los límites del instrumento. No constituye un diagnóstico psicológico.';
export const knotDisclaimer='El nudo es una representación visual de tus registros y no una medición clínica.';
export const assessmentItemIds=Array.from({length:14},(_,i)=>`asq14-${String(i+1).padStart(2,'0')}`);
// Item text and instructions are intentionally absent until permission/version review.
export const assessmentSlots=assessmentItemIds.map((id,i)=>({id,number:i+1,text:null,placeholder:`Ítem ${String(i+1).padStart(2,'0')} · texto pendiente de autorización`}));
export const assessmentVersion='asq14-es-2020-pending' as const;
export type ScoreProtocol={itemIds:readonly string[];min:number;max:number;reverse:readonly string[];method:'sum'|'mean'};
// Arithmetic reference only, not a licensed administration package. Blanca et al.,
// 2020, p.263: fourteen 1–5 responses, summed. No reverse items/subscales specified.
export const asq14Protocol:ScoreProtocol={itemIds:assessmentItemIds,min:1,max:5,reverse:[],method:'sum'};
export const assessmentPackage={instrumentId:'asq14' as const,version:assessmentVersion,instructions:null as string|null,recallPeriod:null as string|null,responseLabels:null as readonly string[]|null,slots:assessmentSlots,estimatedMinutes:[3,5] as const,durationNote:'Estimación de diseño; pendiente de comprobar en un piloto.',scoringSource:'https://www.psicothema.com/pdf/4601.pdf',scoringPage:263};

export function calculateRawScore(protocol:ScoreProtocol,responses:Record<string,number|null>){
 if(!protocol.itemIds.length||new Set(protocol.itemIds).size!==protocol.itemIds.length||!Number.isInteger(protocol.min)||!Number.isInteger(protocol.max)||protocol.min>=protocol.max||!['sum','mean'].includes(protocol.method)||new Set(protocol.reverse).size!==protocol.reverse.length||protocol.reverse.some(id=>!protocol.itemIds.includes(id)))throw new Error('Protocolo de corrección inválido.');
 if(Object.keys(responses).some(id=>!protocol.itemIds.includes(id)))throw new Error('La respuesta no pertenece a esta versión.');
 const values=protocol.itemIds.map(id=>{
  if(!Object.prototype.hasOwnProperty.call(responses,id))throw new Error('Faltan respuestas. No se calcula ni imputa una puntuación.');
  const value=responses[id];
  if(value===null||value===undefined)throw new Error('Faltan respuestas. No se calcula ni imputa una puntuación.');
  if(!Number.isInteger(value)||value<protocol.min||value>protocol.max)throw new Error('Respuesta fuera de la escala.');
  return protocol.reverse.includes(id)?protocol.min+protocol.max-value:value;
 });
 const sum=values.reduce((a,b)=>a+b,0);
 return protocol.method==='mean'?sum/values.length:sum;
}
export function assessmentAvailability(){
 const status=administrationStatus('asq14');
 const contentReady=!!assessmentPackage.instructions?.trim()&&!!assessmentPackage.recallPeriod?.trim()&&assessmentPackage.responseLabels?.length===5&&assessmentPackage.responseLabels.every(label=>label.trim())&&assessmentSlots.every(s=>typeof s.text==='string'&&String(s.text).trim().length>0);
 return {available:status.available&&contentReady,reason:status.available&&!contentReady?'Pendiente: versión íntegra de los ítems e instrucciones.':status.reason};
}
export function requireAssessment(){const status=assessmentAvailability();if(!status.available)throw new Error('Evaluación no habilitada. '+status.reason);}

const responsesSchema=z.record(z.number().int().min(1).max(5).nullable()).superRefine((r,ctx)=>{if(Object.keys(r).some(id=>!assessmentItemIds.includes(id)))ctx.addIssue({code:z.ZodIssueCode.custom,message:'Ítem desconocido.'});});
export const assessmentDraftSchema=z.object({kind:z.literal('psychometric'),instrumentId:z.literal('asq14'),version:z.literal(assessmentVersion),startedAt:z.string().datetime(),updatedAt:z.string().datetime(),cursor:z.number().int().min(0).max(13),responses:responsesSchema});
export type AssessmentDraft=z.infer<typeof assessmentDraftSchema>;
export function createAssessmentDraft(at:string):AssessmentDraft{
 return assessmentDraftSchema.parse({kind:'psychometric',instrumentId:'asq14',version:assessmentVersion,startedAt:at,updatedAt:at,cursor:0,responses:Object.fromEntries(assessmentItemIds.map(id=>[id,null]))});
}
export function assessmentProgress(draft:AssessmentDraft){
 const d=assessmentDraftSchema.parse(draft),answered=assessmentItemIds.filter(id=>d.responses[id]!==null&&d.responses[id]!==undefined).length;
 return {answered,total:14,percent:answered/14*100,canFinish:answered===14};
}
export function answerAssessment(draft:AssessmentDraft,id:string,value:number,at:string){
 const next=assessmentDraftSchema.parse({...draft,updatedAt:at,responses:{...draft.responses,[id]:value}});
 return next;
}
export function moveAssessment(draft:AssessmentDraft,delta:number){
 if(!Number.isInteger(delta))throw new Error('Movimiento inválido.');
 return assessmentDraftSchema.parse({...draft,cursor:Math.min(13,Math.max(0,draft.cursor+delta))});
}
export const assessmentResultSchema=z.object({kind:z.literal('psychometric'),instrumentId:z.literal('asq14'),version:z.literal(assessmentVersion),completedAt:z.string().datetime(),responses:responsesSchema,rawTotal:z.number().int().min(14).max(70),dimension:z.literal('cumulative-stressors')}).superRefine((r,ctx)=>{
 if(!assessmentAvailability().available){ctx.addIssue({code:z.ZodIssueCode.custom,message:'No se admiten resultados de un instrumento no habilitado.'});return;}
 try{if(calculateRawScore(asq14Protocol,r.responses)!==r.rawTotal)ctx.addIssue({code:z.ZodIssueCode.custom,message:'Resultado de corrección inconsistente.'});}catch{ctx.addIssue({code:z.ZodIssueCode.custom,message:'Respuestas incompletas o inválidas.'});}
});
export type AssessmentResult=z.infer<typeof assessmentResultSchema>;
// This is also the boundary for a later encryption adapter. It remains local,
// plain JSON in the existing IndexedDB record; no cloud/API/AI transport exists.
export const assessmentStateSchema=z.object({version:z.literal(1),draft:assessmentDraftSchema.nullable(),results:z.array(assessmentResultSchema).max(50)});
export const emptyAssessmentState=()=>({version:1 as const,draft:null,results:[]});
