import { test } from 'node:test';
import assert from 'node:assert/strict';
import {publicLink,transformMarkdown,diagramFiles} from '../scripts/publication.mjs';
test('only known local manuscript references become public URLs',()=>{
 assert.equal(publicLink('../chapters/ch07.md'),'/book/ch07/');
 assert.equal(publicLink('p03.md'),'/patterns/p03/');
 assert.equal(publicLink('../../research/claims/ch07.json'),'/sources/#refs-ch07');
 assert.equal(publicLink('../../research/sources.json'),'/sources/');
 assert.throws(()=>publicLink('../../STATUS.md'));
});
test('source marks and internal links transform without touching external code URLs',()=>{
 const source='# Title\n\n상태: 초고 · 저자 검토 대기\n\n## Evidence\n\n문장.[S10] [7장](ch07.md) [코드](https://example.org/src.ts)';
 const out=transformMarkdown(source,{'Evidence':'s01'});
 assert.ok(!out.includes('상태:'));assert.ok(!out.startsWith('# Title'));
 assert.ok(out.includes('href="/sources/#S10"'));assert.ok(out.includes('[7장](/book/ch07/)'));
 assert.ok(out.includes('id="s01"'));assert.ok(out.includes('https://example.org/src.ts'));
});
test('authored policy diagrams get public paths while unrelated SVG paths remain private',()=>{
 assert.equal(publicLink('../figures/policy-hierarchy.svg'),'/diagrams/policy-hierarchy.svg');
 assert.equal(publicLink('../figures/harness-policy-cycle.svg'),'/diagrams/harness-policy-cycle.svg');
 assert.ok(transformMarkdown('![정책 계층](../figures/policy-hierarchy.svg)').includes('![정책 계층](/diagrams/policy-hierarchy.svg)'));
 assert.throws(()=>publicLink('../figures/private.svg'));
 for(const file of diagramFiles)assert.equal(publicLink('../figures/'+file),'/diagrams/'+file);
 assert.throws(()=>publicLink('../figures/../policy-hierarchy.svg'));
});
test('only registered demo pages resolve with their authored context',()=>{
 assert.equal(publicLink('../demo/request.md'),'/demo/request/');
 assert.equal(publicLink('../demo/index.md'),'/demo/');
 assert.equal(publicLink('evidence.md#s01','manuscript/demo/request.md'),'/demo/evidence/#s01');
 assert.equal(publicLink('index.md','manuscript/demo/request.md'),'/demo/');
 assert.equal(publicLink('../front-matter/00-preface.md','manuscript/demo/index.md'),'/book/preface/');
 assert.throws(()=>publicLink('index.md'));
 assert.throws(()=>publicLink('index.md','manuscript/demo/private.md'));
 assert.throws(()=>publicLink('private.md','manuscript/demo/request.md'));
 assert.throws(()=>publicLink('../demo/private.md'));
 assert.throws(()=>publicLink('../demo/../STATUS.md'));
 assert.ok(transformMarkdown('[解説](evidence.md)',{},'manuscript/demo/request.md').includes('(/demo/evidence/)'));
});
test('pattern references in prose and tables link to the catalog with a visible badge',()=>{
 const out=transformMarkdown("P14 ‘흐름에 맞춘 권한과 팀 경계’는 책임을 다룬다. P01과 P15도 참조한다.\n\n| 패턴 | 설명 |\n|---|---|\n| P07 | 검증 |\n\nP99와 XP14는 식별자가 아니다.");
 for(const id of ['p14','p01','p15','p07'])assert.ok(out.includes(`href="/patterns/${id}/"`));
 assert.equal((out.match(/class="pattern-badge"/g)||[]).length,4);
 assert.ok(out.includes('>패턴</span>'));
 assert.ok(out.includes('aria-label="P14 흐름에 맞춘 권한과 팀 경계 패턴"'));
 assert.ok(out.includes('P99와 XP14'));
});
test('existing pattern links get one badge while external links and images keep their labels',()=>{
 const out=transformMarkdown('[P14 흐름에 맞춘 권한과 팀 경계](../patterns/p14.md#s03) [P14 외부 자료](https://example.org/P14) ![P14 이미지](https://example.org/P14.png)');
 assert.equal((out.match(/class="pattern-badge"/g)||[]).length,1);
 assert.ok(out.includes('href="/patterns/p14/#s03"'));
 assert.ok(out.includes('[P14 외부 자료](https://example.org/P14)'));
 assert.ok(out.includes('![P14 이미지](https://example.org/P14.png)'));
});
test('pattern linking preserves code,raw HTML,headings and link definitions',()=>{
 const source='## P14 예시\n\n`P14`\n\n```text\nP14\n```\n\n<a href="https://example.org/P14">P14</a>\n\n<span data-pattern="P14"></span>\n\n[자료][ref]\n\n[ref]: https://example.org/P14';
 const out=transformMarkdown(source,{'P14 예시':'s01'});
 assert.ok(!out.includes('class="pattern-ref"'));
 assert.ok(out.includes('`P14`'));assert.ok(out.includes('```text\nP14\n```'));
 assert.ok(out.includes('<a href="https://example.org/P14">P14</a>'));
 assert.ok(out.includes('[ref]: https://example.org/P14'));
});
test('badge transformation is stable when an already generated reference is processed again',()=>{
 const first=transformMarkdown('P14는 책임 경계를 정한다.');
 assert.equal((first.match(/class="pattern-badge"/g)||[]).length,1);
 assert.equal(transformMarkdown(first),first);
});

