'use client';
import type {WorldState} from '@/lib/itaca-store';
import {recommendation} from '@/lib/itaca-store';
import {preferenceContext} from '@/lib/warma-onboarding';

export default function PersonalizationNote({data,place}:{data:WorldState;place:'home'|'path'|'focus'|'body'|'mirror'|'garden'}){
 const {preferences:p,source}=preferenceContext(data);
 if(!p.load&&!p.energy&&!p.goal)return null;
 const rec=recommendation(data);
 const messages={
  home:rec.title,
  path:p.load==='alta'||p.energy==='baja'?'Puedes empezar con una sola microacción y dejar espacio para una pausa.':p.goal==='descansar'?'También puedes empezar tu camino con una pausa.':'Tu camino conserva la prioridad que elegiste; puedes cambiar de dirección.',
  focus:rec.region==='focus'?`Propuesta: ${rec.minutes} minutos. Confirma o cambia la duración antes de comenzar.`:'Elige una duración que te resulte cómoda. Puedes concentrarte aunque tu prioridad inicial sea otra.',
  body:p.goal==='descansar'?'Elegiste descansar. La guía de un minuto está disponible, con salida libre.':'Puedes hacer una pausa aunque tu prioridad sea otra.',
  mirror:p.goal==='reflexionar'?'Elegiste escribir. Aquí puedes explorar una ruta a tu ritmo.':p.goal==='organizarme'?'Elegiste organizarte. Puedes usar las preguntas para delimitar un siguiente paso.':'Elige la ruta que te resulte útil. Tus preferencias no interpretan el contenido de tu reflexión.',
  garden:p.goal==='descansar'?'Las pausas que decidas registrar dejarán una huella en tu jardín.':p.goal==='estudiar'?'Tus sesiones de concentración dejarán una huella en tu jardín.':'Tu jardín crecerá con las acciones y las pausas que registres.'
 };
 return <aside className="personalization-note" aria-label="Orientación según mis preferencias"><span className="eyebrow">{source}</span><p>{messages[place]}</p><details className="recommendation-explanation"><summary>¿Por qué WARMA me recomienda esto?</summary><p>{rec.reason}</p><p>Las elecciones del día tienen prioridad sobre la bienvenida. Las preferencias no son resultados psicométricos. Puedes cambiarlas desde Inicio.</p>{place==='garden'&&<p>El jardín refleja acciones y pausas reales. La evaluación y las palabras privadas no otorgan puntos, plantas ni cristales.</p>}</details></aside>;
}
