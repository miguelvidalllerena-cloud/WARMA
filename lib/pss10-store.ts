'use client';
import {mutateWorld} from './itaca-store';
import {requirePss10,createPss10Draft,answerPss10,movePss10,scorePss10,pss10ResultSchema,type Pss10Draft} from './pss10-instrument';

export async function beginPss10(){requirePss10();await mutateWorld(d=>{if(!d.pss10.draft)d.pss10.draft=createPss10Draft(new Date().toISOString());});}
export async function savePss10Answer(id:string,value:Pss10Draft['responses'][string]){requirePss10();await mutateWorld(d=>{if(!d.pss10.draft)throw new Error('No hay PSS-10 en curso.');d.pss10.draft=answerPss10(d.pss10.draft,id,value,new Date().toISOString());});}
export async function navigatePss10(delta:number){requirePss10();await mutateWorld(d=>{if(!d.pss10.draft)throw new Error('No hay PSS-10 en curso.');d.pss10.draft=movePss10(d.pss10.draft,delta);});}
export async function finishPss10(){requirePss10();await mutateWorld(d=>{
 const draft=d.pss10.draft;if(!draft)throw new Error('No hay PSS-10 en curso.');
 const scored=scorePss10(draft.responses);if(scored.status!=='SCORED')throw new Error('Se necesitan al menos ocho respuestas válidas. No se genera una puntuación.');
 const result=pss10ResultSchema.parse({kind:'psychometric',instrumentId:'pss10',version:draft.version,scoringVersion:draft.scoringVersion,completedAt:new Date().toISOString(),responses:draft.responses,rawTotal:scored.total,answered:scored.answered,missingIds:scored.missingIds,prorated:scored.prorated,dimension:'perceived-stress'});
 d.pss10.results.push(result);d.pss10.draft=null;
});}
export async function discardPss10Draft(){await mutateWorld(d=>{d.pss10.draft=null;});}
