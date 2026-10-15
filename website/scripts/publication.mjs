export function publicLink(target) {
 if(/^(https?:\/\/|mailto:|#)/.test(target)) return target;
 const [path,hash]=target.split('#');let result;
 if(/(?:^|\/)ch\d{2}\.md$/.test(path)) result='/book/'+path.match(/ch\d{2}/)[0]+'/';
 else if(/(?:^|\/)p\d{2}\.md$/.test(path)) result='/patterns/'+path.match(/p\d{2}/)[0]+'/';
 else if(/(?:^|\/)figures\/(policy-hierarchy|harness-policy-cycle)\.svg$/.test(path)) result='/diagrams/'+path.match(/(policy-hierarchy|harness-policy-cycle)\.svg$/)[0];
 else if(path.endsWith('/research/sources.json')) result='/sources/';
 else if(/\/research\/claims\/ch\d{2}\.json$/.test(path)) return '/sources/#refs-'+path.match(/ch\d{2}/)[0];
 else if(path.endsWith('/research/cases/software-factory-demo.md')) return '/sources/#S59';
 else if(path.endsWith('/research/mcconnell/chapter-map.md')) return '/about/#source-scope';
 else throw Error('Unmapped publication link: '+target);
 return result+(hash?'#'+hash:'');
}
export function transformMarkdown(text,anchors={}) {
 return text.replace(/^# .+\n/,'').replace(/^상태:.*\n/gm,'')
 .replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(_,label,url)=>`[${label.replace('주장 메모','자료 확인 범위').replace('기존 연구 대응 지도','원서 주제 연결의 범위').replace('연구 대응 지도','원서 주제 연결의 범위')}](${publicLink(url)})`)
 .replace(/\[(S\d{2,})\](?!\()/g,(_,id)=>`<a class="source-ref" href="/sources/#${id}" aria-label="출처 ${id}">[${id}]</a>`)
 .replace(/^## (.+)$/gm,(line,title)=>{if(!anchors[title])throw Error('Missing stable anchor: '+title);return `<span id="${anchors[title]}" data-reading-anchor aria-hidden="true"></span>\n\n${line}`;}).trim();
}
