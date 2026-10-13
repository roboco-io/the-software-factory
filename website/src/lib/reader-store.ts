import {createProgressStore} from './progress.mjs';
export const progress=createProgressStore(()=>window.localStorage);
export function changed(){window.dispatchEvent(new Event('reader:change'));}
export const labels:Record<string,string>={unread:'안 읽음',reading:'읽는 중',read:'읽음',updated:'읽은 뒤 수정됨'};
