import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnalytics,CONSENT_KEY,CONSENT_TTL,safePageUrl,safeEvent} from '../src/lib/analytics.mjs';
function setup(options={}){
 const records=new Map(),calls=[];let time=100000000;
 const storage={getItem:k=>records.get(k)??null,setItem:(k,v)=>records.set(k,v)};
 const analytics=createAnalytics({measurementId:'G-ABC1234567',hostname:'factory.roboco.io',siteHostname:'factory.roboco.io',getStorage:()=>storage,now:()=>time,enable:()=>calls.push('enable'),disable:()=>calls.push('disable'),send:(...args)=>calls.push(args),...options});
 return {analytics,storage,records,calls,advance:()=>time+=CONSENT_TTL+1};
}
test('analytics never starts or queues behaviour before consent, refusal remains off',()=>{
 const s=setup();s.analytics.sync();assert.equal(s.analytics.track('guide_complete',{chapter_count:5}),false);s.analytics.choose('denied');assert.deepEqual(s.calls,[]);assert.equal(s.analytics.sync().choice,'denied');
});
test('grant starts once, events use an allowlist, withdrawal disables and never replays history',()=>{
 const s=setup();s.analytics.choose('granted');s.analytics.choose('granted');assert.deepEqual(s.calls,['enable']);
 assert.equal(s.analytics.track('chapter_mark_read',{chapter_id:'ch07',email:'private@example.test',answers:{role:'leader'}}),true);
 assert.deepEqual(s.calls[1],['chapter_mark_read',{chapter_id:'ch07'}]);
 s.analytics.choose('denied');assert.equal(s.analytics.track('guide_complete',{chapter_count:5}),false);assert.equal(s.calls.at(-1),'disable');
});
test('reload restores only valid consent; expiration and another tab stop collection',()=>{
 const s=setup();s.analytics.choose('granted');s.advance();assert.equal(s.analytics.sync().choice,null);assert.equal(s.calls.at(-1),'disable');
 const t=setup();t.analytics.choose('granted');t.records.delete(CONSENT_KEY);assert.equal(t.analytics.sync().choice,null);assert.equal(t.calls.at(-1),'disable');
 const u=setup();u.records.set(CONSENT_KEY,JSON.stringify({version:1,choice:'granted',updatedAt:100000000}));u.analytics.sync();assert.deepEqual(u.calls,['enable']);
});
test('bad config or local host never activates; corrupt storage does not imply consent',()=>{
 for(const options of [{measurementId:''},{measurementId:'not-an-id'},{hostname:'localhost'}]){const s=setup(options);s.analytics.choose('granted');assert.deepEqual(s.calls,[]);assert.equal(s.analytics.sync().configured,false);}
 const s=setup();s.records.set(CONSENT_KEY,'broken');assert.equal(s.analytics.sync().choice,null);assert.deepEqual(s.calls,[]);
});
test('blocked storage allows an explicit choice for the current document without crashing',()=>{
 const s=setup({getStorage:()=>{throw Error('blocked')}});assert.equal(s.analytics.sync().choice,null);s.analytics.choose('granted');assert.deepEqual(s.calls,['enable']);s.analytics.choose('denied');assert.equal(s.calls.at(-1),'disable');
});
test('page URLs exclude query and fragments; event data excludes free text and reader answers',()=>{
 assert.equal(safePageUrl('https://factory.roboco.io/book/ch01/?email=private#s02'),'https://factory.roboco.io/book/ch01/');
 assert.deepEqual(safeEvent('guide_complete',{chapter_count:5,purpose:'quality',role:'manager'}),{chapter_count:5});
 assert.equal(safeEvent('chapter_mark_read',{chapter_id:'private text'}),null);assert.equal(safeEvent('unknown_event',{}),null);
 assert.equal(safeEvent('outbound_click',{destination:'demo'}),null);
});
test('malformed event values cannot smuggle nested or coerced payloads',()=>{
 assert.equal(safeEvent('guide_complete',null),null);
 assert.equal(safeEvent('chapter_mark_read',{chapter_id:['ch07']}),null);
});
test('a refused choice overrides an old readable grant and survives reload when primary writes fail',()=>{
 const records=new Map([[CONSENT_KEY,JSON.stringify({version:1,choice:'granted',updatedAt:100000000})]]);
 let full=false;const backup=new Map();const primary={getItem:k=>records.get(k)??null,setItem:(k,v)=>{if(full)throw new DOMException('full','QuotaExceededError');records.set(k,v);},removeItem:k=>records.delete(k)};
 const getBackupStorage=()=>({getItem:k=>backup.get(k)??null,setItem:(k,v)=>backup.set(k,v)});
 const s=setup({getStorage:()=>primary,getBackupStorage});s.analytics.sync();full=true;assert.equal(s.analytics.choose('denied').active,false);assert.equal(s.calls.at(-1),'disable');assert.equal(s.analytics.track('guide_complete',{chapter_count:5}),false);
 const reloaded=setup({getStorage:()=>primary,getBackupStorage});assert.equal(reloaded.analytics.sync().choice,'denied');assert.deepEqual(reloaded.calls,[]);
});
test('backup refusal wins even if the old primary grant cannot be deleted',()=>{
 const old=JSON.stringify({version:1,choice:'granted',updatedAt:100000000});const backup=new Map();
 const options={getStorage:()=>({getItem:()=>old,setItem:()=>{throw Error('read only');},removeItem:()=>{throw Error('read only');}}),getBackupStorage:()=>({getItem:k=>backup.get(k)??null,setItem:(k,v)=>backup.set(k,v)})};
 const s=setup(options);s.analytics.choose('denied');assert.equal(s.analytics.sync().active,false);const reload=setup(options);assert.equal(reload.analytics.sync().choice,'denied');assert.deepEqual(reload.calls,[]);
});
test('restored grants fail closed when consent persistence is entirely read-only',()=>{
 const old=JSON.stringify({version:1,choice:'granted',updatedAt:100000000});
 const s=setup({getStorage:()=>({getItem:()=>old,setItem:()=>{throw Error('read only');}})});
 assert.equal(s.analytics.sync().active,false);assert.deepEqual(s.calls,[]);
});
test('a newer cookie refusal in another tab overrides a memory grant when primary storage is blocked',()=>{
 let time=100000000;const backup=new Map();const options={now:()=>time,getStorage:()=>{throw Error('blocked');},getBackupStorage:()=>({getItem:k=>backup.get(k)??null,setItem:(k,v)=>backup.set(k,v),removeItem:k=>backup.delete(k)})};
 const a=setup(options),b=setup(options);a.analytics.choose('granted');time++;b.analytics.choose('denied');assert.equal(a.analytics.sync().active,false);assert.equal(a.analytics.track('guide_complete',{chapter_count:5}),false);
});
