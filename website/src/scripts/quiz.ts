import book from '../data/book.json';
import {progress,changed,labels} from '../lib/reader-store';
import {recommend,purposeLabels,roleLabels,depthLabels,normalizeAnswers} from '../lib/recommendations.mjs';
import {readStatus,STORAGE_KEY} from '../lib/progress.mjs';
const form=document.querySelector<HTMLFormElement>('#reader-quiz')!;
const result=document.querySelector<HTMLElement>('#recommendation-result')!;
const steps=[...form.querySelectorAll<HTMLFieldSetElement>('[data-step]')];let step=0;
let activeAnswers=progress.read().state.answers;
function showStep(index:number){step=index;steps.forEach((el,i)=>el.hidden=i!==step);form.querySelector<HTMLElement>('[data-quiz-position]')!.textContent=`질문 ${step+1} / 3`;form.querySelector<HTMLElement>('[data-quiz-back]')!.hidden=step===0;form.querySelector<HTMLElement>('[data-quiz-next]')!.textContent=step===2?'추천 경로 보기':'다음 질문';form.querySelector<HTMLElement>('[data-quiz-error]')!.textContent='';steps[step].querySelector<HTMLElement>('legend')?.focus();}
function render(answers:any,focus=false){
 const route=recommend(answers),state=progress.read().state;activeAnswers=normalizeAnswers(answers);
 form.hidden=true;result.hidden=false;
 result.querySelector<HTMLElement>('h2')!.textContent=purposeLabels[route.purpose];
 result.querySelector<HTMLElement>('[data-route-description]')!.textContent=`${depthLabels[route.depth]} · ${route.chapters.length}개 장으로 시작합니다. ${route.fullBook?'이 경로 뒤에는 전체 20장을 이어 읽을 수 있습니다.':''}`;
 result.querySelector<HTMLElement>('[data-route-summary]')!.textContent=route.summary;
 result.querySelector<HTMLElement>('[data-role-description]')!.textContent=route.role==='other'?'현재 목적에 맞춰 읽을 순서를 골랐습니다.':route.emphasis.length?`${roleLabels[route.role]}의 관점에서 특히 살펴볼 장을 표시했습니다.`:`${roleLabels[route.role]}의 관점에서도 현재 목적의 판단 순서를 먼저 따라가세요.`;
 const list=result.querySelector<HTMLOListElement>('[data-recommendations]')!;list.replaceChildren();let done=0;let next:any;
 for(const number of route.chapters){
  const c=book.chapters[number-1],status=readStatus(state,c.id,c.revision);if(['read','updated'].includes(status))done++;else if(!next)next=c;
  const li=document.createElement('li'),num=document.createElement('span'),main=document.createElement('div'),link=document.createElement('a'),reason=document.createElement('p'),badge=document.createElement('span');
  num.className='chapter-number';num.textContent=String(number).padStart(2,'0');link.href=c.url+(route.depth==='overview'?'#chapter-brief':'');link.textContent=c.title.replace(/^\d+장 /,'');reason.textContent=route.reasons[number]??c.decision;badge.className='status-pill';badge.dataset.status=status;badge.textContent=labels[status];
  main.append(link,reason);if(route.emphasis.includes(number)){const emphasis=document.createElement('small');emphasis.className='role-emphasis';emphasis.textContent='이 역할에서 특히 살펴볼 장';main.append(emphasis);}li.append(num,main,badge);list.append(li);
 }
 const resources=result.querySelector<HTMLElement>('[data-demo-resources]')!;resources.replaceChildren();
 for(const item of route.resources){const demo=book.demos.find(d=>d.id===item.id);if(!demo)continue;const li=document.createElement('li'),link=document.createElement('a'),reason=document.createElement('p');link.href=demo.url;link.textContent=demo.title;reason.textContent=item.reason;li.append(link,reason);resources.append(li);}
 result.querySelector<HTMLElement>('[data-route-resources]')!.hidden=resources.childElementCount===0;
 result.querySelector<HTMLElement>('[data-route-progress]')!.textContent=`추천 경로 ${done}/${route.chapters.length}장 읽음`;
 const continueLink=result.querySelector<HTMLAnchorElement>('[data-route-continue]')!;continueLink.href=next?next.url+(route.depth==='overview'?'#chapter-brief':''):'/contents/';continueLink.textContent=next?`${next.number}장부터 이어 읽기`:'경로를 마쳤어요 · 전체 목차';
 if(focus)result.querySelector<HTMLElement>('h2')!.focus();
}
form.addEventListener('submit',e=>{e.preventDefault();const key=['purpose','role','depth'][step];if(!form.querySelector(`input[name="${key}"]:checked`)){form.querySelector<HTMLElement>('[data-quiz-error]')!.textContent='선택지를 하나 골라 주세요.';steps[step].querySelector<HTMLInputElement>('input')?.focus();return;}
 if(step<2){showStep(step+1);return;}const data=Object.fromEntries(new FormData(form));progress.setAnswers(data);changed();render(data,true);window.dispatchEvent(new CustomEvent('book:analytics',{detail:{name:'guide_complete',data:{chapter_count:recommend(data).chapters.length}}}));
});
form.querySelector('[data-quiz-back]')!.addEventListener('click',()=>showStep(Math.max(0,step-1)));
result.querySelector('[data-edit-answers]')!.addEventListener('click',()=>{result.hidden=true;form.hidden=false;const a=normalizeAnswers(activeAnswers??{});for(const [key,value] of Object.entries(a)){const input=form.querySelector<HTMLInputElement>(`input[name="${key}"][value="${value}"]`);if(input)input.checked=true;}showStep(0);});
result.querySelector('[data-clear-answers]')!.addEventListener('click',()=>{progress.clearAnswers();activeAnswers=null;changed();form.reset();result.hidden=true;form.hidden=false;showStep(0);});
window.addEventListener('storage',e=>{if(e.key===STORAGE_KEY||e.key===null){const a=progress.read().state.answers;if(a)render(a);else{activeAnswers=null;form.reset();result.hidden=true;form.hidden=false;showStep(0);}}});
if(activeAnswers)render(activeAnswers);
