import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PURPOSES,ROLES,DEPTHS,recommend,normalizeAnswers,purposeLabels,roleLabels} from '../src/lib/recommendations.mjs';
import {createProgressStore} from '../src/lib/progress.mjs';
const demoIds=new Set(JSON.parse(readFileSync(new URL('../demo-pages.json',import.meta.url),'utf8')).map(d=>d.id));
test('current intent, harness and security questions have decision-led routes and explanations',()=>{
 for(const purpose of ['intent','harness','security']){
  assert.ok(PURPOSES.includes(purpose));assert.ok(purposeLabels[purpose]);
  const route=recommend({purpose});assert.equal(route.purpose,purpose);assert.ok(route.summary.length>20);
  for(const chapter of route.chapters)assert.ok(route.reasons[chapter]?.length>15);
 }
 assert.deepEqual(recommend({purpose:'security'}).chapters,[18,7,12,17,19]);
 assert.ok(ROLES.includes('platform'));assert.ok(ROLES.includes('security'));assert.ok(roleLabels.security);
 assert.notEqual(recommend({purpose:'quality'}).reasons[12],recommend({purpose:'authority'}).reasons[12]);
});
test('all choices keep short chapter routes and optional resources resolve to authored explanations',()=>{
 const covered=new Set();
 for(const purpose of PURPOSES)for(const role of ROLES)for(const depth of DEPTHS){
  const route=recommend({purpose,role,depth});
  assert.ok(route.chapters.length>=3&&route.chapters.length<=5);
  assert.equal(route.chapters.length,new Set(route.chapters).size);
  for(const chapter of route.chapters){assert.ok(chapter>=1&&chapter<=20);assert.ok(route.reasons[chapter]);covered.add(chapter);}
  assert.deepEqual(route.chapters,recommend({purpose,role:'other',depth:'focused'}).chapters);
  assert.ok(route.emphasis.every(n=>route.chapters.includes(n)));
  for(const resource of route.resources){assert.ok(demoIds.has(resource.id),resource.id);assert.ok(resource.reason);}
 }
 assert.equal(covered.size,20);
});
test('saved legacy answers and reading marks survive new question options',()=>{
 const values=new Map();const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 for(const purpose of ['adoption','quality','authority','team','ownership','intro']){
  const store=createProgressStore(()=>storage);store.mark('ch07','2',true);store.setAnswers({purpose,role:'lead',depth:'full'});
  const restored=createProgressStore(()=>storage).read().state;
  assert.equal(restored.answers.purpose,purpose);assert.equal(restored.answers.role,'lead');assert.equal(restored.answers.depth,'full');assert.equal(restored.chapters.ch07.status,'read');
 }
 assert.equal(normalizeAnswers({purpose:'missing'}).purpose,'intro');
 assert.equal(recommend({purpose:'missing'}).chapters.includes(9),true);
});
