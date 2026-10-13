# The Software Factory 웹 독서판

Astro Starlight로 서문·20장·15개 패턴을 발행한다. 질문 추천과 읽기 진도는 로그인 없이 같은 브라우저에서 동작한다. 외부 추천 API나 분석 전송을 사용하지 않는다.

## 실행

Node.js 24 이상을 권장한다. 이 디렉터리에서 실행한다.

```sh
npm ci
npm run dev
```

개발 서버가 표시하는 로컬 주소를 연다. 검색과 배포 파일 검증은 프로덕션 빌드에서 확인한다.

```sh
npm test
npm run check
npm run build
npm run preview -- --port 4321
```

최신 Astro의 preview는 백그라운드 서버를 실행할 수 있다. 종료는 `node scripts/astro.mjs preview stop`으로 한다. Astro 익명 텔레메트리는 실행 래퍼에서 끈다.

## 브라우저 검증

```sh
npx playwright install chromium
npm run test:e2e
```

로컬 Chrome이 이미 설치되어 있다면 `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`로 검사할 수도 있다. 데스크톱과 모바일 폭을 Chromium으로 검사하며 실제 iOS Safari 테스트와 구분한다. 스크린샷·실패 추적은 무시된 test-results 디렉터리에 생성된다.

## 원고와 공개 파일

원고의 기준은 상위 manuscript 디렉터리다. `npm run content`가 출판 파일과 독자용 메타데이터를 만든다. 원고를 복사해 별도로 편집하지 않는다.

- `scripts/generate-content.mjs`: 서문·20장·15패턴만 입력으로 삼고 본문이 인용한 출처의 공개 필드만 발행한다. 출처 개수는 원고에 따라 바뀐다.
- `scripts/publication.mjs`: 내부 파일 링크를 공개 장·패턴·출처 경로로 변환한다. 등록하지 않은 내부 링크는 빌드를 실패시킨다.
- `src/content/docs/`, `src/data/book.json`: 재생성하는 산출물이며 Git에 넣지 않는다.
- `scripts/check-output.mjs`: 빌드 뒤 장·패턴 존재, 모든 내부 링크와 앵커, 내부 경로 노출을 검사한다.
- `src/pages/`: 홈·목차·추천·패턴 목록·소개·설정 페이지다.

planning, research/claims, STATUS 및 원고의 내부 검토 메모는 공개 파일에 복사하지 않는다. 공개 참고문헌은 URL·작성자·제목·발표/확인일·확인 범위·한계를 보존한다. 웹 출판 도구 조사용 출처는 본문에서 인용하지 않으므로 참고문헌에 자동 노출되지 않는다.

## 원고 개정과 진도

`content-manifest.json`은 장/패턴 ID와 의미 있는 판본 번호, 절 제목→고정 앵커 대응을 보관한다.

- 새 절을 추가한 뒤 `npm run content -- --update-anchors`로 새 앵커를 등록한다. 기존 앵커는 재배정하지 않는다.
- 절 제목만 고쳤다면 기존 앵커 값을 새 제목으로 옮긴다. 절의 순서가 바뀌어도 같은 ID를 유지한다.
- 의미 있는 장 수정은 해당 장의 revision을 올린다. 기존 독자에게 ‘읽은 뒤 수정됨’이 표시된다. 오탈자 수정만으로 revision을 올릴 필요는 없다.
- 장 제목과 URL의 ch01~ch20은 독립적이다. 패턴 열람은 20장의 읽기 진도에 합산하지 않는다.

진도 키는 `software-factory.reader.v1`이다. 상태에는 읽음·절 위치·절 안 비율·읽은 판본·추천 답변·글자 크기를 담는다. 새 페이지에서는 ‘읽는 중’까지만 자동 표시하고 완독은 독자가 결정한다. 저장을 끄면 저장된 기록을 지우고 꺼짐 설정만 유지한다. 브라우저 쓰기 실패는 페이지 메모리로 처리하고 안내를 보여준다. 저장소가 다시 허용될 때 다음 쓰기로 복구를 시도한다. 여러 탭은 변경 이벤트를 반영하며 현재 저장본을 읽고 갱신한다. 동시 쓰기에 대한 트랜잭션이나 기기 간 동기화를 제공하지 않는다.

## 추천 수정

`src/lib/recommendations.mjs`의 목적별 경로와 역할별 강조를 바꾼다. 순서는 선행 맥락을 유지한다. 목적이 경로를 결정하고 역할은 그 안의 강조를 결정한다. 깊이는 핵심 판단 앵커 또는 본문으로 진입할지 결정한다. ‘전체 흐름’ 선택은 우선 경로에서 시작하고 전체 목차로 이어진다. 추천 이유에는 book_project.json의 장별 리더 결정을 사용한다.

## 실제 공개 시

대표 주소는 `https://factory.roboco.io`다. book-release.json의 site_url이 기본 canonical·sitemap 주소이며 SITE_URL로 별도 검증 주소를 지정할 수 있다. `.github/workflows/pages.yml`이 main 변경에서 검사·빌드·브라우저 테스트 후 `website/dist`만 GitHub Pages에 배포한다. GitHub Pages의 사용자 지정 도메인 설정은 factory.roboco.io이며 가비아 DNS의 factory CNAME은 roboco-io.github.io를 가리킨다. DNS 전파와 인증서 발급은 배포 성공과 별도로 확인한다.

의존성은 lockfile로 고정한다. `postcss-selector-parser`는 GHSA-rj75-hqrm-r3gf가 수정된 7.1.6으로 override했다. Starlight 상위 의존성이 수정되면 override 제거를 검토하고 CSS 빌드와 화면을 다시 확인한다.

## 라이선스

직접 작성한 웹사이트 코드는 MIT입니다. 원고에서 생성한 본문·패턴·도표 등 책 콘텐츠는 CC BY-SA 4.0을 유지합니다. [범위 안내](../LICENSE.md), [MIT 전문](../LICENSES/MIT.txt), [CC BY-SA 전문](../LICENSES/CC-BY-SA-4.0.txt)을 따릅니다. 빌드 과정에서 전문을 public/licenses에 복사해 배포본에도 포함합니다.

## 책의 버전과 릴리즈 노트

`book-release.json`이 독자에게 표시할 버전·단계·판본 기준일·피드백 URL의 기준이다. 현재 **0.1 프리뷰**다. 홈·페이지 제목 위·바닥글·소개에 같은 표시를 사용한다. 루트의 [릴리즈 노트](../RELEASE_NOTES.md)를 변경한 뒤 빌드하면 `/releases/` 페이지에 반영된다. 책의 판본, 내부 기획 버전, npm 패키지 버전, 장별 읽음 판본은 서로 다른 용도다.

피드백 저장소가 비공개이면 `feedback.access`를 `restricted`로 두고 접근 권한 안내를 표시한다. 공개 창구를 정하면 URL과 접근 상태, 서문·릴리즈 노트·루트 README의 피드백 안내도 함께 갱신한다. 현재 원고 저장소와 이슈는 공개되어 있으며 기존 저장소의 이슈를 피드백 창구로 사용한다.

## 로보코 로고

공식 홈페이지의 로고를 `public/images/roboco-logo.svg`에 보존하고 바닥글·소개에서 `https://roboco.io/`로 연결한다. 출처와 권리 구분은 같은 디렉터리의 NOTICE.txt에 기록했다. 로고는 본문 CC 또는 코드 MIT로 재허락하지 않는다.
