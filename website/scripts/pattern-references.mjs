import {readFileSync} from 'node:fs';
import {fromMarkdown} from 'mdast-util-from-markdown';

const patterns=new Map(JSON.parse(readFileSync(new URL('../../pattern_catalog.json',import.meta.url),'utf8')).map(p=>[p.id,p]));
const escapeHtml=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function reference(pattern,label,url=`/patterns/${pattern.id.toLowerCase()}/`){
 return `<a class="pattern-ref" href="${escapeHtml(url)}" aria-label="${escapeHtml(`${pattern.id} ${pattern.name} 패턴`)}">${escapeHtml(label)}<span class="pattern-badge" aria-hidden="true" data-pagefind-ignore>패턴</span></a>`;
}

// Patch original source offsets rather than serializing Markdown,so authored layout stays intact.
export function linkPatternReferences(source){
 const tree=fromMarkdown(source),edits=[],htmlTags=[];
 const definitions=new Map(tree.children.filter(n=>n.type==='definition').map(n=>[n.identifier,n.url]));
 const skip=new Set(['heading','code','inlineCode','definition','image','imageReference']);
 function visit(node){
  if(skip.has(node.type))return;
  if(node.type==='html'){
   const raw=node.value.replace(/<!--[\s\S]*?-->/g,'');
   for(const tag of raw.matchAll(/<(\/)?([a-z][a-z0-9-]*)\b[^>]*>/gi)){
    const name=tag[2].toLowerCase();
    if(tag[1]){const index=htmlTags.lastIndexOf(name);if(index>=0)htmlTags.splice(index);}
    else if(!/\/\s*>$/.test(tag[0])&&!['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'].includes(name))htmlTags.push(name);
   }
   return;
  }
  if(node.type==='link'||node.type==='linkReference'){
   const url=node.type==='link'?node.url:definitions.get(node.identifier);
   const match=url?.match(/^\/patterns\/(p\d{2})\/(?:#.*)?$/);
   const pattern=match&&patterns.get(match[1].toUpperCase());
   if(!htmlTags.length&&pattern&&node.children.every(n=>n.type==='text'))edits.push({start:node.position.start.offset,end:node.position.end.offset,text:reference(pattern,node.children.map(n=>n.value).join(''),url)});
   return; // Never turn a reference inside another link into a nested anchor.
  }
  if(node.type==='text'&&!htmlTags.length){
   const start=node.position.start.offset,raw=source.slice(start,node.position.end.offset);
   const matcher=/(?<![a-zA-Z0-9_])P\d{2}(?![a-zA-Z0-9_])/g;
   for(const match of raw.matchAll(matcher)){
    const pattern=patterns.get(match[0]);if(!pattern)continue;
    let end=match.index+match[0].length;
    const tail=raw.slice(end),space=tail.match(/^[ \t]+/)?.[0];
    if(space){
     const rest=tail.slice(space.length);
     const names=[`‘${pattern.name}’`,`“${pattern.name}”`,`'${pattern.name}'`,`"${pattern.name}"`,pattern.name];
     const name=names.find(value=>rest.startsWith(value));if(name)end+=space.length+name.length;
    }
    edits.push({start:start+match.index,end:start+end,text:reference(pattern,raw.slice(match.index,end))});
   }
   return;
  }
  for(const child of node.children??[])visit(child);
 }
 visit(tree);
 let out=source;
 for(const edit of edits.sort((a,b)=>b.start-a.start))out=out.slice(0,edit.start)+edit.text+out.slice(edit.end);
 return out;
}
