# 데모 사례 후속 수정 검증 (r20261119a)

- 검증일: 2026-11-19. 검증자: 작성자와 다른 AI 에이전트. 독립 인간 리뷰나 저자 편집 확정이 아니다.
- 책 기준: 워크트리 `docs/demo-refresh-2026-11-19`, 기준 커밋 330816a, 미커밋 변경. 파일 해시는 [JSON](2026-11-19-demo-examples-verify-r20261119a.json)에 있다. 유지관리자 manifest의 33개 파일 해시가 현재 파일과 모두 일치해 읽는 동안 바뀐 파일은 없다.
- 플랫폼: 이전 확인 1a8d3f3a, 후보 0c1b2ecb(읽기 전용 체크아웃의 HEAD가 후보와 같음을 확인). 플랫폼을 설치·빌드·실행하지 않았다.

## 결론

열린 P0·P1은 없다. P2 3건, P3 3건을 남긴다. 유지관리자가 추가·변경한 사실 문장은 후보 커밋의 코드·문서·시험 기록과 대부분 일치하고, 게스트 심사·Dependabot 점검·전체 중지를 후보가 보여 주는 것보다 더 운영 중인 기능으로 쓴 곳은 없었다. P2는 모두 확인 범위의 서술 정밀도와 근거 링크의 대응에 관한 것이다.

## 직접 대조한 것

- 게스트 심사(request.md 13-17행, ch05 70행): `webhook.ts` qualifyGuest(작성자 본인, 봇·운영자 제외, `demo:guest` 라벨, `opened`), `triage-precheck.ts`(가입 기간, 계정당 하루 건수, 저장소의 하루 지출, 서식), `triage-verdict.ts`(형식·조항 불일치는 무효), `triage-service.ts`(검증 실패·모델 불가·시작 지연은 관리자로 넘김, 인용만 `starter.start`), `wrangler.jsonc` 46-51행(`GUEST_PROJECTS` 빈 값, 11-15 개방·11-17 폐쇄 주석), `docs/status.md` 18·102행과 일치한다. 전체 중지·`RUNS_ENABLED` 중 심사하지 않는다는 서술도 `webhook.ts` 228-232행과 일치한다.
- 전체 중지(recovery.md 9행, ch08 108행): `factory-switch.ts` 81-135행(상태 기록 후 활성 실행에 같은 중지 요청, 실패 건수 유지), `0009_factory_switch.sql`(수정·삭제 트리거), `operations.md` 272-282행(재시작 시 라벨을 다시 붙임)과 일치한다. 확인 범위(2026-11-14 익명 401, 로그인 후 버튼은 시험으로만)는 `status.md` 61·101행과 일치하고 플랫폼 소유자의 보고로 귀속되어 있다.
- Dependabot(policy-and-gate.md 13-15행, ch12 74행): `dependabot.ts` 판정 코드, `scheduled.ts` 31-34행(대상 비면 `null`), `wrangler.jsonc` 54-58행, `operations.md` 336-365행, `status.md` 89-91행과 일치한다. 서명 조건 위조 가능성 미확인, 실제 GitHub·예약 실행 없음(11-15 기준)도 정확하다.
- DNS 실험·인젝션 시험(execution-authority.md 33-39행, ch09 218행): 37개(15+22), 0건, 대조 조회 기록, 5건 중 4건·1건 실패, `curl` 3요청 거부, 모델 하나·문구당 1회, 하지 않은 시험 목록, 루트 실행이 `RESULTS.md` 두 건과 `status.md` 58-60·95-99행과 일치한다. 날짜(11-10, 11-11)와 귀속도 맞다.
- 예산·엔진(agent-selection.md 9-11·30행, ch11 89행): 한도 변경이 D1 최신 행 기준으로 다음 호출부터 적용(`d1-budget.ts` 59행, `issue-run.ts`·`outbound-budget.ts`의 호출별 `loadBudgetConfig`), 범위 0-100000과 401/403, Codex 경로의 모델 호출 전 실패와 pi 교체(`design.md` 21행, 커밋 40ca941), 확인 날짜와 `review_invalid` 첫 실패(`status.md` 47-49행)가 일치한다.
- 개선(improvement.md 9·33행): 거부한 모델 이름이 기록되지 않아 원인을 모른다는 서술과 성공률·리뷰 차단율 미측정·실행 20건이 `RESULTS.md` 55행, `status.md` 71·97·110행과 일치한다.
- 판본 혼합: 7개 재작성 페이지는 후보 링크만, 증거·지표 페이지는 11-09 링크만 쓴다. 해설 9개의 저장소 링크 48개가 각 커밋에 존재한다(직접 `git cat-file` 확인). 증거·지표가 가리키는 파일(`d1-repo.ts`, `read-repo.ts`, `usage-meter.ts`, `review-prompt.ts`, `review-verdict.ts`)은 후보에서 동일하고, `review-command.ts`(Anthropic 호환 설정)와 `decision.ts`(내보내기·집계 함수 추가)는 설명을 바꾸지 않는다는 유지관리자 판단에 동의한다.
- 근거 기록: `sources.json`은 165건을 유지하고 S157-S165의 기존 필드가 불변이다. 7개 `confirmed_editions`의 blob SHA 56개와 이전 SHA가 후보·1a8d3f3a와 일치한다. 삭제된 `codex-command.ts`는 11-09 판본의 근거 파일로 보존되어 있다.
- 웹: `content-manifest.json`의 revision이 바뀐 12개(해설 7, 5·8·9·11·12장)와 신규 앵커 `s04`가 변경 내용과 일치하고 기존 앵커는 그대로다. TL;DR 관리 파일의 사유 문구도 실제 변경과 맞는다. `check_project.py` PASS, `git diff --check` 출력 없음, `npm run build` PASS(TL;DR 20건, 공개 HTML 56쪽, 링크·앵커).
- CHANGELOG: '공개 예정' 구분과 날짜 없음은 changelog 정책 37행과 맞고, 귀속 문구도 정확하다.

