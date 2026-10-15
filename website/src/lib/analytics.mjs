export const CONSENT_KEY='software-factory.analytics.v1';
export const CONSENT_TTL=180*24*60*60*1000;
export function safePageUrl(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)?u.origin+u.pathname:'';}catch{return '';}}
export function safeEvent(name,data={}){
 if(!data||typeof data!=='object'||Array.isArray(data))return null;
 if(name==='guide_complete'&&Number.isInteger(data.chapter_count)&&data.chapter_count>=1&&data.chapter_count<=20)return {chapter_count:data.chapter_count};
 if(['chapter_mark_read','recommendation_open'].includes(name)&&typeof data.chapter_id==='string'&&/^ch(0[1-9]|1[0-9]|20)$/.test(data.chapter_id))return {chapter_id:data.chapter_id};
 return null;
}
/** @param {{measurementId:string,hostname:string,siteHostname:string,getStorage:()=>Storage|any,getBackupStorage?:()=>Storage|any,now?:()=>number,enable:()=>void,disable:()=>void,send:(name:string,data:Record<string,unknown>)=>void}} options */
export function createAnalytics({measurementId,hostname,siteHostname,getStorage,getBackupStorage=()=>null,now=Date.now,enable,disable,send}){
 const configured=/^G-[A-Z0-9]{6,}$/.test(measurementId)&&hostname===siteHostname;
 let active=false,memory=null;
 const writableGrants=new WeakSet();
 function valid(item){return item?.version===1&&['granted','denied'].includes(item.choice)&&Number.isFinite(item.updatedAt)&&item.updatedAt<=now()&&now()-item.updatedAt<CONSENT_TTL;}
 function choice(){
  const records=valid(memory)?[memory]:[];
  for(const get of [getStorage,getBackupStorage]){try{const store=get(),raw=store?.getItem(CONSENT_KEY)??'null',item=JSON.parse(raw);if(!valid(item))continue;if(item.choice==='granted'&&!writableGrants.has(store)){store.setItem(CONSENT_KEY+'.probe','1');store.removeItem?.(CONSENT_KEY+'.probe');writableGrants.add(store);}records.push(item);}catch{/* fail closed when a restored grant cannot be updated or withdrawn */}}
  records.sort((a,b)=>b.updatedAt-a.updatedAt||(a.choice==='denied'?-1:1));
  return records[0]?.choice??null;
 }
 function sync(resetMemory=false){
  if(resetMemory)memory=null;
  const current=choice(),allowed=configured&&current==='granted';
  if(allowed&&!active){active=true;enable();}
  else if(!allowed&&active){active=false;disable();}
  return {configured,choice:current,active};
 }
 return {sync,choose(value){
  if(!['granted','denied'].includes(value))return sync();
  const item={version:1,choice:value,updatedAt:now()};memory=null;
  for(const get of [getStorage,getBackupStorage]){
   let store;try{store=get();if(!store)continue;store.setItem(CONSENT_KEY,JSON.stringify(item));}
   catch{memory=item;if(value==='denied'){try{store?.removeItem(CONSENT_KEY);}catch{/* backup refusal remains authoritative */}}}
  }
  return sync();
 },track(name,data){
  if(!sync().active)return false;
  const payload=safeEvent(name,data);if(!payload)return false;
  send(name,payload);return true;
 }};
}
