import {FEATURE_FLAGS} from './feature-flags';
import {z} from 'zod';
import {canAdminister,scoreInstrument,type InstrumentPermission,type InstrumentResponses,type ScoringProtocol} from './psychometric-engine';

export const pss10Version='PSS-10_AU2.0_spa-ES_10OCT2024' as const;
export const pss10ScoringVersion='2.0-2023-03' as const;
export const pss10ItemIds=Array.from({length:10},(_,i)=>`pss10-${String(i+1).padStart(2,'0')}`);
export const pss10Disclaimer='Esta evaluación estima estrés percibido dentro de los límites de la escala. No constituye un diagnóstico psicológico.';
export const pss10KnotDisclaimer='El nudo es una representación visual de tus registros y no una medición clínica.';
export const pss10Permission:InstrumentPermission=Object.freeze({status:'PENDING_PERMISSION',accessObtained:true,administrationGranted:false,publicRedistributionGranted:false,agreementReference:null});
export const pss10Protocol:ScoringProtocol=Object.freeze({itemIds:pss10ItemIds,min:0,max:4,reverse:[pss10ItemIds[3],pss10ItemIds[4],pss10ItemIds[6],pss10ItemIds[7]],method:'sum',maxMissing:2,prorateMissing:true,multipleAnswers:'missing'});
export const pss10Metadata={
 id:'pss10',name:'PSS-10 — Escala de Estrés Percibido',authors:'Sheldon Cohen y Gail M. Williamson',year:1988,
 construct:'Estrés percibido global; no exclusivamente académico.',dimension:'perceived-stress',itemCount:10,
 language:'Spanish for Spain (es-ES)',version:pss10Version,versionDate:'2024-10-10',
 population:'No se ha documentado validación de este paquete exacto en adolescentes peruanos ni baremos COAR.',supportedAgeRange:null,
 recallPeriod:'Últimos 30 días',responseRange:[0,4] as const,scoreRange:[0,40] as const,
 scoringVersion:pss10ScoringVersion,distributor:'Mapi Research Trust / ePROVIDE',
 copyright:'© Copyright RST Assessments, LLC. Todos los derechos reservados (2022).',
 scoringCopyright:'© 2023 Mapi Research Trust. Todos los derechos reservados.',
 reference:'Cohen S, Williamson GM (1988). Perceived stress in a probability sample of the United States. En: Spacapan S, Oskamp S, eds. The Social Psychology of Health. pp. 31–67.',
 source:'https://www.cmu.edu/dietrich/psychology/stress-immunity-disease-lab/scales/index.html',
 sourceFiles:{questionnaireSha256:'20ddd425c10fb25825d0a2db471f3a59862b3dfd6d271cadfe3382929154931c',scoringSha256:'fe2d798f7463eb753ba9a4cfe54d883a3f949799fea50661b57bae2145c2c218'},
 durationNote:'2–4 minutos: estimación de diseño pendiente de piloto, no una duración acreditada por el paquete.',
 limitations:'Sin diagnóstico ni puntos de corte universales. Spanish for Spain no equivale a validación local peruana. No se extrapolan coeficientes de otra versión o población.'
} as const;
export const pss10Slots=pss10ItemIds.map((id,i)=>({id,number:i+1,text:null,placeholder:`Ítem ${String(i+1).padStart(2,'0')} · contenido protegido pendiente de autorización`}));

/** Controlled delivery seam. Never put official items in public source, logs or SW cache. */
export type ProtectedInstrumentContent={version:typeof pss10Version;instructions:string;responseLabels:readonly string[];items:readonly {id:string;text:string}[]};
export interface ProtectedInstrumentContentProvider {loadAuthorizedContent():Promise<ProtectedInstrumentContent>;}
// No provider or protected content is configured. Possession of a DOCX is not a grant.
export const protectedPss10ContentSchema=z.object({version:z.literal(pss10Version),instructions:z.string().trim().min(1).max(30000),responseLabels:z.array(z.string().trim().min(1).max(200)).length(5),items:z.array(z.object({id:z.string(),text:z.string().trim().min(1).max(3000)})).length(10)}).superRefine((content,ctx)=>{if(new Set(content.responseLabels).size!==5||content.items.some((item,i)=>item.id!==pss10ItemIds[i]))ctx.addIssue({code:z.ZodIssueCode.custom,message:'Contenido protegido incompatible con esta versión.'});});
export function protectedPss10ContentReady(content:unknown){return protectedPss10ContentSchema.safeParse(content).success;}
export function pss10Availability(content:ProtectedInstrumentContent|null=null){const authorization=canAdminister(pss10Permission,'controlled',protectedPss10ContentReady(content),false);return authorization.available&&!FEATURE_FLAGS.PSS10_ENABLED?{available:false,reason:'Evaluación desactivada en esta versión.'}:authorization;}
export function requirePss10(){const status=pss10Availability();if(!status.available)throw new Error('PSS-10 no habilitada. '+status.reason);}
export function scorePss10(responses:InstrumentResponses){return scoreInstrument(pss10Protocol,responses);}

