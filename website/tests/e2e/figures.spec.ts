import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const diagramCatalog=JSON.parse(readFileSync(new URL('../../../manuscript/figures/catalog.json',import.meta.url),'utf8')) as {file:string}[];
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

test('diagram arrowheads clear the cards and retain a visible connector shaft',async({page})=>{
 const issues:{file:string;detail:string}[]=[];
 let arrowCount=0;
 for(const {file} of diagramCatalog){
  await page.goto(`/diagrams/${file}`);
  const found=await page.evaluate(()=>{
   const svg=document.querySelector('svg')!;
   const rects=[...svg.querySelectorAll('rect')].filter(r=>r.getAttribute('stroke')&&r.getAttribute('fill')!=='none');
   const failures:string[]=[];
   for(const path of svg.querySelectorAll<SVGPathElement>('path[marker-end]')){
    const markerId=path.getAttribute('marker-end')!.match(/#([^)]+)/)![1];
    const marker=svg.querySelector<SVGMarkerElement>(`marker[id="${markerId}"]`)!;
    const length=path.getTotalLength(),end=path.getPointAtLength(length),near=path.getPointAtLength(Math.max(0,length-.1));
    const norm=Math.hypot(end.x-near.x,end.y-near.y),dx=(end.x-near.x)/norm,dy=(end.y-near.y)/norm;
    const scale=marker.getAttribute('markerUnits')==='userSpaceOnUse'?1:Number.parseFloat(getComputedStyle(path).strokeWidth);
    const head=Number(marker.getAttribute('markerWidth'))*scale;
    if(!Number.isFinite(head)||head<=0||!Number.isFinite(dx)||!Number.isFinite(dy)){
     failures.push(`invalid arrow geometry: ${path.getAttribute('d')}`);continue;
    }
    const tipOffset=(Number(marker.getAttribute('markerWidth'))-Number(marker.getAttribute('refX')))*scale;
    // Test a point just inside the visible tip, including the default stroke-width scaling.
    const tip={x:end.x+(tipOffset-1)*dx,y:end.y+(tipOffset-1)*dy};
    if(rects.some(r=>{const b=r.getBBox();return tip.x>b.x+1&&tip.x<b.x+b.width-1&&tip.y>b.y+1&&tip.y<b.y+b.height-1;}))failures.push(`arrowhead overlaps a card: ${path.getAttribute('d')}`);
    if(!/[CQSA]/i.test(path.getAttribute('d')!)){
     let straight=0;
     for(let distance=1;distance<=Math.min(length,head+10);distance++){
      const p=path.getPointAtLength(length-distance),cross=Math.abs((end.x-p.x)*dy-(end.y-p.y)*dx);
      if(cross>.5)break;
      straight=distance;
     }
     if(straight<head+8)failures.push(`arrowhead consumes the connector shaft: ${path.getAttribute('d')}`);
    }
   }
   return {failures,count:svg.querySelectorAll('path[marker-end]').length};
  });
  arrowCount+=found.count;
  issues.push(...found.failures.map(detail=>({file,detail})));
 }
 expect(arrowCount).toBeGreaterThan(0);
 expect(issues).toEqual([]);
});
