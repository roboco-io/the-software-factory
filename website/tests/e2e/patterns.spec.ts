import {test,expect} from '@playwright/test';

test('inline pattern badges explain the identifier and open the right dictionary entry',async({page})=>{
 await page.goto('/book/ch13/');
 const reference=page.locator('.book-article a.pattern-ref[href="/patterns/p14/"]').first();
 await expect(reference).toHaveAccessibleName('P14 흐름에 맞춘 권한과 팀 경계 패턴');
 await expect(reference.locator('.pattern-badge')).toHaveText('패턴');
 await expect(reference.locator('a')).toHaveCount(0);
 await reference.scrollIntoViewIfNeeded();
 await reference.focus();await expect(reference).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width+1);
 await reference.click();
 await expect(page).toHaveURL(/\/patterns\/p14\/$/);
 await expect(page.locator('h1')).toHaveText('P14 흐름에 맞춘 권한과 팀 경계');
 const related=page.locator('.book-article a.pattern-ref[href="/patterns/p04/"]');
 await expect(related).toHaveCount(1);await expect(related.locator('.pattern-badge')).toHaveText('패턴');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width+1);
});
