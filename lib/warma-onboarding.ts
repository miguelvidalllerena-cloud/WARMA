import {z} from 'zod';

export const functionalPreferencesSchema=z.object({
 load:z.enum(['ligera','media','alta']).nullable(),
 energy:z.enum(['baja','media','alta']).nullable(),
 goal:z.enum(['estudiar','organizarme','reflexionar','descansar','crear']).nullable()
});
export type FunctionalPreferences=z.infer<typeof functionalPreferencesSchema>;
export const onboardingSchema=z.object({
 version:z.literal(1),kind:z.literal('preferences'),completedAt:z.string().datetime(),
 privacyVersion:z.literal('2026-10-04'),preferences:functionalPreferencesSchema
});
export type OnboardingRecord=z.infer<typeof onboardingSchema>;
export const emptyFunctionalPreferences=():FunctionalPreferences=>({load:null,energy:null,goal:null});
export const onboardingDraftSchema=z.object({
 version:z.literal(2),stage:z.number().int().min(2).max(3),question:z.number().int().min(0).max(2),
 privacyVersion:z.literal('2026-10-04'),preferences:functionalPreferencesSchema,updatedAt:z.string().datetime()
});
export type OnboardingDraft=z.infer<typeof onboardingDraftSchema>;
export function draftForLater(stage:number,question:number,preferences:FunctionalPreferences,at:string){
 return onboardingDraftSchema.parse({version:2,stage:stage===3?3:2,question,privacyVersion:'2026-10-04',preferences,updatedAt:at});
}
export function preferenceContext(d:{onboarding:OnboardingRecord|null;checkin:{date:string;load:FunctionalPreferences['load'];energy:FunctionalPreferences['energy'];goal:FunctionalPreferences['goal']}|null},day=new Date().toLocaleDateString('en-CA')){
 if(d.checkin?.date===day)return {preferences:functionalPreferencesSchema.parse(d.checkin),source:'Tu check-in de hoy'};
 if(d.onboarding)return {preferences:d.onboarding.preferences,source:'Tus preferencias de primer ingreso'};
 return {preferences:emptyFunctionalPreferences(),source:'Sin preferencias registradas'};
}

// Preferences, never a psychological score. Every branch states its input.
export function functionalProfile(input:FunctionalPreferences,hour=new Date().getHours()){
 const p=functionalPreferencesSchema.parse(input);
 if(p.goal==='descansar')return {region:'body' as const,minutes:1,title:'Un poco de aire',reason:'Elegiste descansar. Hay una pausa de un minuto disponible; puedes salir cuando quieras.'};
 if(p.goal==='reflexionar')return {region:'journal' as const,minutes:5,title:'Ponerlo en palabras',reason:'Elegiste reflexionar. Te proponemos la Bitácora; los cinco minutos son una referencia, no un límite.'};
 if(p.goal==='crear')return {region:'art' as const,minutes:5,title:'Dar forma a este momento',reason:'Elegiste crear. Puedes explorar una composición local a tu ritmo.'};
 if(p.goal==='estudiar'){
  const minutes=p.energy==='baja'||p.load==='alta'||hour>=22?5:p.energy==='alta'?25:15;
  const reason=p.energy==='baja'?'Indicaste energía baja.':p.load==='alta'?'Indicaste carga alta.':hour>=22?'Es tarde según la hora de tu dispositivo.':p.energy==='alta'?'Indicaste energía alta.':'Elegiste estudiar y no indicaste que prefieras una sesión más breve.';
  return {region:'focus' as const,minutes,title:`Un espacio de ${minutes} minutos`,reason:`${reason} La propuesta es ${minutes} minutos de concentración. Puedes ajustar la duración antes de empezar.`};
 }
 return {region:'path' as const,minutes:10,title:'Una cosa a la vez',reason:p.goal==='organizarme'?'Elegiste organizarte. Puedes crear una microacción de diez minutos en Camino.':'No elegiste una prioridad. Camino es un punto de entrada que puedes cambiar; no inferimos cómo te sientes.'};
}

export function shouldOfferOnboarding(d:{onboarding?:unknown;onboardingDraft?:unknown;checkin:unknown;timer:unknown;missions:unknown[];projects:unknown[];journal:unknown[];subjects:unknown[];knowledge:unknown[];dreams:unknown[];games:unknown[];sessions:unknown[];events:unknown[];wellbeing:{pauses:unknown[];checkins:unknown[];art:unknown[]};journalDraft:{title:string;body:string;tags:string}}){
 return !d.onboarding&&!d.checkin&&!d.timer&&[d.missions,d.projects,d.journal,d.subjects,d.knowledge,d.dreams,d.games,d.sessions,d.events,d.wellbeing.pauses,d.wellbeing.checkins,d.wellbeing.art].every(a=>a.length===0)&&!d.journalDraft.title&&!d.journalDraft.body&&!d.journalDraft.tags;
}
