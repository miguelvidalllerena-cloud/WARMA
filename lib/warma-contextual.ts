import {z} from 'zod';

export const contextualModule={
 kind:'contextual' as const,name:'Módulo Contextual WARMA',version:'pending',
 intendedLabel:'Preguntas contextuales revisadas por el profesional de psicología institucional.',
 validationPlan:['Juicio de expertos: claridad, pertinencia y relevancia','V de Aiken con número de jueces e intervalos documentados','Piloto local y revisión de comprensión','Consistencia y estructura factorial cuando exista muestra y protocolo suficientes'],
 review:null,questions:[] as readonly {id:string;text:string}[],
 status:'Falta el formulario exacto y la constancia de revisión institucional. No se administran preguntas de los borradores como si estuvieran aprobadas.',
 limitation:'Una revisión profesional no convierte preguntas contextuales en un instrumento psicométrico validado.'
};
export const contextualDraftSchema=z.object({kind:z.literal('contextual'),version:z.string().max(100),answers:z.record(z.string().max(3000)),updatedAt:z.string().datetime()}).superRefine((d,ctx)=>{
 if(contextualModule.review===null||d.version!==contextualModule.version||Object.keys(d.answers).some(id=>!contextualModule.questions.some(q=>q.id===id)))ctx.addIssue({code:z.ZodIssueCode.custom,message:'Versión contextual sin revisión documentada.'});
});
