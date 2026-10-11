# 현재 상태

- 기준일: 2026-10-11
- 기획 버전: 0.2
- 집필 상태: 서문·2장·3장·P06 초고, 저자 검토 대기
- 원격 저장소: roboco-io/idd-book, PRIVATE 확인
- 실제 클론 경로: `/Users/dohyunjung/Workspace/roboco-io/education/idd-book`
- 최초 ZIP 반영: 73개 파일, 커밋 2fcc4c4, main 푸시 후 클론 확인

## 확정된 방향

소프트웨어 조직 리더를 대상으로 본질과 패턴에 집중한다. 공개 관찰, 업체 자체 설명, 저자 해석과 제안을 구분한다. 패턴의 효과와 완전 자동화를 검증된 보편 법칙으로 주장하지 않는다.

기존 education 폴더에는 다른 프로젝트가 있어 저자가 하위 idd-book 클론을 선택했다(D06). 기존 인계 환경의 인증·Mac 접근 차단은 이 세션에서 해소했다.

## 이번 세션의 변경

3장 ‘정책과 실행계획을 분리한다’를 집필했다. 변경 권한·근거·검증·주기, P02·P03, 작업 계약, 예외, 유지 비용과 관찰 기준을 다룬다. 설명용 가상 상황을 실제 사례와 구분했다.

변경 파일: 3장 원고, research/claims/ch03.json, research/sources.json, outline/toc.md, book_project.json, README.md, planning/client-handoff.md, planning/decisions.md, planning/sessions/2026-10-11-ch03.md, scripts/publish_private_repo.sh, STATUS.md.

## 출처와 검토

S16(GitHub 공식 규칙 문서)과 S17(2025-10-20 Anthropic 실행 경계 설명)의 관련 원문을 직접 확인했다. 출처 대장에 작성 주체·확인 범위·한계와 누적 사용 검토를 남겼다. 실제 제품 실행이나 조직 성과는 검증하지 않았다.

3장 수동 검토: P02·P03 이름·정의, 사실·해석·제안의 구분, 변경 권한·주기·검증, 비용·한계, 2장 정의와 4장 연결을 확인했다. 초고는 편집 확정 상태가 아니다. 원서 연결은 기존 공개 목차 대응표 범위이며 본문 대조는 미완료다.

구조 검사와 셸 문법 검사 결과 및 최종 원격 반영은 아래 검증 기록에 남긴다.

## 미결과 다음 작업

- 3장 저자 검토와 구체적인 조직 사례의 후속 검증
- 다음 집필: 7장 ‘증거로 완료를 판단한다’, 이후 9장
- 목표 출판일·주당 집필 시간·최종 분량·원서 대조 판본 미정

미결 사항은 다음 초고 집필의 선행 조건이 아니다. 세션 기록은 [planning/sessions/2026-10-11-ch03.md](planning/sessions/2026-10-11-ch03.md)에 있다.

## 검증 기록

- 구조 검사 PASS: 20장·15개 패턴·17개 출처, JSON·내부 링크·ID 연결 확인.
- `bash -n scripts/publish_private_repo.sh`, `git diff --check` 통과.
- 3장 원고·자료 갱신 커밋 757edee의 main 푸시 성공. `git ls-remote`와 로컬 HEAD의 전체 SHA 일치 확인.
- 원격 PRIVATE 재확인, 갱신 커밋 직후 작업 트리 변경 없음 확인.
- 이 검증 기록은 별도 후속 커밋으로 보존한다. 초고의 저자 승인과 패턴 효과 검증은 포함하지 않는다.
