import {test,expect} from '@playwright/test';

test('each chapter opens with a short TL;DR without marking the chapter read',async({page})=>{
 for(let n=1;n<=20;n++){
  await page.goto(`/book/ch${String(n).padStart(2,'0')}/`);
  const article=page.locator('.book-article');
  const heading=article.locator('h2').first();
  await expect(heading).toHaveText('TL;DR');
  const summary=article.getByRole('list').first();
  const count=await summary.locator(':scope > li').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(10);
  expect((await summary.innerText()).length).toBeLessThanOrEqual(1200);
  for(const item of await summary.locator(':scope > li').allTextContents())expect(item).not.toMatch(/^(핵심|주장|결정|확인)\s*[:：]/);
  await expect(page.locator('[data-current-status]')).not.toHaveText('읽음');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width+1);
 }
});
