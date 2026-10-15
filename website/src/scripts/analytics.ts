import {createAnalytics,CONSENT_KEY,CONSENT_TTL,safePageUrl} from '../lib/analytics.mjs';
type AnalyticsWindow=Window&{dataLayer?:unknown[];gtag?:(...args:unknown[])=>void};
const win=window as AnalyticsWindow;
const root=document.querySelector<HTMLElement>('[data-analytics-root]');
if(root){
 const measurementId=root.dataset.measurementId??'',siteHostname=root.dataset.siteHost??'';
 const banner=root.querySelector<HTMLElement>('[data-analytics-banner]')!;
 const status=root.querySelector<HTMLElement>('[data-analytics-status]')!;
 const open=root.querySelector<HTMLButtonElement>('[data-analytics-open]')!;
 let loaded=false;
 const gtag=(...args:unknown[])=>win.gtag?.(...args);
 let consentChannel:BroadcastChannel|undefined;try{consentChannel=new BroadcastChannel('software-factory.analytics-consent');}catch{/* optional cross-tab notification */}
 function eraseAnalyticsCookies(){
  const parts=location.hostname.split('.');
  const domains=['',...parts.slice(0,-1).map((_,i)=>'.'+parts.slice(i).join('.'))];
  for(const cookie of document.cookie.split(';')){
   const name=cookie.trim().split('=')[0];if(!/^sfbook_ga(?:_|$)/.test(name))continue;
   for(const domain of domains)document.cookie=`${name}=; Max-Age=0; Path=/;${domain?' Domain='+domain+';':''} SameSite=Lax`;
  }
 }
 const cookieName=(key:string)=>key===CONSENT_KEY?'sfbook_consent':'sfbook_consent_probe';
 const backupStorage={
  getItem(key:string){const name=cookieName(key)+'=',raw=document.cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(name))?.slice(name.length);return raw?decodeURIComponent(raw):null;},
  setItem(key:string,value:string){const seconds=key===CONSENT_KEY?Math.max(0,Math.ceil((JSON.parse(value).updatedAt+CONSENT_TTL-Date.now())/1000)):60;document.cookie=`${cookieName(key)}=${encodeURIComponent(value)}; Max-Age=${seconds}; Path=/; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;if(this.getItem(key)!==value)throw Error('Consent cookie unavailable');},
  removeItem(key:string){document.cookie=`${cookieName(key)}=; Max-Age=0; Path=/; SameSite=Lax`;}
 };
 const analytics=createAnalytics({measurementId,hostname:location.hostname,siteHostname,getStorage:()=>localStorage,getBackupStorage:()=>backupStorage,
  enable(){
   loaded=true;Reflect.set(win,`ga-disable-${measurementId}`,false);win.dataLayer=[];
   win.gtag=function(){win.dataLayer!.push(arguments);};
   gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   gtag('js',new Date());
   gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   const page=safePageUrl(location.href);
   let referrer='';try{referrer=new URL(document.referrer).origin;}catch{/* no valid referrer */}
   gtag('config',measurementId,{send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:page,page_referrer:referrer,cookie_prefix:'sfbook',cookie_domain:location.hostname,cookie_expires:15552000,cookie_update:false,cookie_flags:'SameSite=Lax;Secure'});
   const script=document.createElement('script');script.async=true;script.dataset.googleAnalytics='';script.src=`https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
   script.onerror=()=>{status.textContent='통계 도구를 불러오지 못했습니다. 독서는 계속할 수 있습니다.';};
   document.head.append(script);
  },
  disable(){
   Reflect.set(win,`ga-disable-${measurementId}`,true);win.dataLayer=[];eraseAnalyticsCookies();
   document.querySelector('[data-google-analytics]')?.remove();
   // Unload the SDK and its automatic listeners after consent withdrawal/expiry.
   if(loaded)location.reload();
  },
  send(name:string,data:Record<string,unknown>){gtag('event',name,{...data,page_location:safePageUrl(location.href)});}
 });
 function refresh(show=false){
  const state=analytics.sync();
  open.disabled=!state.configured;
  banner.hidden=!state.configured||(!show&&state.choice!==null);
  status.textContent=!state.configured?'통계 수집이 꺼져 있습니다.':state.choice==='granted'?'통계 수집 동의됨':state.choice==='denied'?'통계 수집 거절됨':'아직 선택하지 않았습니다.';
 }
 function choose(choice:'granted'|'denied'){analytics.choose(choice);consentChannel?.postMessage('changed');refresh();open.focus();}
 consentChannel?.addEventListener('message',()=>{analytics.sync(true);refresh();});
 root.querySelector('[data-analytics-allow]')!.addEventListener('click',()=>choose('granted'));
 root.querySelector('[data-analytics-deny]')!.addEventListener('click',()=>choose('denied'));
 open.addEventListener('click',()=>{refresh(true);root.querySelector<HTMLButtonElement>('[data-analytics-deny]')?.focus();});
 window.addEventListener('storage',event=>{if(event.key===CONSENT_KEY||event.key===null){analytics.sync(true);refresh();}});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
 window.addEventListener('book:analytics',event=>{const {name,data}=(event as CustomEvent).detail??{};analytics.track(name,data);});
 document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null;
  const link=target?.closest<HTMLAnchorElement>('a[href]');if(!link)return;
  let url:URL;try{url=new URL(link.href);}catch{return;}
  if(link.closest('[data-recommendations]')||link.matches('[data-route-continue],[data-route-next]')){
   const chapter=url.pathname.match(/^\/book\/(ch\d{2})\/$/)?.[1];if(chapter)analytics.track('recommendation_open',{chapter_id:chapter});
  }

 });
 refresh();
}