## 열린 의견

### RV-V01 / P2 / 열림
- 위치: `manuscript/demo/execution-authority.md` 35행. 검증 버전: 0c1b2ec.
- 문제와 독자 영향: DNS 실험을 '37개 중 0건, 대조 조회는 기록'으로만 적었다. 플랫폼 기록은 확인 창이 약 2-3분 40초이고, 사전 확인용 조회가 16:32:44 이후 응답에서 사라져 로그 보존이 완전하다고 단정하지 않는다고 적는다. 또 실험 컨테이너는 에이전트·키 없이 모든 요청을 403으로 거부하는 출구로 시작했다. 이 한계가 빠지면 결과가 실제보다 강하게 읽힌다.
- 근거: `experiments/dns-exfil/RESULTS.md` 28행, 43행.
- 최소 수정: 위 두 가지를 한 문장으로 추가한다.
- 수용 조건: 문장이 28·43행과 일치한다.

### RV-V02 / P2 / 열림
- 위치: `manuscript/demo/execution-authority.md` 39행.
- 문제와 독자 영향: '예비 구현 엔진 ... 시험하지 않았다'가 인젝션 시험의 남은 범위임을 밝히지 않는다. agent-selection.md 30행은 같은 예비 엔진을 11-09에 실서비스에서 확인했다고 적으므로 두 페이지가 충돌하는 것처럼 읽힌다.
- 근거: `experiments/injection/RESULTS.md` 65행, `docs/status.md` 96행('인젝션 시험의 남은 범위'), 47행.
- 최소 수정: '인젝션 시험에서는'을 넣어 항목을 한정한다.
- 수용 조건: 두 페이지가 서로 모순되지 않는다.

### RV-V03 / P2 / 열림
- 위치: `policy-and-gate.md` 13·15행, `agent-selection.md` 9행, `execution-authority.md` 39행의 근거 표.
- 문제와 독자 영향: 문장의 내용이 든 파일을 표가 연결하지 않는다. Dependabot의 '실제 GitHub·예약 실행 없음, 가짜 GitHub 시험, 판정 규칙만 실제 PR 응답'과 'AI 리뷰를 하지 않는다'는 `operations.md`에만 있는데 표는 `status.md`를 '확인 상태'로 연결한다. `status.md`는 '동작하지 않는다'까지만 적는다. Codex에서 pi로의 교체는 `design.md`에만 있고 표에 없다. 출구 본문 검사의 범위는 `operations.md` '알려진 제약'에만 있다. 독자가 링크를 열어도 문장을 확인하지 못한다. 출처 기록(S159·S162·S163)에는 이 파일들이 들어 있어 페이지 쪽 누락이다.
- 근거: `docs/operations.md` 358·359·365행, `docs/design.md` 21행, `docs/status.md` 89-91행.
- 최소 수정: 해당 표에 `operations.md` 또는 `design.md` 행을 더하거나 문장에 출처 문서명을 적는다.
- 수용 조건: 각 문장의 근거 파일이 같은 페이지에서 열린다.

