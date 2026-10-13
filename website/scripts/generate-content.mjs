import {readFileSync,writeFileSync,mkdirSync,existsSync,rmSync,statSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {transformMarkdown} from './publication.mjs';
const site=fileURLToPath(new URL('..',import.meta.url)),root=resolve(site,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const publication=JSON.parse(read('book-publication.json'));
const project=JSON.parse(read('book_project.json')),patterns=JSON.parse(read('pattern_catalog.json')),sources=JSON.parse(read('research/sources.json')).sources;
const manifestPath=resolve(site,'content-manifest.json'),update=process.argv.includes('--update-anchors');
const manifest=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,'utf8')):{};
const entries=[{id:'preface',path:'manuscript/front-matter/00-preface.md',route:'book/preface',title:'서문 · 소프트웨어를 생산하는 조직'},...project.parts.flatMap((part,pi)=>part.chapters.map(c=>({id:`ch${String(c.number).padStart(2,'0')}`,number:c.number,path:c.manuscript_path,route:`book/ch${String(c.number).padStart(2,'0')}`,title:c.title,decision:c.leader_decision,purpose:c.purpose,patterns:c.patterns,part:pi+1}))),...patterns.map(p=>({id:p.id.toLowerCase(),path:`manuscript/patterns/${p.id.toLowerCase()}.md`,route:`patterns/${p.id.toLowerCase()}`,title:`${p.id} ${p.name}`,purpose:p.problem}))];
const out=resolve(site,'src/content/docs');mkdirSync(out,{recursive:true});
// Only this generated directory is replaced; authored pages and manuscript are untouched.
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
const cite=new Set(),book={publication,title:project.working_title,subtitle:project.working_subtitle,author:project.author,parts:project.parts.map(p=>p.title),chapters:[],patterns:[]};
const front=(data,body)=>'---\n'+Object.entries(data).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join('\n')+'\n---\n\n'+body+'\n';
function write(route,data,body){const file=resolve(out,route+'.md');mkdirSync(dirname(file),{recursive:true});writeFileSync(file,front(data,body));}
for(const entry of entries){
 const text=read(entry.path),titles=[...text.matchAll(/^## (.+)$/gm)].map(m=>m[1]);
 const record=manifest[entry.id]??{revision:'1',anchors:{}};
 for(const title of titles) if(!record.anchors[title]) {
  if(!update)throw Error(`Register new heading with npm run content -- --update-anchors: ${entry.id}: ${title}`);
  record.anchors[title]='s'+String(Math.max(0,...Object.values(record.anchors).map(x=>Number(x.slice(1))))+1).padStart(2,'0');
 }
 manifest[entry.id]=record;
 const ids=[...new Set([...text.matchAll(/\[(S\d{2,})\]/g)].map(m=>m[1]))];ids.forEach(id=>cite.add(id));
 const meta={...entry,revision:record.revision,sources:ids,url:`/${entry.route}/`};delete meta.path;
 if(entry.number)book.chapters.push(meta);else if(entry.id.startsWith('p')&&entry.id!=='preface')book.patterns.push(meta);
 const data={title:entry.title,description:entry.decision??entry.purpose??project.working_subtitle,bookId:entry.id,revision:record.revision,decision:entry.decision??'',pagefind:true,editUrl:false};
 if(entry.number){data.prev={link:entry.number===1?'/book/preface/':`/book/ch${String(entry.number-1).padStart(2,'0')}/`,label:entry.number===1?'서문':`${entry.number-1}장`};data.next=entry.number===20?false:{link:`/book/ch${String(entry.number+1).padStart(2,'0')}/`,label:`${entry.number+1}장`};}
 else {data.prev=false;data.next=entry.id==='preface'?{link:'/book/ch01/',label:'1장 코드 생성에서 의도 실현으로'}:false;}
 write(entry.route,data,transformMarkdown(text,record.anchors));
}
const safe=v=>String(v??'').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let bibliography='본문에 인용한 자료만 모았습니다. 공개 설명·코드 구조·실행 기록·운영 효과의 확인 범위는 서로 다릅니다. 발표일을 확인하지 못한 자료는 확인일을 표시합니다.\n\n';
bibliography+='## 장별 자료\n\n'+book.chapters.map(c=>`<span id="refs-${c.id}"></span>\n\n**[${c.title}](${c.url})**: ${c.sources.map(id=>`[${id}](#${id})`).join(', ')}`).join('\n\n')+'\n\n';
for(const s of sources.filter(s=>cite.has(s.id))) {
 if(!/^https?:\/\//.test(s.url))throw Error('Invalid public source URL '+s.id);
 bibliography+=`<span id="${s.id}"></span>\n\n### ${s.id} · ${safe(s.title)}\n\n[원문 읽기](${s.url})\n\n${safe(s.author??'작성 주체는 원문 참조')}\n\n발표일: ${safe(s.published_on??'미확인')} / 확인일: ${safe(s.checked_on??'미확인')}\n\n**확인 범위:** ${safe(s.verification_scope??s.verification_status)}\n\n**한계:** ${safe(s.limit)}\n\n`;
}
write('changelog',{title:'체인지 로그',description:'독자가 알아둘 중요한 변경',tableOfContents:false,prev:false,next:false},read('CHANGELOG.md').replace(/^# .+\n/,''));
write('sources',{title:'참고문헌',description:'본문의 원문 출처와 확인 범위',tableOfContents:false,prev:false,next:false},bibliography);
mkdirSync(resolve(site,'src/data'),{recursive:true});writeFileSync(resolve(site,'src/data/book.json'),JSON.stringify(book,null,2)+'\n');
if(update)writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(`Generated ${entries.length} manuscript pages and ${cite.size} cited sources.`);

// Include the exact license texts in the standalone static distribution.
const licenseDir=resolve(site,'public/licenses');mkdirSync(licenseDir,{recursive:true});
for(const name of ['CC-BY-SA-4.0.txt','MIT.txt'])writeFileSync(resolve(licenseDir,name),read('LICENSES/'+name));
const thirdParty=['astro','@astrojs/starlight','pagefind'].map(name=>{
 const dir=resolve(site,'node_modules',name),pkg=JSON.parse(readFileSync(resolve(dir,'package.json'),'utf8'));
 const path=resolve(dir,'LICENSE');
 const text=statSync(path).isDirectory()?readdirSync(path).sort().map(file=>`${file}\n\n${readFileSync(resolve(path,file),'utf8')}`).join('\n\n'):readFileSync(path,'utf8');
 return `${name} ${pkg.version}\n\n${text}`;
}).join('\n\n============================================================\n\n');
writeFileSync(resolve(licenseDir,'THIRD-PARTY.txt'),'Notices for the primary website framework and search packages.\nOther third-party materials retain their own notices and terms.\n\n'+thirdParty);
