/** @typedef {{purpose:keyof typeof purposeLabels,role:keyof typeof roleLabels,depth:keyof typeof depthLabels}} Answers */
export const PURPOSES = ['adoption','quality','authority','team','ownership','intro'];
export const ROLES = ['executive','manager','lead','product','other'];
export const DEPTHS = ['overview','focused','full'];
export const purposeLabels = {adoption:'AI 도입·투자 판단',quality:'결과 품질·검증',authority:'실행 권한·책임',team:'팀 병목·협업',ownership:'사람의 오너십·학습',intro:'전체 개념 이해'};
export const roleLabels = {executive:'경영진·임원',manager:'부서장·개발 관리자',lead:'팀 리더·실무 책임자',product:'제품·사업 책임자',other:'기타·응답 생략'};
export const depthLabels = {overview:'핵심 판단만 훑기',focused:'관련 장 정독하기',full:'전체 흐름 따라가기'};
const routes = {adoption:[1,9,17,18,20],quality:[5,7,8,11,12],authority:[3,5,9,12],team:[6,9,14,15],ownership:[9,13,16,17],intro:[1,2,3,4]};
const focus = {executive:[9,17,18,20],manager:[6,9,14,15,16],lead:[5,7,8,11,12],product:[2,5,7,17,18],other:[]};
/** @returns {Answers} */
export function normalizeAnswers(input={}) {
 return {purpose:PURPOSES.includes(input?.purpose)?input.purpose:'intro',role:ROLES.includes(input?.role)?input.role:'other',depth:DEPTHS.includes(input?.depth)?input.depth:'focused'};
}
export function recommend(input={}) {
 const answers=normalizeAnswers(input),chapters=[...routes[answers.purpose]];
 return {...answers,chapters,emphasis:chapters.filter(n=>focus[answers.role].includes(n)),fullBook:answers.depth==='full'};
}
