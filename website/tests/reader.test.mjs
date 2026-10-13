import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PURPOSES, ROLES, DEPTHS, recommend } from '../src/lib/recommendations.mjs';
import { STORAGE_KEY, createProgressStore, readStatus } from '../src/lib/progress.mjs';
const memory = () => { const values = new Map(); return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}; };
test('every reader choice has a short valid route and preserves quality prerequisites', () => {
 for (const purpose of PURPOSES) for (const role of ROLES) for (const depth of DEPTHS) {
  const r=recommend({purpose,role,depth});
  assert.ok(r.chapters.length>=3 && r.chapters.length<=5);
  assert.equal(new Set(r.chapters).size,r.chapters.length);
  assert.ok(r.chapters.every(n=>n>=1&&n<=20));
  if(purpose==='quality') assert.deepEqual(r.chapters,[5,7,8,11,12]);
 }
});
test('goal takes precedence over role; role changes emphasis; full reading stays available',()=>{
 const a=recommend({purpose:'adoption',role:'executive',depth:'full'});
 const b=recommend({purpose:'adoption',role:'lead',depth:'overview'});
 assert.deepEqual(a.chapters,[1,9,17,18,20]);assert.deepEqual(a.chapters,b.chapters);
 assert.notDeepEqual(a.emphasis,b.emphasis);assert.equal(a.fullBook,true);
 assert.deepEqual(recommend({purpose:'invalid'}).chapters,[1,2,3,4]);
});
test('visiting never marks a chapter read; marking and undoing survives a new store',()=>{
 const s=memory(),p=createProgressStore(()=>s);p.visit('ch07','1','s03',.4);
 assert.equal(readStatus(p.read().state,'ch07','1'),'reading');p.mark('ch07','1',true);
 const restored=createProgressStore(()=>s);assert.equal(readStatus(restored.read().state,'ch07','1'),'read');
 assert.equal(restored.read().state.chapters.ch07.anchor,'s03');
 restored.mark('ch07','1',false);assert.equal(readStatus(restored.read().state,'ch07','1'),'reading');
});
test('semantic revision flags earlier reading without destroying it',()=>{
 const s=memory(),p=createProgressStore(()=>s);p.mark('ch07','1',true);
 assert.equal(readStatus(p.read().state,'ch07','2'),'updated');
});
test('answers are independent of progress and may be reset separately',()=>{
 const s=memory(),p=createProgressStore(()=>s);p.mark('ch01','1',true);p.setAnswers({purpose:'quality',role:'lead',depth:'focused'});p.clearAnswers();
 assert.equal(p.read().state.answers,null);assert.equal(readStatus(p.read().state,'ch01','1'),'read');
});
test('a tab reads the latest saved state before writing another chapter',()=>{
 const s=memory(),a=createProgressStore(()=>s),b=createProgressStore(()=>s);a.mark('ch01','1',true);b.mark('ch02','1',true);
 assert.equal(Object.keys(a.read().state.chapters).length,2);
});
test('turning saving off clears reading data and stays off on reload',()=>{
 const s=memory(),p=createProgressStore(()=>s);p.visit('ch01','1');p.setEnabled(false);p.visit('ch02','1');
 const q=createProgressStore(()=>s);assert.equal(q.read().state.enabled,false);assert.deepEqual(q.read().state.chapters,{});
 q.setEnabled(true);q.visit('ch02','1');assert.equal(q.read().state.last,'ch02');q.reset();assert.deepEqual(q.read().state.chapters,{});
});
test('blocked storage permits memory-only reading with a recoverable status',()=>{
 const p=createProgressStore(()=>{throw Error('blocked');});p.mark('ch03','1',true);
 assert.equal(readStatus(p.read().state,'ch03','1'),'read');assert.equal(p.read().available,false);
});
test('corrupt or unrecognized stored data never breaks the reader',()=>{
 for(const raw of ['{bad',JSON.stringify({version:999}),JSON.stringify({version:1,chapters:{ch01:{anchor:'bad',offset:'x'},evil:{status:'read'}}})]) {
  const s=memory();s.setItem(STORAGE_KEY,raw);const p=createProgressStore(()=>s);p.visit('ch02','1','s02',.2);
  assert.equal(p.read().state.last,'ch02');assert.equal(p.read().state.chapters.evil,undefined);
 }
});
test('write-only failure retains in-memory changes and reports unavailable storage',()=>{
 let fail=true;const s=memory(),base=s.setItem;s.setItem=(k,v)=>{if(fail)throw Error('quota');base(k,v);};
 const p=createProgressStore(()=>s);p.mark('ch03','1',true);
 assert.equal(readStatus(p.read().state,'ch03','1'),'read');assert.equal(p.read().available,false);
 fail=false;p.mark('ch04','1',true);const restored=createProgressStore(()=>s);
 assert.equal(readStatus(restored.read().state,'ch03','1'),'read');assert.equal(restored.read().available,true);
});
test('returning to the top replaces an old section bookmark',()=>{
 const s=memory(),p=createProgressStore(()=>s);p.visit('ch07','1','s04',.6);p.visit('ch07','1','',0);
 assert.equal(p.read().state.chapters.ch07.anchor,'');assert.equal(p.read().state.chapters.ch07.offset,0);
});
