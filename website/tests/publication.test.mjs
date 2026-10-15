import { test } from 'node:test';
import assert from 'node:assert/strict';
import {publicLink,transformMarkdown} from '../scripts/publication.mjs';
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
});