const response=z.union([z.number().int().min(0).max(4),z.array(z.number().int().min(0).max(4)).max(5)]).nullable();
export const pss10ResponsesSchema=z.record(response).superRefine((answers,ctx)=>{
 if(Object.keys(answers).some(id=>!pss10ItemIds.includes(id)))ctx.addIssue({code:z.ZodIssueCode.custom,message:'Ítem ajeno a PSS-10.'});
});
export const pss10DraftSchema=z.object({kind:z.literal('psychometric'),instrumentId:z.literal('pss10'),version:z.literal(pss10Version),scoringVersion:z.literal(pss10ScoringVersion),startedAt:z.string().datetime(),updatedAt:z.string().datetime(),cursor:z.number().int().min(0).max(9),responses:pss10ResponsesSchema});
export type Pss10Draft=z.infer<typeof pss10DraftSchema>;
export function createPss10Draft(at:string):Pss10Draft{return pss10DraftSchema.parse({kind:'psychometric',instrumentId:'pss10',version:pss10Version,scoringVersion:pss10ScoringVersion,startedAt:at,updatedAt:at,cursor:0,responses:Object.fromEntries(pss10ItemIds.map(id=>[id,null]))});}
export function pss10Progress(draft:Pss10Draft){const scored=scorePss10(pss10DraftSchema.parse(draft).responses);return {answered:scored.answered,total:10,percent:scored.answered*10,canFinish:scored.status==='SCORED',missingIds:scored.missingIds};}
export function answerPss10(draft:Pss10Draft,id:string,value:z.infer<typeof response>,at:string){return pss10DraftSchema.parse({...draft,updatedAt:at,responses:{...draft.responses,[id]:value}});}
export function movePss10(draft:Pss10Draft,delta:number){if(!Number.isInteger(delta))throw new Error('Movimiento inválido.');return pss10DraftSchema.parse({...draft,cursor:Math.min(9,Math.max(0,draft.cursor+delta))});}

/** Arithmetic validation is reusable in tests; storage adds the permission boundary. */
export const pss10ScoredRecordSchema=z.object({kind:z.literal('psychometric'),instrumentId:z.literal('pss10'),version:z.literal(pss10Version),scoringVersion:z.literal(pss10ScoringVersion),completedAt:z.string().datetime(),responses:pss10ResponsesSchema,rawTotal:z.number().min(0).max(40),answered:z.number().int().min(8).max(10),missingIds:z.array(z.string()).max(2),prorated:z.boolean(),dimension:z.literal('perceived-stress')}).superRefine((record,ctx)=>{
 try{
  const scored=scorePss10(record.responses);
  if(scored.status!=='SCORED'||scored.total!==record.rawTotal||scored.answered!==record.answered||scored.prorated!==record.prorated||JSON.stringify(scored.missingIds)!==JSON.stringify(record.missingIds))ctx.addIssue({code:z.ZodIssueCode.custom,message:'Resultado PSS-10 inconsistente con sus respuestas.'});
 }catch{ctx.addIssue({code:z.ZodIssueCode.custom,message:'Respuestas PSS-10 inválidas.'});}
});
export type Pss10Result=z.infer<typeof pss10ScoredRecordSchema>;
export const pss10ResultSchema=pss10ScoredRecordSchema.superRefine((_record,ctx)=>{
 if(!pss10Availability().available)ctx.addIssue({code:z.ZodIssueCode.custom,message:'No se admiten nuevos resultados PSS-10 sin administración autorizada.'});
});
export const pss10StateSchema=z.object({schema:z.literal(1),draft:pss10DraftSchema.nullable(),results:z.array(pss10ResultSchema).max(50)});
export const emptyPss10State=()=>({schema:1 as const,draft:null,results:[]});
export function pss10History(records:readonly Pss10Result[]){
 const sorted=records.map(r=>pss10ScoredRecordSchema.parse(r)).sort((a,b)=>Date.parse(a.completedAt)-Date.parse(b.completedAt));
 const latest=sorted.at(-1)??null,previous=sorted.at(-2)??null;
 return {records:sorted,latest,previous,delta:latest&&previous?latest.rawTotal-previous.rawTotal:null};
}
