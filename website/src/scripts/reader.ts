import book from '../data/book.json';
import {progress,changed,labels} from '../lib/reader-store';
import {readStatus,STORAGE_KEY} from '../lib/progress.mjs';
import {recommend} from '../lib/recommendations.mjs';
const all=<T extends Element=HTMLElement>(s:string)=>[...document.querySelectorAll<T>(s)];
const tools=document.querySelector<HTMLElement>('[data-reader-id]');
const id=tools?.dataset.readerId,revision=tools?.dataset.readerRevision??'1';
const initial=progress.read().state;
const previous=id?initial.chapters[id]:null;
let suppressPosition=false;
function resumeURL(chapterId:string){const chapter=book.chapters.find(c=>c.id===chapterId);return chapter?`${chapter.url}?resume=1`:'/contents/';}
function refresh(){
 const {state,available}=progress.read();
 const count=book.chapters.filter(c=>['read','updated'].includes(readStatus(state,c.id,c.revision))).length;
 all('[data-book-progress]').forEach(el=>el.textContent=`20장 중 ${count}장 읽음`);
 all<HTMLProgressElement>('[data-book-progress-bar]').forEach(el=>el.value=count);
 all<HTMLElement>('[data-chapter-status]').forEach(el=>{const c=book.chapters.find(c=>c.id===el.dataset.chapterStatus);if(!c)return;const status=readStatus(state,c.id,c.revision);el.textContent=labels[status];el.dataset.status=status;});
 all<HTMLAnchorElement>('.sidebar a[href]').forEach(el=>{const c=book.chapters.find(c=>c.url===el.getAttribute('href'));if(!c)return;const status=readStatus(state,c.id,c.revision);el.dataset.readStatus=status;el.dataset.readLabel=labels[status];});
 if(id){const status=readStatus(state,id,revision);all('[data-current-status]').forEach(el=>el.textContent=labels[status]);all<HTMLButtonElement>('[data-mark-read]').forEach(el=>{el.textContent=status==='read'?'읽음 표시 해제':status==='updated'?'수정 내용까지 읽음으로 표시':'읽음으로 표시';el.disabled=!state.enabled;});
  const route=state.answers?recommend(state.answers):null;const next=route?.chapters.map(n=>book.chapters[n-1]).find(c=>c.id!==id&&!['read','updated'].includes(readStatus(state,c.id,c.revision)));
  all<HTMLAnchorElement>('[data-route-next]').forEach(el=>{el.hidden=!next;if(next){el.href=next.url;el.textContent=`추천 경로에서 다음: ${next.number}장`;}});
 }
 const last=book.chapters.find(c=>c.id===state.last);
 all('[data-resume-home]').forEach(el=>(el as HTMLElement).hidden=!last);
 all<HTMLAnchorElement>('[data-resume-link]').forEach(el=>{if(last){el.href=resumeURL(last.id);el.textContent=`${last.title} · 이어서 읽기`;}});
 document.documentElement.dataset.readingSize=state.fontSize;
 all<HTMLInputElement>('[data-saving-toggle]').forEach(el=>el.checked=state.enabled);
 all<HTMLSelectElement>('[data-font-size]').forEach(el=>el.value=state.fontSize);
 all('[data-storage-notice]').forEach(el=>el.textContent=!available?'브라우저가 저장을 허용하지 않아 이 페이지에서만 기록을 유지합니다.':!state.enabled?'읽기 기록 저장이 꺼져 있습니다.':'읽던 위치와 읽음 표시는 이 브라우저에 저장됩니다.');
}
function position(){
 const markers=all<HTMLElement>('[data-reading-anchor]'),y=window.scrollY+120;
 let index=-1;for(let i=0;i<markers.length;i++)if(markers[i].getBoundingClientRect().top+window.scrollY<=y)index=i;
 if(index<0)return {anchor:'',offset:0};
 const top=markers[index].getBoundingClientRect().top+window.scrollY;
 const next=markers[index+1]?.getBoundingClientRect().top;
 const end=next===undefined?document.documentElement.scrollHeight:next+window.scrollY;
 return {anchor:markers[index].id,offset:Math.max(0,Math.min(1,(y-top)/Math.max(1,end-top)))};
}
function savePosition(){if(!id||suppressPosition)return;const p=position();progress.visit(id,revision,p.anchor,p.offset);}
function restore(item:any){
 if(!item?.anchor){window.scrollTo(0,0);return;}
 const marker=document.getElementById(item.anchor);if(!marker)return;
 const markers=all<HTMLElement>('[data-reading-anchor]'),index=markers.indexOf(marker),top=marker.getBoundingClientRect().top+window.scrollY;
 const end=markers[index+1]?markers[index+1].getBoundingClientRect().top+window.scrollY:document.documentElement.scrollHeight;
 window.scrollTo({top:Math.max(0,top+(end-top)*item.offset-120),behavior:'instant'});
}
if(id){
 progress.visit(id,revision,previous?.anchor??'',previous?.offset??0);
 all<HTMLButtonElement>('[data-mark-read]').forEach(button=>button.addEventListener('click',()=>{suppressPosition=false;const status=readStatus(progress.read().state,id,revision);progress.mark(id,revision,status!=='read');changed();}));
 const resume=document.querySelector<HTMLAnchorElement>('[data-resume-current]');
 if(previous?.anchor && !location.hash && resume){
  resume.hidden=false;resume.href=resumeURL(id);
  resume.addEventListener('click',event=>{if(event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey)suppressPosition=true;});
 }
 if(new URLSearchParams(location.search).get('resume')==='1'&&!location.hash&&previous){requestAnimationFrame(()=>requestAnimationFrame(()=>restore(previous)));}
 let timer:ReturnType<typeof setTimeout>;
 window.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(savePosition,180);},{passive:true});
 window.addEventListener('pagehide',savePosition);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')savePosition();});
}
all<HTMLInputElement>('[data-saving-toggle]').forEach(el=>el.addEventListener('change',()=>{progress.setEnabled(el.checked);changed();}));
all<HTMLSelectElement>('[data-font-size]').forEach(el=>el.addEventListener('change',()=>{const size=el.value;progress.setFontSize(size);changed();document.documentElement.dataset.readingSize=size;}));
all('[data-reset-request]').forEach(el=>el.addEventListener('click',()=>{const panel=document.querySelector<HTMLElement>('[data-reset-confirm]');if(panel){panel.hidden=false;panel.querySelector<HTMLButtonElement>('button')?.focus();}}));
all('[data-reset-cancel]').forEach(el=>el.addEventListener('click',()=>{document.querySelector<HTMLElement>('[data-reset-confirm]')!.hidden=true;}));
all('[data-reset-confirmed]').forEach(el=>el.addEventListener('click',()=>{suppressPosition=true;progress.reset();document.querySelector<HTMLElement>('[data-reset-confirm]')!.hidden=true;document.querySelector<HTMLElement>('[data-settings-message]')!.textContent='읽기 기록을 지웠습니다.';changed();}));
window.addEventListener('reader:change',refresh);
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY||event.key===null){if(id&&!progress.read().state.chapters[id])suppressPosition=true;refresh();}});
refresh();
