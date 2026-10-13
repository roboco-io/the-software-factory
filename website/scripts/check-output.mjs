import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {load} from 'cheerio';
const root=resolve('dist');
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);}
const pages=files(root).filter(f=>f.endsWith('.html')),errors=[];
for(const file of pages){const html=readFileSync(file,'utf8'),$=load(html);
 if(/\/Users\/|research\/claims|planning\/reviews|STATUS\.md/.test(html))errors.push(`Internal material leaked: ${file}`);
 for(const el of $('a[href]').toArray()){
  const href=$(el).attr('href');if(!href||/^(https?:|mailto:|tel:|javascript:)/.test(href))continue;
  const url=new URL(href,'https://book.test/'+file.slice(root.length+1).replace(/index\.html$/,''));
  const target=join(root,decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');
  if(!existsSync(target)){errors.push(`Missing target ${file}: ${href}`);continue;}
  if(url.hash&&target.endsWith('.html')){const doc=load(readFileSync(target,'utf8'));const id=decodeURIComponent(url.hash.slice(1));if(!doc('[id]').toArray().some(e=>doc(e).attr('id')===id))errors.push(`Missing anchor ${file}: ${href}`);}
 }
}
for(let n=1;n<=20;n++)if(!existsSync(join(root,`book/ch${String(n).padStart(2,'0')}/index.html`)))errors.push(`Missing chapter ${n}`);
for(let n=1;n<=15;n++)if(!existsSync(join(root,`patterns/p${String(n).padStart(2,'0')}/index.html`)))errors.push(`Missing pattern ${n}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`PASS: ${pages.length} public HTML pages; local links and anchors; no internal review paths.`);
