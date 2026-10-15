import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const demos=JSON.parse(readFileSync(new URL('../../demo-pages.json',import.meta.url),'utf8'));

test('all authored demo explanations are public, responsive, and separate from chapter reading progress',async({page})=>{
 for(const demo of demos){
  await page.goto(`/${demo.route}/`);
  await expect(page.locator('h1')).toHaveText(demo.title);
  const article=page.locator('.book-article');
  await expect(article).toBeVisible();
  expect(await article.locator('h2').count()).toBeGreaterThan(0);
  expect(await article.locator('a[href^="/book/"]').count()).toBeGreaterThan(0);
  await expect(page.locator('[data-reader-id]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width+1);
 }
 await page.goto('/sources/');
 for(const demo of demos)await expect(page.locator(`#refs-${demo.id}`)).toHaveCount(1);
 await page.goto('/book/ch09/');
 await expect(page.locator('[data-reader-id="ch09"]')).toHaveCount(1);
});
