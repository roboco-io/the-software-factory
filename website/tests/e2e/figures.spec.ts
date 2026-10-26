import {test,expect} from '@playwright/test';
test('policy figures load at chapter width and keep a link to the scalable original',async({page})=>{
 for(const [chapter,name] of [['ch03','policy-hierarchy'],['ch09','harness-policy-cycle']]){
  await page.goto(`/book/${chapter}/`);const img=page.locator(`img[src="/diagrams/${name}.svg"]`);await img.scrollIntoViewIfNeeded();await img.evaluate((el:HTMLImageElement)=>el.decode());
  expect(await img.evaluate((el:HTMLImageElement)=>el.naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width+1);
  const original=page.getByRole('link',{name:'다이어그램 크게 보기',exact:true}).and(page.locator(`a[href="/diagrams/${name}.svg"]`));
  await expect(original).toHaveCount(1);
  await expect(original).toHaveAttribute('href',`/diagrams/${name}.svg`);
 }
});
