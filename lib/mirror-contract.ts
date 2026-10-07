import {z} from 'zod';
import {mirrorRoutes,needsHumanSupport} from './warma-model';

export const mirrorStages=['Escuchar','Clarificar','Preguntar','Priorizar','Próximo paso'] as const;
export const MIRROR_CONSENT_VERSION='warma-mirror-transmission-1';
export const mirrorRequestSchema=z.object({
 stage:z.number().int().min(0).max(4),text:z.string().trim().min(1).max(1500),question:z.string().max(260).nullable(),
 consent:z.object({version:z.literal(MIRROR_CONSENT_VERSION),accepted:z.literal(true),provider:z.enum(['openai','anthropic'])}).strict(),
}).strict();
export type MirrorRequest=z.infer<typeof mirrorRequestSchema>;
export const reflectionSchema=z.object({acknowledgement:z.string().trim().min(1).max(220),question:z.string().trim().min(1).max(260),nextStep:z.string().trim().max(260)}).strict();
export const mirrorReplySchema=z.object({mode:z.enum(['remote','local','human-support']),reflection:reflectionSchema,provider:z.enum(['openai','anthropic']).nullable(),reason:z.enum(['generated','unavailable','rate-limited','provider-failed','support','canceled']).nullable()}).strict();
export type MirrorReply=z.infer<typeof mirrorReplySchema>;
export const mirrorStatusSchema=z.object({available:z.boolean(),provider:z.enum(['openai','anthropic']).nullable(),providerLabel:z.string().max(80),policyURL:z.string().url().nullable(),reason:z.enum(['ready','not-configured'])}).strict();
export type MirrorStatus=z.infer<typeof mirrorStatusSchema>;
export function localMirrorReply(stage:number,reason:MirrorReply['reason']='unavailable'):MirrorReply{
 const questions=[mirrorRoutes.overload.questions[0],mirrorRoutes.overload.questions[1],mirrorRoutes.mistake.questions[1],mirrorRoutes.overload.questions[2],mirrorRoutes.overload.questions[3]];
 return {mode:'local',provider:null,reason,reflection:{acknowledgement:'Podemos seguir con una pregunta de la guía local.',question:questions[Math.max(0,Math.min(4,stage))],nextStep:stage===4?'Elige un paso pequeño y cómodo. Puedes cambiarlo o pedir apoyo.':''}};
}
export function humanSupportReply():MirrorReply{return {mode:'human-support',provider:null,reason:'support',reflection:{acknowledgement:'No tienes que afrontarlo a solas.',question:'¿Puedes acercarte ahora a una persona de confianza?',nextStep:'Si no estás a salvo, busca a un adulto cercano o a un servicio de emergencia local.'}};}
export function requiresHumanSupport(text:string){return needsHumanSupport(text);}
export function acceptableReflection(value:unknown){
 const result=reflectionSchema.safeParse(value);if(!result.success)return null;
 const text=Object.values(result.data).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 // A secondary heuristic, not a validated classifier or emergency triage.
 if(/(?:tienes|padeces|sufres)\s+(?:de\s+)?(?:depresion|un trastorno|ansiedad clinica|estres severo)|(?:toma|debes tomar)\s+\d+\s*mg|diagnostico\s*[:=]|deja (?:tu )?medicacion|(?:como|pasos para)\s+(?:suicidarte|hacerte dano)/.test(text))return null;
 return result.data;
}
