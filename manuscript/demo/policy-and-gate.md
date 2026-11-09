# 정책과 수용 경계

리뉴얼 플랫폼은 관리 대상 저장소의 기본 브랜치에 둔 정책을 읽고, 현재 PR의 실제 변경·리뷰·체크와 대조한다. 정책은 선언이고 병합 판정과 실제 GitHub 권한은 그 집행 경로다.[S159]

## 분류에서 반영 판단까지

정책 파일은 위험 경로 규칙, 필수 체크와 자동 병합할 등급을 정한다. 누락되거나 해석할 수 없는 정책, 불완전한 변경 목록은 사람 확인 경로로 넘긴다. PR이 스스로 바꾼 정책을 같은 변경의 허용 기준으로 읽지 않는다.[S159]

리뷰한 커밋과 현재 PR 헤드가 같은지, 필요한 체크가 지정한 앱에서 실행돼 모두 성공했는지 확인한다. 누락된 체크는 대기하며, 생략·중립·취소 결과를 성공으로 바꾸지 않는다. 사람 승인이 필요한 경우에는 현재 커밋에 대한 운영자 승인을 확인한다. 승인자가 PR 작성자이거나 다른 커밋을 승인한 경우와 구분한다.

이 데모는 T3을 자동 병합하지 않고, `.github/`와 `.factory/` 경로에 최소 보호 등급을 둔다. 이는 데모가 선택한 보호 기준이다. 책의 모든 조직에 같은 등급별 사람 승인을 요구하는 원칙으로 확대하지 않는다.

## 구현 근거 읽기

| 확인할 대상 | 역할과 확인할 사실 | 구현 근거 |
|---|---|---|
| 저장소 정책 | 허용 등급과 필수 증거 선언 | [정책 예시 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/1a8d3f3a0edbeb0cba6f03b8658a08ee8127ef4a/docs/examples/factory-policy.yml) |
| 해석과 위험 분류 | 엄격한 정책 형식과 보호 경계 | [분류 조건 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/1a8d3f3a0edbeb0cba6f03b8658a08ee8127ef4a/apps/control/src/policy.ts) |
| 순수 판정 | 현재 커밋·체크 출처·운영자 판단 | [병합 조건 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/1a8d3f3a0edbeb0cba6f03b8658a08ee8127ef4a/apps/control/src/decision.ts) |
| 현재 근거 수집 | 기본 브랜치 정책과 GitHub 자료 조회 | [자료 연결 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/1a8d3f3a0edbeb0cba6f03b8658a08ee8127ef4a/apps/control/src/github-pulls.ts) |

## 리더의 판단과 한계

변경 위험 등급과 책의 정책 적용 범위 계층은 다르다. 저장소의 직접 병합·우회 권한까지 같은 통제가 적용되는지는 실제 설정을 별도로 확인해야 한다. 판정 함수가 있다는 사실만으로 모든 경로의 정책 집행이 보장되지는 않는다.

2026년 11월 9일 확인한 리뉴얼 플랫폼의 고정 판본을 기준으로 썼다. 문서·코드의 정적 구조를 확인했으며, 에이전트 실행·로그인·병합을 직접 시험하거나 운영 효과를 검증한 결과는 아니다.

[3장으로 돌아가기](../chapters/ch03.md) · [12장으로 돌아가기](../chapters/ch12.md) · [데모 해설 목록](index.md)
