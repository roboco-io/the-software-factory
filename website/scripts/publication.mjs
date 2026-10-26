import {readFileSync} from 'node:fs';
import {linkPatternReferences} from './pattern-references.mjs';
const demoPages=JSON.parse(readFileSync(new URL('../demo-pages.json',import.meta.url),'utf8'));
export const diagramFiles=new Set(JSON.parse(readFileSync(new URL('../../manuscript/figures/catalog.json',import.meta.url),'utf8')).map(figure=>figure.file));
const demoSources=new Set(demoPages.map(page=>page.path));
const demoLinks=new Map(demoPages.map(page=>[page.path.split('/').at(-1),`/${page.route}/`]));
export function publicLink(target,sourcePath='') {
 if(/^(https?:\/\/|mailto:|#)/.test(target)) return target;
 const [path,hash]=target.split('#');let result;
 if(/^\.\.\/demo\/[a-z-]+\.md$/.test(path)) result=demoLinks.get(path.slice('../demo/'.length));
 else if(demoSources.has(sourcePath)&&/^[a-z-]+\.md$/.test(path)) result=demoLinks.get(path);
 else if(path==='../front-matter/00-preface.md'&&demoSources.has(sourcePath)) result='/book/preface/';
 else if(/(?:^|\/)ch\d{2}\.md$/.test(path)) result='/book/'+path.match(/ch\d{2}/)[0]+'/';
 else if(/(?:^|\/)p\d{2}\.md$/.test(path)) result='/patterns/'+path.match(/p\d{2}/)[0]+'/';
 else if(/^\.\.\/figures\/[^/]+\.svg$/.test(path)&&diagramFiles.has(path.slice('../figures/'.length))) result='/diagrams/'+path.slice('../figures/'.length);
 else if(path.endsWith('/research/sources.json')) result='/sources/';
 else if(/\/research\/claims\/ch\d{2}\.json$/.test(path)) return '/sources/#refs-'+path.match(/ch\d{2}/)[0];
 else if(path.endsWith('/research/cases/software-factory-demo.md')) return '/sources/#S59';
 else if(path.endsWith('/research/mcconnell/chapter-map.md')) return '/about/#source-scope';
 else throw Error('Unmapped publication link: '+target);
 if(!result)throw Error('Unmapped publication link: '+target);
 return result+(hash?'#'+hash:'');
}
// 책 토론 포럼(데모 서비스)의 절 토론 목록. 문서 ID와 고정 앵커로 연결하므로 제목이 바뀌어도 링크가 유지된다.
export const FORUM_BASE='https://roboco.io/the-software-factory-demo/';
const escapeAttr=v=>v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const forumSectionUrl=(docId,anchor)=>`${FORUM_BASE}#/book/${docId}?anchor=${anchor}`;
// 포럼은 패턴 15개를 문서 patterns 하나로 묶고 패턴 하나를 절 하나(앵커 pNN)로 다룬다. 패턴 페이지는 링크 하나만 둔다.
const forumLink=(href,text,label)=>`<p data-pagefind-ignore><a class="forum-link" href="${href}" aria-label="${escapeAttr(label)}">${text}</a></p>`;
export function transformMarkdown(text,anchors={},sourcePath='',docId='') {
 const pattern=/^p\d+$/.test(docId);
 const body=text.replace(/^# .+\n/,'').replace(/^상태:.*\n/gm,'')
 .replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(_,label,url)=>`[${label.replace('주장 메모','자료 확인 범위').replace('기존 연구 대응 지도','참고 도서 주제 연결의 범위').replace('연구 대응 지도','참고 도서 주제 연결의 범위')}](${publicLink(url,sourcePath)})`);
 const out=linkPatternReferences(body)
 .replace(/\[(S\d{2,})\](?!\()/g,(_,id)=>`<a class="source-ref" href="/sources/#${id}" aria-label="출처 ${id}">[${id}]</a>`)
 .replace(/^## (.+)$/gm,(line,title)=>{if(!anchors[title])throw Error('Missing stable anchor: '+title);
  const forum=docId&&!pattern?`\n\n${forumLink(forumSectionUrl(docId,anchors[title]),'이 절 토론하기',`이 절 토론하기: ${title}`)}`:'';
  return `<span id="${anchors[title]}" data-reading-anchor aria-hidden="true"></span>\n\n${line}${forum}`;}).trim();
 return pattern?`${forumLink(forumSectionUrl('patterns',docId),'이 패턴 토론하기','이 패턴 토론하기')}\n\n${out}`:out;
}
