/** @typedef {{purpose:keyof typeof purposeLabels,role:keyof typeof roleLabels,depth:keyof typeof depthLabels}} Answers */
export const PURPOSES = ['intro','intent','harness','quality','authority','security','team','ownership','adoption'];
export const ROLES = ['executive','manager','lead','product','platform','security','other'];
export const DEPTHS = ['overview','focused','full'];
export const purposeLabels = {intro:'전체 개념 이해',intent:'의도 정의·개선',harness:'하네스 운영·개선',quality:'결과 품질·검증',authority:'실행 권한·책임',security:'보안 대응·안전한 자동화',team:'팀 병목·협업',ownership:'사람의 오너십·학습',adoption:'AI 도입·투자 판단'};
export const purposeHints = {intro:'처음이거나 아직 무엇부터 읽을지 모르겠어요',intent:'무엇을 맡기고 어떤 결과를 받을지 정하고 싶어요',harness:'정책·실행·이력·개선이 이어지는 체계를 만들고 싶어요',quality:'완료 선언보다 믿을 수 있는 증거가 필요해요',authority:'누가 무엇을 결정하고 책임지는지 정하고 싶어요',security:'수정 대기를 줄이면서 권한과 품질을 지키고 싶어요',team:'판단 대기·인수인계·재작업을 줄이고 싶어요',ownership:'사람이 판단하고 배우며 책임지게 하고 싶어요',adoption:'어디서 시작하고 언제 확대할지 판단하고 싶어요'};
export const roleLabels = {executive:'경영진·임원',manager:'부서장·개발 관리자',lead:'팀 리더·실무 책임자',product:'제품·사업 책임자',platform:'플랫폼·하네스 운영자',security:'보안·위험 관리 책임자',other:'기타·응답 생략'};
export const depthLabels = {overview:'핵심 판단만 훑기',focused:'관련 장 정독하기',full:'추천 뒤 전체 20장 읽기'};
/** @type {Record<keyof typeof purposeLabels,{chapters:number[],summary:string,reasons:Record<number,string>,resources:{id:string,reason:string}[]}>} */
const routes = {
 intro:{chapters:[1,2,3,9,19],summary:'팩토리의 전체 그림에서 출발해 의도와 정책을 나누고, 운영 책임과 개선 루프를 연결합니다.',reasons:{1:'모델·에이전트·하네스와 팩토리의 세 핵심을 먼저 구분합니다.',2:'달성할 결과와 이유를 실행 중에도 유지할 기준으로 만듭니다.',3:'최상위 원칙과 적용 범위별 정책, 바꿀 수 있는 계획을 나눕니다.',9:'하네스 사이클과 제품·정책·운영의 책임을 연결합니다.',19:'실패를 의도·지침·집행의 다음 개선으로 돌려보냅니다.'},resources:[{id:'demo-index',reason:'책의 공통 예제를 질문별 흐름으로 살펴봅니다.'}]},
 intent:{chapters:[1,2,3,4,5],summary:'원하는 결과를 정한 뒤, 정책과 실행계획을 나누고 수행·검증에 쓸 계약으로 구체화합니다.',reasons:{1:'코드 생성량보다 달성할 업무 결과를 선택합니다.',2:'의도 정의와 피드백을 잇는 지속적인 기준을 만듭니다.',3:'보존할 원칙·지침과 위임할 수행 방법을 분리합니다.',4:'실행 결과가 다음 의도와 하네스 판단으로 돌아오게 합니다.',5:'입력·출력·권한·완료 증거·예외를 실행 계약에 연결합니다.'},resources:[{id:'demo-request',reason:'요청을 정리하는 일과 실행을 승인하는 일을 구분해 봅니다.'}]},
 harness:{chapters:[3,9,10,11,19],summary:'정책을 작업 지침으로 정하고, 실행 기반·지식·조합 평가를 연결해 이력에서 하네스를 개선합니다.',reasons:{3:'검증을 넘어 작업 전체에 적용할 정책 계층과 변경 권한을 정합니다.',9:'정책·계획과 집행·실행 이력·모니터링의 책임을 연결합니다.',10:'에이전트에게 공급할 지식의 출처·신선도·갱신 책임을 정합니다.',11:'모델·에이전트·하네스 조합을 실제 업무 기준으로 평가합니다.',19:'모호한 지침의 보완과 명확한 지침의 집행 개선을 구분합니다.'},resources:[{id:'demo-execution-authority',reason:'계획과 결과가 실행·게시의 권한 경계를 건너는 방식을 봅니다.'},{id:'demo-improvement',reason:'개선 후보·허용 변경·평가의 연결과 한계를 읽습니다.'}]},
 quality:{chapters:[5,7,8,11,12],summary:'맡길 조건과 완료 증거를 정한 뒤, 예외·조합 평가·실제 반영 권한까지 검증을 연결합니다.',reasons:{5:'무엇을 받아야 완료인지 수행 전에 계약으로 정합니다.',7:'판정자와 수용 책임자를 나누고 완료 주장을 증거와 대조합니다.',8:'검사 불능·예외·실패를 중단과 복구 판단으로 연결합니다.',11:'검토 조합이 숨겨 둔 실패를 실제로 찾는지 평가합니다.',12:'검증한 변경 버전과 실제 반영·배포 권한을 맞춥니다.'},resources:[{id:'demo-evidence',reason:'수정 전후의 증거와 실행 오류·판정 조작의 한계를 읽습니다.'}]},
 authority:{chapters:[3,5,9,12],summary:'정책·계약·운영 역할을 구분하고, 증거에 따라 자동 진행과 사람의 예외 판단 경계를 정합니다.',reasons:{3:'원칙을 보존하며 하위 지침과 계획을 바꿀 권한을 나눕니다.',5:'맡길 작업의 허용 행동·자원·실패 처리 조건을 정합니다.',9:'제품 책임자·정책 책임자·하네스 운영자의 책임을 구분합니다.',12:'생성·게시·배포·경계 변경의 권한과 중단·회수를 설계합니다.'},resources:[{id:'demo-execution-authority',reason:'만드는 능력과 게시할 자격 증명을 분리하는 구조를 읽습니다.'},{id:'demo-policy-and-gate',reason:'변경 위험과 현재 증거를 반영 판단에 연결하는 예를 봅니다.'}]},
 security:{chapters:[18,7,12,17,19],summary:'보안 요구를 조건부 도입 동기로 검토하고, 수정 증거·위임 경계·대응 시간·재발 방지로 시험합니다.',reasons:{18:'수정·검증·배포 대기가 병목인지 확인하고 제한된 시험을 정합니다.',7:'수정이 실패 조건을 막았는지 증거로 판단하고 수용 책임을 남깁니다.',12:'긴급 수정도 사전 위임·예외·중단 경계 안에서 처리합니다.',17:'생성 속도 대신 전체 대응 시간·미해결 위험·품질·부담을 봅니다.',19:'보안 실패를 지침과 집행 개선으로 나누고 회귀·오탐을 확인합니다.'},resources:[{id:'demo-policy-and-gate',reason:'위험과 반영 권한의 예시입니다. 실제 조직의 보안·준법 효과를 입증한 사례는 아닙니다.'},{id:'demo-evidence',reason:'수정 증거의 확인 범위와 악의적인 판정 조작에 남는 한계를 봅니다.'}]},
 team:{chapters:[6,14,15,9],summary:'작업과 통합의 단위를 살핀 뒤 대기의 원인을 찾고, 업무 흐름에 맞춰 권한·팀 경계·운영 책임을 정합니다.',reasons:{6:'검증 가능한 작업 단위와 병렬화·통합 책임을 정합니다.',14:'줄여야 할 판단 대기·재설명·재작업과 필요한 탐색을 나눕니다.',15:'관찰한 병목에 맞춰 결정 권한과 팀 경계의 변경을 판단합니다.',9:'제품 팀과 공유 팩토리·하네스 운영의 책임을 연결합니다.'},resources:[]},
 ownership:{chapters:[7,9,13,16,17],summary:'사람에게 남는 수용·운영 책임을 구분하고, 역량 투자·판단과 학습·실제 책임 행동의 평가를 연결합니다.',reasons:{7:'자동 판정에서도 결과를 받아들일 사람의 책임을 명확히 합니다.',9:'제품·정책·운영의 역할마다 사람이 맡을 판단을 구분합니다.',13:'사람의 판단·학습과 실행 능력 구매·운영에 투자합니다.',16:'심리적 오너십·인지적 참여·책임 행동을 구분해 설계합니다.',17:'태도나 승인 횟수와 실제 대응·사용자 결과를 따로 평가합니다.'},resources:[]},
 adoption:{chapters:[1,9,17,18,20],summary:'투자할 업무 결과와 운영 책임을 정하고, 품질·전체 비용의 증거로 최초 도입과 확대를 판단합니다.',reasons:{1:'팩토리로 해결할 조직 문제와 성과 단위를 선택합니다.',9:'도입에 필요한 공유 기반과 제품 수용·운영 책임을 정합니다.',17:'활동량 대신 결과·품질·대기·인간 개입·전체 비용을 비교합니다.',18:'보안 요구 등 도입 동기를 가설로 삼아 기준선과 중단 조건을 정합니다.',20:'초기 성공을 새 업무·새 권한으로 확대할 추가 증거를 확인합니다.'},resources:[{id:'demo-index',reason:'코드 없이 공통 예제의 흐름과 확인 한계를 먼저 살펴봅니다.'}]},
};
const focus = {executive:[9,17,18,20],manager:[6,9,14,15,16,19],lead:[3,5,7,8,11,12],product:[2,5,7,9,17,18],platform:[3,9,10,19],security:[7,12,18,19],other:[]};
/** @returns {Answers} */
export function normalizeAnswers(input={}) {
 return {purpose:PURPOSES.includes(input?.purpose)?input.purpose:'intro',role:ROLES.includes(input?.role)?input.role:'other',depth:DEPTHS.includes(input?.depth)?input.depth:'focused'};
}
export function recommend(input={}) {
 const answers=normalizeAnswers(input),route=routes[answers.purpose],chapters=[...route.chapters];
 return {...answers,chapters,summary:route.summary,reasons:{...route.reasons},resources:route.resources.map(r=>({...r})),emphasis:chapters.filter(n=>focus[answers.role].includes(n)),fullBook:answers.depth==='full'};
}
