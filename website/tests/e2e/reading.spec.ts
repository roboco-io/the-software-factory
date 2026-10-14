import {test,expect} from '@playwright/test';
const key='software-factory.reader.v1';
test('recommend, mark read, resume after reopening, revise answers without losing progress',async({page,context})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/guide/');await page.getByLabel('결과 품질·검증',{exact:true}).check();await page.getByRole('button',{name:'다음 질문',exact:true}).click();
 await page.getByLabel('팀 리더·실무 책임자',{exact:true}).check();await page.getByRole('button',{name:'다음 질문',exact:true}).click();
 await page.getByLabel('관련 장 정독하기',{exact:true}).check();await page.getByRole('button',{name:'추천 경로 보기'}).click();
 await expect(page.locator('[data-recommendations] li')).toHaveCount(5);await expect(page.locator('[data-role-description]')).toContainText('팀 리더');
 await page.locator('[data-recommendations] a').nth(1).click();await expect(page).toHaveURL(/book\/ch07/);await expect(page.locator('[data-current-status]')).toHaveText('읽는 중');
 await page.locator('[data-mark-read]').first().click();await expect(page.locator('[data-current-status]')).toHaveText('읽음');
 await page.locator('#s04').scrollIntoViewIfNeeded();await page.waitForTimeout(350);
 const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),key);expect(saved.chapters.ch07.anchor).toMatch(/^s/);
 const other=await context.newPage();await other.goto('/');await expect(other.locator('[data-resume-home]')).toBeVisible();await other.locator('[data-resume-link]').click();await expect.poll(()=>other.evaluate(()=>scrollY)).toBeGreaterThan(200);
 await other.goto('/guide/');await expect(other.locator('[data-route-progress]')).toHaveText('추천 경로 1/5장 읽음');await other.getByRole('button',{name:'답변 바꾸기'}).click();await expect(other.getByRole('radio',{name:'결과 품질·검증',exact:true})).toBeChecked();
 await other.getByLabel('팀 병목·협업',{exact:true}).check();await other.getByRole('button',{name:'다음 질문',exact:true}).click();await other.getByRole('button',{name:'다음 질문',exact:true}).click();await other.getByRole('button',{name:'추천 경로 보기'}).click();
 await other.goto('/contents/');await expect(other.locator('[data-chapter-status="ch07"]')).toHaveText('읽음');expect(errors).toEqual([]);
});
test('reset and saving off work across tabs, direct anchors take priority',async({page,context})=>{
 await page.goto('/book/ch01/');await page.locator('[data-mark-read]').first().click();
 const settings=await context.newPage();await settings.goto('/about/');await settings.locator('[data-reset-request]').click();await settings.locator('[data-reset-confirmed]').click();await expect(page.locator('[data-current-status]')).toHaveText('안 읽음');
 await settings.locator('[data-saving-toggle]').uncheck();await expect(page.locator('[data-mark-read]').first()).toBeDisabled();
 await page.goto('/book/ch07/?resume=1#s04');await expect(page.locator('[data-mark-read]').first()).toBeDisabled();
 await expect.poll(()=>page.locator('#s04').evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(220);
 await settings.reload();await expect(settings.locator('[data-saving-toggle]')).not.toBeChecked();
});
test('storage denial keeps reading and questions usable',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}}));
 await page.goto('/book/ch07/');await expect(page.getByRole('heading',{level:1})).toContainText('증거로 완료');await expect(page.locator('[data-storage-notice]')).toContainText('저장을 허용하지');
 await page.locator('[data-mark-read]').first().click();await expect(page.locator('[data-current-status]')).toHaveText('읽음');
 await page.goto('/guide/');await page.getByRole('button',{name:'다음 질문',exact:true}).click();await expect(page.locator('[data-quiz-error]')).toContainText('선택지');
});
test('layout fits the viewport and keyboard can reach the question choices',async({page},info)=>{
 await page.goto('/');await expect(page.getByRole('heading',{level:1})).toHaveText('The SoftwareFactory');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.screenshot({path:`test-results/home-${info.project.name}.png`,fullPage:true});
 await page.goto('/guide/');await page.locator('input[name="purpose"]').first().focus();await page.keyboard.press('Space');await expect(page.locator('input[name="purpose"]').first()).toBeChecked();
 await page.screenshot({path:`test-results/guide-${info.project.name}.png`,fullPage:true});
 for(const id of ['ch07','ch09']){await page.goto(`/book/${id}/`);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();await page.screenshot({path:`test-results/chapter-${id}-${info.project.name}.png`,fullPage:false});}
});
test('Korean search and pattern identifiers resolve from the built index',async({page})=>{
 await page.goto('/');
 const results=await page.evaluate(async()=>{
  const url='/pagefind/'+'pagefind.js';const pf=await import(/* @vite-ignore */ url);
  const out:Record<string,number>={};for(const q of ['의도','실행 계약','P07','책임'])out[q]=(await pf.search(q)).results.length;
  return out;
 });for(const count of Object.values(results))expect(count).toBeGreaterThan(0);
});
test('chapter resume button preserves the previous section offset',async({page})=>{
 await page.goto('/');await page.evaluate(k=>localStorage.setItem(k,JSON.stringify({version:1,enabled:true,chapters:{ch07:{status:'reading',revision:'1',anchor:'s04',offset:.5}},last:'ch07',answers:null,fontSize:'normal'})),key);
 await page.goto('/book/ch07/');const expected=await page.evaluate(()=>{const a=document.getElementById('s04')!,b=document.getElementById('s05')!;return a.getBoundingClientRect().top+scrollY+(b.getBoundingClientRect().top-a.getBoundingClientRect().top)*.5-120;});
 await page.locator('[data-resume-current]').click();await expect.poll(async()=>Math.abs((await page.evaluate(()=>scrollY))-expected)).toBeLessThan(40);
});