test('links each section to its discussion on the book forum', () => {
 const out=transformMarkdown('# 제목\n\n## 첫 절\n\n본문.\n\n## 둘째 절\n\n더.',{'첫 절':'s01','둘째 절':'s02'},'manuscript/chapters/ch05.md','ch05');
 const links=[...out.matchAll(/<a class="forum-link" href="([^"]+)"[^>]*>이 절 토론하기<\/a>/g)].map(m=>m[1]);
 assert.deepEqual(links,[
  'https://roboco.io/the-software-factory-demo/#/book/ch05?anchor=s01',
  'https://roboco.io/the-software-factory-demo/#/book/ch05?anchor=s02',
 ]);
 // 링크는 절 제목 바로 다음에 오고, 사이트 검색 색인에서는 제외한다.
 assert.ok(/## 첫 절\n\n<p data-pagefind-ignore><a class="forum-link"/.test(out));
 // 문서 ID 없이 변환하면(이전 호출 방식) 링크를 넣지 않는다.
 assert.ok(!transformMarkdown('## 첫 절\n\n본문.',{'첫 절':'s01'}).includes('forum-link'));
});
test('forum link accessible name starts with the visible text and escapes the heading', () => {
 const out=transformMarkdown('## A & "B" <C>\n\n본문.',{'A & "B" <C>':'s01'},'manuscript/chapters/ch01.md','ch01');
 assert.ok(out.includes('aria-label="이 절 토론하기: A &amp; &quot;B&quot; &lt;C&gt;"'));
});
test('a pattern page has one forum link to its section in the patterns document', () => {
 const out=transformMarkdown('# P03 실행 가능한 계약\n\n상태: 초고\n\n## 상황\n\n본문.\n\n## 해법\n\n더.',{'상황':'s01','해법':'s02'},'manuscript/patterns/p03.md','p03');
 const links=[...out.matchAll(/<a class="forum-link" href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(m=>[m[1],m[2]]);
 // 포럼은 패턴 15개를 문서 patterns 하나로 묶고 패턴 하나를 절 하나(앵커 pNN)로 다룬다.
 assert.deepEqual(links,[['https://roboco.io/the-software-factory-demo/#/book/patterns?anchor=p03','이 패턴 토론하기']]);
 assert.ok(out.startsWith('<p data-pagefind-ignore><a class="forum-link"'));
 // 패턴 안의 절 앵커는 그대로 출력한다.
 assert.ok(out.includes('<span id="s02" data-reading-anchor'));
});
test('preface and demo pages keep one forum link per section', () => {
 for(const [path,id] of [['manuscript/front-matter/00-preface.md','preface'],['manuscript/demo/request.md','demo-request']]){
  const out=transformMarkdown('## 첫 절\n\n본문.',{'첫 절':'s01'},path,id);
  assert.ok(out.includes(`href="https://roboco.io/the-software-factory-demo/#/book/${id}?anchor=s01"`));
  assert.ok(!out.includes('이 패턴 토론하기'));
 }
});
