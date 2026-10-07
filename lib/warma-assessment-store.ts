'use client';
import {mutateWorld} from './itaca-store';
import {requireAssessment,createAssessmentDraft,answerAssessment,moveAssessment,assessmentProgress,asq14Protocol,calculateRawScore,assessmentResultSchema} from './warma-psychometrics';

export async function beginAssessment(){requireAssessment();await mutateWorld(d=>{if(!d.assessment.draft)d.assessment.draft=createAssessmentDraft(new Date().toISOString());});}
export async function saveAssessmentAnswer(id:string,value:number){requireAssessment();await mutateWorld(d=>{if(!d.assessment.draft)throw new Error('No hay evaluación en curso.');d.assessment.draft=answerAssessment(d.assessment.draft,id,value,new Date().toISOString());});}
export async function navigateAssessment(delta:number){requireAssessment();await mutateWorld(d=>{if(!d.assessment.draft)throw new Error('No hay evaluación en curso.');d.assessment.draft=moveAssessment(d.assessment.draft,delta);});}
export async function finishAssessment(){requireAssessment();await mutateWorld(d=>{
 const draft=d.assessment.draft;if(!draft||!assessmentProgress(draft).canFinish)throw new Error('Completa todas las respuestas antes de calcular.');
 const result=assessmentResultSchema.parse({kind:'psychometric',instrumentId:'asq14',version:draft.version,completedAt:new Date().toISOString(),responses:draft.responses,rawTotal:calculateRawScore(asq14Protocol,draft.responses),dimension:'cumulative-stressors'});
 d.assessment.results.push(result);d.assessment.draft=null;
});}
export async function discardAssessmentDraft(){await mutateWorld(d=>{d.assessment.draft=null;});}
