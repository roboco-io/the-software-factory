import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import {readFileSync} from 'node:fs';
const book=JSON.parse(readFileSync(new URL('./src/data/book.json',import.meta.url),'utf8'));
export default defineConfig({
 site:process.env.SITE_URL||book.release.site_url,
 trailingSlash:'always',
 integrations:[starlight({
  title:'The Software Factory',description:'소프트웨어 팩토리와 AI 시대의 조직 설계',defaultLocale:'root',locales:{root:{label:'한국어',lang:'ko'}},
  favicon:'/favicon.svg',credits:false,disable404Route:true,
  sidebar:[{label:'책의 첫 페이지',link:'/'},{label:'나에게 필요한 장 찾기',link:'/guide/'},{label:'전체 목차',link:'/contents/'},{label:'서문',slug:'book/preface'},...book.parts.map((title,index)=>({label:title,collapsed:true,items:book.chapters.filter(c=>c.part===index+1).map(c=>({slug:c.route}))})),{label:'패턴 사전',items:[{label:'패턴 둘러보기',link:'/patterns/'},...book.patterns.map(p=>({slug:p.route}))],collapsed:true},{label:'참고문헌',slug:'sources'},{label:'릴리즈 노트',slug:'releases'},{label:'책 소개와 읽기 설정',link:'/about/'}],
  components:{MarkdownContent:'./src/components/BookContent.astro',Footer:'./src/components/BookFooter.astro',PageTitle:'./src/components/PageTitle.astro'},
  customCss:['./src/styles/book.css'],tableOfContents:{minHeadingLevel:2,maxHeadingLevel:2},
 })],
});
