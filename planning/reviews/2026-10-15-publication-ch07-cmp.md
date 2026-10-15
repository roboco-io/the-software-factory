# 출판 준비 리뷰: 7장 (모델 비교용 독립 리뷰)

## 1. 범위

- 적용 정책: planning/review-policies/README.md, 04-publication.md (상태: 저자 검토 전 정책, 리뷰 기준으로 사용)
- 기준 버전: 2f19b8911bca8e9e7219f6dccd13b3935ca3bc6c. 직전 공개 커밋은 origin/main(121e501, git fetch 후)으로 보았다. 대상 파일(manuscript/chapters/ch07.md, website/content-manifest.json, CHANGELOG.md)에 커밋하지 않은 변경은 없다(작업 트리의 미추적 항목은 output/과 planning/reviews/ 보고서뿐이다).
- 읽은 것: 정책 파일, website/README.md, content-manifest.json(ch07 항목), book-publication.json, LICENSE.md, CHANGELOG.md, ch07 원고와 origin/main 대비 diff, 빌드한 dist/book/ch07/index.html, dist/changelog, dist/license, outline/toc.md의 7장 행. 
- 읽지 않은 것: skills/book-changelog/references/policy.md 전문(정책 기준 질문은 04-publication.md 인용으로 적용), book_project.json의 7장 항목 전체 필드, STATUS.md 전체, README.md 전체. 다른 2026-10-15 ch07 보고서는 읽지 않았다.
- 변경 범위: origin/main..HEAD에서 ch07 원고는 한 문단이 추가되었다(정상 경로의 자동 진행과 사람의 확인 범위). manifest의 ch07 revision은 1에서 2로 올랐고 앵커 s01-s10은 변하지 않았다. CHANGELOG에는 "공개 예정" 항목이 새로 생겼다.

## 2. 축별 요약

| 검사 | 결과 | 실패 내용 요약 |
|---|---|---|
| python3 scripts/check_project.py | 통과 | 20장, 15패턴, 97출처, JSON·로컬 링크 유효 |
| git diff --check | 통과 | 공백 오류 없음 |
| npm test (website) | 통과 | 13개 통과, 0 실패 |
| npm run check (website) | 통과 | 28개 파일, 오류·경고·힌트 0 |
| npm run build (website) | 통과 | 46페이지, check-output 통과(내부 경로 노출 없음) |
| npm run test:e2e (website) | 통과 | 12개 통과. PLAYWRIGHT_CHANNEL=chrome(로컬 Chrome)으로 실행. 실제 iOS Safari 결과가 아니다 |

이 통과는 형식·링크·ID 검사 결과이며 내용 승인이 아니다. 배포 사이트(factory.roboco.io)는 확인하지 않았다. 로컬 빌드 결과만 본다. 이슈 경로 https://github.com/roboco-io/the-software-factory/issues는 HEAD 요청에 HTTP 200을 반환했다(2026-10-15 실행 시점).

- revision을 올려야 하는 장: 없음. ch07은 의미가 바뀌어 이미 2로 올랐다.
- 체인지 로그에 추가해야 하는 항목: 7장 변경(U001 참조).
- 사라진 앵커: 없음(s01-s10 유지, 절 제목 변경 없음).

## 3. 의견

### U001 / P2 / 열림
- 위치 / 버전: CHANGELOG.md "공개 예정" 첫 항목, 기준 버전 2f19b89.
- 문제 / 독자 영향: 7장에 "모든 결과를 사람이 직접 승인해야 하는 것은 아니다. 정상 경로에서는 정해진 증거와 독립 판정으로 다음 단계가 자동으로 이어진다"는 수용 책임·권한에 관한 문단이 추가되었고 revision이 2로 올랐다. 그러나 공개 예정 항목은 1·2·9·19장만 링크하고 7장을 언급하지 않는다. 문장 끝의 "전자동 개발의 정상 경로와 인간의 예외 판단·책임을 구분하고 측정·도입·확대 기준에도 적용합니다"가 이 변경을 일반 표현으로 포함하지만, 7장에서 "읽은 뒤 수정됨"을 본 독자가 무엇이 바뀌었는지 변경 기록에서 7장으로 찾아갈 수 없다.
- 근거 / 확인 수준: 04-publication.md 기준 4(책임·권한의 변경 기록). 항목 전체 문장은 일반 서술로 변경의 취지를 담아서 누락으로 단정하기보다 위치 연결 부족으로 보아 P2로 판정했다. origin/main..HEAD의 CHANGELOG diff와 원고 diff를 읽어 확인했다.
- 최소 수정: 공개 예정 항목의 나열에 7장 링크를 추가하고 "수용 판정에서 사람의 확인을 정책으로 정한 조건에 배치한다"는 취지를 한 구절로 쓴다.
- 수용 조건: CHANGELOG.md의 공개 예정 항목에서 https://factory.roboco.io/book/ch07/ 링크와 변경 내용을 읽을 수 있다.

## 4. 확인했으나 문제를 찾지 못한 항목

- 원고-공개본 일치: 장 제목, 절 제목 10개, 표 1개, 새 문단이 dist/book/ch07/index.html에 있고 절 ID s01-s10이 manifest 앵커와 일치한다. 본문 잘림은 보지 못했다. 직접 인용·출처 표식은 표본 확인이 아니라 존재 확인 수준이다.
- 마크다운 렌더링: 원고에 범위 표기 `~`, 취소선, 닫는 `**` 뒤 글자 붙임 패턴이 없다. 공개본 HTML에 노출된 `**`는 JS 주석뿐이다.
- 수정 표시와 앵커: 위 요약대로 정상.
- 라이선스·상태: 공개본에 "공개 초안" 상태 표시와 CC BY-SA 4.0 표시가 있다. LICENSE.md의 CC BY-SA/MIT/제3자 제외 구분을 읽었고, license 페이지의 CC BY-SA 4.0 표시를 확인했다. 전문 대조는 하지 않았다.
- 제작 정보 노출: 공개 ch07에 "초고", "검토 대기", TODO가 없다(원고의 상태 줄은 빌드에서 제거됨). 결정 번호·의견 ID 패턴도 원고 검색에서 나오지 않았다.
- 독자 읽기: h1 1개 다음 h2 11개로 제목 건너뜀이 없다. 본문 이미지는 없고 로고 이미지에 alt가 있다. 표의 모바일 가로 넘침은 e2e 통과로 갈음했으며 직접 시각 확인은 하지 않았다.
- 메타데이터: outline/toc.md의 7장 제목·상태(초고)가 원고 제목과 일치한다. book_project.json의 7장 항목과 STATUS.md, 웹 메타데이터 전반 대조는 부분적으로만 했다.

## 5. 다른 축으로 넘길 사항

- 논증: 추가 문단의 "정상 경로 자동 진행"과 앞 절의 판정 책임자 정의가 서로 모순 없이 이어지는지(7장 새 문단, 약 27행)는 논증 축에서 판정한다.
- 근거: 같은 문단이 S 출처 없이 설계 제안으로 쓰였는지는 근거 축에서 확인한다.

## 6. 판정과 인계

- 등급별 의견 수: P0 0, P1 0, P2 1, P3 0.
- 남은 P0·P1: 없음.
- 수행하지 못한 확인: 배포 사이트 실제 상태, 실제 iOS Safari, book-changelog 정책 전문 대조, 직접 인용·출처 표식의 전수 대조, 공유 썸네일 확인, 7장 외 메타데이터의 완전한 대조.
- 다음 작업: U001 수정 후 CHANGELOG의 공개 예정 항목 재확인. STATUS.md는 지시에 따라 수정하지 않았다.