### RV-V04 / P3 / 열림
- 위치: `manuscript/chapters/ch03.md` 184-186행(미변경).
- 문제: '보호 경로와 T3의 사람 판단 조건은 프로그램에도 남긴다'가 유지되는데, Dependabot 경로는 저장소 정책이 T3으로 둔 의존성 파일도 예외로 병합한다(비활성). 사례 지도는 정책 영향을 3·12장으로 적었다. 186행이 우회 경로 확인을 이미 요구하므로 큰 오해는 아니다.
- 근거: `docs/operations.md` 358행.
- 최소 수정: 정책 해설 링크 한 문장 추가, 또는 변경하지 않는 사유를 기록한다.

### RV-V05 / P3 / 열림
- 위치: `manuscript/demo/recovery.md` 30행.
- 문제: '중지 요청과 병합이 거의 동시에 일어날 때의 순서' 미시험 항목은 `status.md` 78행이 4절(포털과 인증)의 실행별 중지로 적은 것인데 '전체 중지에 대해' 단락에 놓였다. 전체 중지가 같은 경로를 재사용하므로 틀리지는 않지만 귀속이 어긋난다.
- 최소 수정: '실행별 중지(전체 중지가 재사용)'로 쓴다.

### RV-V06 / P3 / 열림
- 위치: `ch01.md` 79행, `00-preface.md` 43행, `about.astro`, `README.md` 71행.
- 문제: '페이지 응답은 확인했다'는 문장에 날짜가 없다. 실제 확인은 11-09이고 이번에 다시 확인하지 않았다(`demo/index.md` 34행이 이를 밝힘). ch01·서문은 기준일 문구가 바뀌었으나 독서 revision을 올리지 않았다. 유지관리자 보고서의 저자 판단 5와 같은 항목이다.
- 최소 수정: 날짜를 명시하거나 저자 결정을 기록한다.

## 누락 점검과 의견이 없는 영역

- 장·패턴 점검: `manuscript/` 전체에서 S157-S165와 플랫폼 URL을 쓰는 곳을 훑었다. 후보로 부정확해졌는데 유지관리자가 두지 않은 곳은 RV-V04 외에 찾지 못했다. ch07·ch17·ch19와 패턴은 후보 변경이 설명을 바꾸지 않는다. 후보의 `design.md` 추가 문단(분류는 라벨, 계획 단계 없음, 배포·완료 검증은 대상 저장소 CI, 수정 요청은 사람에게 이관)은 책의 D-1 설명·소개 페이지의 한계 서술과 모순되지 않는다.
- 도표 2개: 운영자 경로·권한 경계를 그리며 후보에서도 맞고, 범위 밖 경로를 소개의 그림 설명에 적었다. 의견 없음.
- 증거·지표 페이지의 11-09 유지: 위 근거로 수용한다.
- 출처 이용 조건: 후보 루트에 LICENSE가 없어 Apache-2.0을 승계하지 않았다는 기록은 변경 없이 유지된다. 의견 없음.

## 대조하지 못한 것

- 플랫폼의 실서비스 확인(11-06~14), 소개·포털·Conveyor의 HTTP 응답. 재현하거나 호출하지 않았다.
- `docs/design.md` 전체 diff와 `docs/guest-demo.md` 본문 전체. 책이 인용한 구간과 diff 일부만 읽었다.
- 포털 화면, 브라우저·모바일 표시, `website/src/content` 생성물.
- `research/demo-example-cases.json`과 inventory의 139개 언급 전수. 샘플과 합계(48 링크, 165 출처)만 확인했다.
