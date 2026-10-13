import { normalizeAnswers } from './recommendations.mjs';
export const STORAGE_KEY = 'software-factory.reader.v1';
const chapterId = id => /^ch(0[1-9]|1\d|20)$/.test(id);
/** @typedef {{status:'read'|'reading',revision:string,anchor:string,offset:number}} ChapterProgress */
/** @typedef {{version:number,enabled:boolean,chapters:Record<string,ChapterProgress>,last:string|null,answers:import('./recommendations.mjs').Answers|null,fontSize:string}} ReaderState */
/** @returns {ReaderState} */
const empty = () => ({version:1,enabled:true,chapters:{},last:null,answers:null,fontSize:'normal'});
function sanitize(value) {
 const state=empty();
 if(!value || value.version!==1) return state;
 state.enabled=value.enabled!==false;
 state.fontSize=['normal','large','larger'].includes(value.fontSize)?value.fontSize:'normal';
 if(!state.enabled) return state;
 state.answers=value.answers?normalizeAnswers(value.answers):null;
 for(const [id,item] of Object.entries(value.chapters||{})) {
  if(!chapterId(id)||!item||!['reading','read'].includes(item.status)) continue;
  state.chapters[id]={status:item.status,revision:typeof item.revision==='string'?item.revision.slice(0,32):'',anchor:/^s\d{2,}$/.test(item.anchor)?item.anchor:'',offset:Number.isFinite(item.offset)?Math.max(0,Math.min(1,item.offset)):0};
 }
 if(chapterId(value.last) && state.chapters[value.last]) state.last=value.last;
 return state;
}
export function readStatus(state,id,revision) {
 const item=state.chapters[id];
 if(!item) return 'unread';
 if(item.status==='read' && item.revision!==revision) return 'updated';
 return item.status;
}
export function createProgressStore(getStorage) {
 let current=empty(),available=true,unsaved=false;
 function read() {
  if(unsaved) return {state:structuredClone(current),available:false};
  try {const raw=getStorage().getItem(STORAGE_KEY);current=raw?sanitize(JSON.parse(raw)):empty();available=true;}
  catch {available=false;}
  return {state:structuredClone(current),available};
 }
 function update(change,force=false) {
  read();if(!current.enabled&&!force) return read();
  change(current);
  try {getStorage().setItem(STORAGE_KEY,JSON.stringify(current));available=true;unsaved=false;} catch {available=false;unsaved=true;}
  return {state:structuredClone(current),available};
 }
 return {
  read,
  visit(id,revision,anchor='',offset=0) {
   if(!chapterId(id)) return read();
   return update(s=>{const old=s.chapters[id];s.chapters[id]={status:old?.status??'reading',revision:old?.status==='read'?old.revision:revision,anchor:anchor===''||/^s\d{2,}$/.test(anchor)?anchor:old?.anchor??'',offset:Math.max(0,Math.min(1,Number(offset)||0))};s.last=id;});
  },
  mark(id,revision,done) {
   if(!chapterId(id)) return read();
   return update(s=>{s.chapters[id]={...s.chapters[id],status:done?'read':'reading',revision,anchor:s.chapters[id]?.anchor??'',offset:s.chapters[id]?.offset??0};s.last=id;});
  },
  setAnswers(answers){return update(s=>{s.answers=normalizeAnswers(answers);});},
  clearAnswers(){return update(s=>{s.answers=null;});},
  setFontSize(size){return update(s=>{s.fontSize=['normal','large','larger'].includes(size)?size:'normal';});},
  setEnabled(enabled){return update(s=>Object.assign(s,enabled?{enabled:true}:{...empty(),enabled:false}),true);},
  reset(){return update(s=>{const enabled=s.enabled;Object.assign(s,empty(),{enabled});},true);}
 };
}
