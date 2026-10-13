# 2026-10-14 데모 저장소 링크 정리

## 목표

데모 저장소 이름 변경에 맞춰 책과 독서판의 공개 링크를 `roboco-io/the-software-factory-demo`로 갱신한다.

## 변경 파일과 수행한 일

18개 파일의 GitHub URL 72곳과 사례 지도의 저장소 표시 이름을 수정했다.

- `README.md`
- `manuscript/front-matter/00-preface.md`
- `manuscript/chapters/ch01.md`
- `manuscript/chapters/ch03.md`
- `manuscript/chapters/ch05.md`
- `manuscript/chapters/ch07.md`
- `manuscript/chapters/ch08.md`
- `manuscript/chapters/ch09.md`
- `manuscript/chapters/ch11.md`
- `manuscript/chapters/ch12.md`
- `manuscript/chapters/ch17.md`
- `manuscript/chapters/ch19.md`
- `planning/book-brief.md`
- `research/cases/software-factory-demo.md`
- `research/claims/software-factory-demo.json`
- `research/software-factory-demo-inventory.json`
- `research/sources.json`
- `website/src/pages/about.astro`

이 세션 기록과 `STATUS.md`에 범위와 검증 결과를 남겼다.

## 새 결정과 이유

저자의 데모 저장소 이름 변경 지시를 공개 링크에 반영했다. 책 제목·주장·인용 표식·출처 ID·고정 커밋과 blob SHA·날짜·기존 조사 범위를 유지했다. 로컬 경로와 조사 파일 이름, 과거 요청의 저장소 이름은 보존했다. 내용 의미가 바뀌지 않아 웹 원고 판본은 올리지 않았다.

## 확인한 자료와 범위

프로젝트 지침·현재 상태·기획·목차·패턴 카탈로그, 공개 링크가 있는 Markdown·JSON·Astro 파일과 Pages 워크플로를 확인했다. 새 외부 원문이나 운영 성과를 조사하지 않았다. 고정 버전 README 링크에는 이동할 운영 문서의 앵커가 없으며, 인용한 과거 README 경로는 그대로 유지했다.

## 검토 결과

- `python3 scripts/check_project.py` 통과: 20장·15패턴·97출처, JSON·내부 링크 확인.
- `npm ci` 완료. `npm test` 통과: 13개 테스트.
- `npm run check` 통과: 오류·경고·힌트 0.
- `npm run build` 통과: 45페이지 생성 및 링크·앵커 검사.
- 변경 전후를 대조해 18개 파일이 URL과 저장소 표시 이름의 기계적 교체만 포함하고 SHA·인용 표식이 일치함을 확인했다.
- 기존 공개 URL 검색 결과 0건. 과거 요청에 남은 저장소 이름과 기존 조사 파일 식별자는 링크가 아니며 보존했다.
- `git diff --check` 통과. 검증 환경은 Node 26.10.0이며 웹 요구사항 `>=24`를 충족한다.

이 검증은 사실·인과·논증·편집 확정이나 외부 사이트의 새 URL 응답을 확인한 것이 아니다.

## 미해결·차단 사항

이 작업에서는 GitHub 저장소 이름 변경·커밋·푸시·외부 배포를 수행하지 않았다. 저장소 이름 변경과 게시 결과는 통합 작업에서 확인한다.

## 다음 작업

변경을 검토한 뒤 통합 작업에서 게시한다. main에 원고·출처·웹 파일을 푸시하면 기존 Pages 워크플로가 검사 후 `factory.roboco.io`에 배포한다. 원고의 기존 저자 검토·편집 확정 상태는 유지한다.
