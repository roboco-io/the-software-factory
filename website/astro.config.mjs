import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import {readFileSync} from 'node:fs';
const book=JSON.parse(readFileSync(new URL('./src/data/book.json',import.meta.url),'utf8'));
export default defineConfig({
 site:process.env.SITE_URL||book.publication.site_url,
 trailingSlash:'always',
 integrations:[starlight({
  title:'The Software Factory',description:'소프트웨어 팩토리와 AI 시대의 조직 설계',defaultLocale:'root',locales:{root:{label:'한국어',lang:'ko'}},
  favicon:'/favicon.svg',credits:false,disable404Route:true,
  head:[
   {tag:'meta',attrs:{property:'og:image',content:new URL('/images/software-factory-social-ivory.png',book.publication.site_url).href}},
   {tag:'meta',attrs:{property:'og:image:type',content:'image/png'}},
   {tag:'meta',attrs:{property:'og:image:width',content:'1734'}},
   {tag:'meta',attrs:{property:'og:image:height',content:'907'}},
   {tag:'meta',attrs:{property:'og:image:alt',content:'The Software Factory — 소프트웨어 팩토리와 AI 시대의 조직 설계. 로보코 로고와 세 핵심을 연결한 아이보리 공유 이미지.'}},
   {tag:'meta',attrs:{name:'twitter:image',content:new URL('/images/software-factory-social-ivory.png',book.publication.site_url).href}},
   {tag:'meta',attrs:{name:'twitter:image:alt',content:'The Software Factory 책 공유 이미지'}},
  ],

  sidebar:[{label:'책의 첫 페이지',link:'/'},{label:'나에게 필요한 장 찾기',link:'/guide/'},{label:'전체 목차',link:'/contents/'},{label:'서문',slug:'book/preface'},...book.parts.map((title,index)=>({label:title,collapsed:true,items:book.chapters.filter(c=>c.part===index+1).map(c=>({slug:c.route}))})),{label:'패턴 사전',items:[{label:'패턴 둘러보기',link:'/patterns/'},...book.patterns.map(p=>({slug:p.route}))],collapsed:true},{label:'참고문헌',slug:'sources'},{label:'체인지 로그',slug:'changelog'},{label:'책 소개와 읽기 설정',link:'/about/'}],
  components:{SiteTitle:'./src/components/BookSiteTitle.astro',MarkdownContent:'./src/components/BookContent.astro',Footer:'./src/components/BookFooter.astro',PageTitle:'./src/components/PageTitle.astro'},
  customCss:['./src/styles/book.css'],tableOfContents:{minHeadingLevel:2,maxHeadingLevel:2},
 })],
});
