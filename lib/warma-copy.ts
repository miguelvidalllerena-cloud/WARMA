/** Spanish agreement for visible counts; stored identifiers stay unchanged. */
export const plural=(count:number,singular:string,pluralForm:string)=>count===1?singular:pluralForm;
export const counted=(count:number,singular:string,pluralForm:string)=>`${count} ${plural(count,singular,pluralForm)}`;
export const qualityName=(label:string)=>label.replace(/\bEssential\b/g,'Esencial').replace(/\bBalanced\b/g,'Equilibrada').replace(/\bImmersive\b/g,'Inmersiva');
