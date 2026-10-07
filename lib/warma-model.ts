import {z} from 'zod';
export const wellbeingSchema=z.object({
 pauses:z.array(z.object({id:z.string(),kind:z.enum(['breathing','body','rest','water']),seconds:z.number().min(0).max(3600),createdAt:z.string()})).max(20000).default([]),
 checkins:z.array(z.object({id:z.string(),load:z.enum(['ligera','media','alta']),energy:z.enum(['baja','media','alta']),createdAt:z.string()})).max(20000).default([]),
 reminders:z.object({enabled:z.boolean().default(false),water:z.boolean().default(true),stretch:z.boolean().default(true),journal:z.boolean().default(false),interval:z.number().min(15).max(120).default(45),lastAt:z.number().default(0)}).default({enabled:false,water:true,stretch:true,journal:false,interval:45,lastAt:0}),
 art:z.array(z.object({id:z.string(),title:z.string().max(120),seed:z.number(),palette:z.enum(['lagoon','ember','dusk']),createdAt:z.string()})).max(1000).default([])
});
export const emptyWellbeing=()=>wellbeingSchema.parse({});
export type Wellbeing=z.infer<typeof wellbeingSchema>;
export function knotPoint(t:number,tension:number):[number,number,number]{const r=1.28+(.27+tension*.23)*Math.cos(3*t);return [r*Math.cos(2*t),r*Math.sin(2*t),(.32+tension*.34)*Math.sin(3*t)];}
export const mirrorRoutes={
 overload:{label:'Tengo demasiadas cosas',questions:['¿Qué situación concreta quieres ordenar? Puedes escribir sin nombres ni detalles privados.','¿Qué depende de ti hoy y qué requeriría ayuda o más tiempo?','Si eligieras un solo paso pequeño, ¿cuál sería?','¿Qué podrías ajustar si ese paso resulta demasiado grande?']},
 exam:{label:'Me preocupa una evaluación',questions:['¿Qué parte de la evaluación te preocupa: el contenido, el tiempo o el resultado?','¿Qué conoces ya y qué te falta comprobar con una práctica?','¿Qué acción breve y realista te ayudaría a prepararte?','¿A quién podrías pedir una explicación si sigues atascado?']},
 mistake:{label:'Algo no salió como esperaba',questions:['¿Qué ocurrió, descrito como un hecho y sin juzgarte?','¿Qué aprendiste de la estrategia que utilizaste?','¿Qué cambiarías en tu próximo intento?','¿Qué apoyo o recurso te ayudaría a probar ese cambio?']}
};
export function needsHumanSupport(text:string){const t=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return /suicid|matarme|hacerme dano|autoles|no quiero vivir|no puedo seguir|me amenaza|me golpe|abuso|no estoy a salvo|peligro inmediato/.test(t);}
