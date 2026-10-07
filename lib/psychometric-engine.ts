/** Arithmetic only. Item wording, permission and clinical interpretation live elsewhere. */
export type InstrumentLegalStatus='AUTHORIZED'|'PENDING_PERMISSION'|'RESEARCH_ONLY'|'DISABLED';
export type ItemResponse=number|null|readonly number[];
export type InstrumentResponses=Record<string,ItemResponse>;
export type ScoringProtocol={
 itemIds:readonly string[];min:number;max:number;reverse:readonly string[];
 method:'sum'|'mean';maxMissing:number;prorateMissing:boolean;
 multipleAnswers:'missing';
};
export type ScoringOutcome={status:'SCORED'|'INSUFFICIENT_DATA';total:number|null;answered:number;missingIds:string[];prorated:boolean};

export function scoreInstrument(protocol:ScoringProtocol,responses:InstrumentResponses):ScoringOutcome{
 const {itemIds,min,max,reverse,maxMissing}=protocol;
 if(!itemIds.length||new Set(itemIds).size!==itemIds.length||!Number.isInteger(min)||!Number.isInteger(max)||min>=max||!Number.isInteger(maxMissing)||maxMissing<0||maxMissing>=itemIds.length||new Set(reverse).size!==reverse.length||reverse.some(id=>!itemIds.includes(id))||!['sum','mean'].includes(protocol.method)||protocol.multipleAnswers!=='missing'||typeof protocol.prorateMissing!=='boolean')throw new Error('Protocolo psicométrico inválido.');
 if(!responses||typeof responses!=='object'||Array.isArray(responses)||Object.keys(responses).some(id=>!itemIds.includes(id)))throw new Error('Respuestas ajenas a esta versión.');
 const missingIds:string[]=[];let sum=0;
 for(const id of itemIds){
  let value:ItemResponse=Object.prototype.hasOwnProperty.call(responses,id)?responses[id]:null;
  if(Array.isArray(value)){
   if(value.length>5||value.some(v=>!Number.isInteger(v)||v<min||v>max))throw new Error('Respuesta múltiple fuera de la escala.');
   // One mark is one answer; zero or multiple marks are missing, even duplicates.
   value=value.length===1?value[0]:null;
  }
  if(value===null){missingIds.push(id);continue;}
  if(typeof value!=='number'||!Number.isInteger(value)||value<min||value>max)throw new Error('Respuesta fuera de la escala.');
  sum+=reverse.includes(id)?min+max-value:value;
 }
 const answered=itemIds.length-missingIds.length;
 if(missingIds.length>maxMissing)return {status:'INSUFFICIENT_DATA',total:null,answered,missingIds,prorated:false};
 const prorated=missingIds.length>0&&protocol.prorateMissing;
 // Correct observed reverse items first, then average observed scores, then × N.
 const total=protocol.method==='mean'?sum/answered:prorated?sum/answered*itemIds.length:sum;
 return {status:'SCORED',total,answered,missingIds,prorated};
}

export type InstrumentPermission={
 status:InstrumentLegalStatus;accessObtained:boolean;administrationGranted:boolean;
 publicRedistributionGranted:boolean;agreementReference:string|null;
};
export function canAdminister(permission:InstrumentPermission,delivery:'public-bundle'|'controlled',contentReady:boolean,populationReviewed:boolean){
 const missing=[permission.status!=='AUTHORIZED'&&'autorización documentada',!permission.administrationGranted&&'permiso de administración electrónica',!permission.agreementReference?.trim()&&'acuerdo verificable',delivery==='public-bundle'&&!permission.publicRedistributionGranted&&'permiso de redistribución pública',!contentReady&&'paquete íntegro autorizado',!populationReviewed&&'protocolo institucional para la población'].filter(Boolean);
 return {available:missing.length===0,reason:missing.length?'Pendiente: '+missing.join(', ')+'.':'Requisitos documentados.'};
}
