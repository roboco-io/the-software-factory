import {test,expect,type Page,type BrowserContext} from '@playwright/test';
const consentKey='software-factory.analytics.v1';
async function mockAnalytics(page:Page,context:BrowserContext){
 const requests:string[]=[];
 await context.route(/https:\/\/(?:[^/]+\.)?(?:googletagmanager\.com|google-analytics\.com)\//,async route=>{requests.push(route.request().url());await route.fulfill({contentType:'text/javascript',body:'window.__gaMockLoaded = true;'});});
 await page.route('**/*',async route=>{
  if(route.request().isNavigationRequest()&&route.request().resourceType()==='document'){
   const response=await route.fetch();const body=(await response.text()).replace(/data-measurement-id(?:="[^"]*")?/,'data-measurement-id="G-TEST123456"').replace(/data-site-host="[^"]*"/,`data-site-host="${new URL(route.request().url()).hostname}"`);
   await route.fulfill({response,body});
  }else await route.fallback();
 });return requests;
}
async function events(page:Page){return page.evaluate(()=>((window as any).dataLayer??[]).map((a:any)=>Array.from(a)).filter((a:any)=>a[0]==='event'));}
test('no Google load before consent or after refusal; withdrawal preserves reader data and homepage cookies',async({page,context})=>{
 const requests=await mockAnalytics(page,context);await page.goto('/book/ch01/?email=private#s02');
 await expect(page.locator('[data-analytics-banner]')).toBeVisible();expect(requests).toEqual([]);
 await page.getByRole('button',{name:'동의하지 않음',exact:true}).click();await page.locator('[data-mark-read]').first().click();await expect(page.locator('[data-current-status]')).toHaveText('읽음');expect(requests).toEqual([]);
 await page.getByRole('button',{name:'통계 설정',exact:true}).click();await page.getByRole('button',{name:'통계 수집에 동의',exact:true}).click();await expect.poll(()=>requests.length).toBe(1);
 const calls=await events(page);expect(calls.filter((a:any)=>a[1]==='page_view')).toHaveLength(0);
 const configs=await page.evaluate(()=>((window as any).dataLayer??[]).map((a:any)=>Array.from(a)).filter((a:any)=>a[0]==='config'));expect(configs).toHaveLength(1);expect((configs[0][2] as any).send_page_view).toBe(true);expect((configs[0][2] as any).page_location).not.toContain('?');expect((configs[0][2] as any).page_location).not.toContain('#');expect(calls.filter((a:any)=>a[1]==='chapter_mark_read')).toHaveLength(0);
 const origin=new URL(page.url()).origin;await context.addCookies([{name:'sfbook_ga',value:'book-cookie',url:origin},{name:'_ga',value:'homepage-cookie',url:origin}]);
 await page.getByRole('button',{name:'통계 설정',exact:true}).click();await page.getByRole('button',{name:'동의하지 않음',exact:true}).click();await page.waitForLoadState('load');
 await expect(page.locator('[data-analytics-status]')).toHaveText('통계 수집 거절됨');await expect(page.locator('[data-current-status]')).toHaveText('읽음');expect(requests).toHaveLength(1);
 const cookies=await context.cookies(origin);expect(cookies.some(c=>c.name==='sfbook_ga')).toBeFalsy();expect(cookies.some(c=>c.name==='_ga')).toBeTruthy();
});
test('explicit recommendation and reading actions send only allowed fields and restored answers do not count again',async({page,context})=>{
 await mockAnalytics(page,context);await page.addInitScript(k=>{if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({version:1,choice:'granted',updatedAt:Date.now()}));},consentKey);
 await page.goto('/guide/');await page.getByLabel('결과 품질·검증',{exact:true}).check();await page.getByRole('button',{name:'다음 질문',exact:true}).click();await page.getByLabel('팀 리더·실무 책임자',{exact:true}).check();await page.getByRole('button',{name:'다음 질문',exact:true}).click();await page.getByLabel('관련 장 정독하기',{exact:true}).check();await page.getByRole('button',{name:'추천 경로 보기',exact:true}).click();
 const complete=(await events(page)).find((a:any)=>a[1]==='guide_complete');expect(complete?.[2].chapter_count).toBe(5);expect(Object.keys(complete![2] as any).sort()).toEqual(['chapter_count','page_location']);
 await page.locator('[data-recommendations] a').first().evaluate(el=>el.addEventListener('click',e=>e.preventDefault()));await page.locator('[data-recommendations] a').first().click();expect((await events(page)).some((a:any)=>a[1]==='recommendation_open')).toBeTruthy();
 await page.reload();await expect(page.locator('#recommendation-result')).toBeVisible();expect((await events(page)).some((a:any)=>a[1]==='guide_complete')).toBeFalsy();
 await page.goto('/book/ch07/');await page.locator('[data-mark-read]').first().click();const read=(await events(page)).find((a:any)=>a[1]==='chapter_mark_read');expect(read?.[2].chapter_id).toBe('ch07');
 await page.locator('.book-footer a[href*="/issues"]').evaluate(el=>el.addEventListener('click',e=>e.preventDefault()));await page.locator('.book-footer a[href*="/issues"]').click();expect((await events(page)).some((a:any)=>a[1]==='outbound_click')).toBeFalsy();
});
test('storage rejection leaves reading usable and requires a fresh choice on navigation',async({page,context})=>{
 const requests=await mockAnalytics(page,context);await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}});Object.defineProperty(document,'cookie',{get(){return '';},set(){}});});
 await page.goto('/book/ch01/');await page.getByRole('button',{name:'통계 수집에 동의',exact:true}).click();await expect.poll(()=>requests.length).toBe(1);await page.locator('[data-mark-read]').first().click();await expect(page.locator('[data-current-status]')).toHaveText('읽음');
 await page.goto('/');await expect(page.locator('[data-analytics-banner]')).toBeVisible();expect(requests).toHaveLength(1);
});
test('cookie-backed withdrawal reaches another tab even when localStorage is blocked',async({page,context})=>{
 await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}}));
 await mockAnalytics(page,context);await page.goto('/');await page.getByRole('button',{name:'통계 수집에 동의',exact:true}).click();await expect(page.locator('[data-google-analytics]')).toHaveCount(1);
 const other=await context.newPage();await mockAnalytics(other,context);await other.goto('/privacy/');await expect(other.locator('[data-analytics-status]')).toHaveText('통계 수집 동의됨');
 await other.getByRole('button',{name:'통계 설정',exact:true}).click();await other.getByRole('button',{name:'동의하지 않음',exact:true}).click();
 await expect(page.locator('[data-analytics-status]')).toHaveText('통계 수집 거절됨');await expect(page.locator('[data-google-analytics]')).toHaveCount(0);
});
