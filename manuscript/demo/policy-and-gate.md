# 정책과 수용 경계

리뉴얼 플랫폼은 관리 대상 저장소의 기본 브랜치에 둔 정책을 읽고, 현재 PR의 실제 변경·리뷰·체크와 대조한다. 정책은 선언이고 병합 판정과 실제 GitHub 권한은 그 집행 경로다.[S159]

## 분류에서 반영 판단까지

정책 파일은 위험 경로 규칙, 필수 체크와 자동 병합할 등급을 정한다. 누락되거나 해석할 수 없는 정책, 불완전한 변경 목록은 사람 확인 경로로 넘긴다. PR이 스스로 바꾼 정책을 같은 변경의 허용 기준으로 읽지 않는다.[S159]

리뷰한 커밋과 현재 PR 헤드가 같은지, 필요한 체크가 지정한 앱에서 실행돼 모두 성공했는지 확인한다. 누락된 체크는 대기하며, 생략·중립·취소 결과를 성공으로 바꾸지 않는다. 사람 승인이 필요한 경우에는 현재 커밋에 대한 운영자 승인을 확인한다. 승인자가 PR 작성자이거나 다른 커밋을 승인한 경우와 구분한다.

이 데모의 병합 판정은 T3을 자동 병합하지 않고, `.github/`와 `.factory/` 경로에 최소 보호 등급을 둔다. 이는 데모가 선택한 보호 기준이다. 책의 모든 조직에 같은 등급별 사람 승인을 요구하는 원칙으로 확대하지 않는다.

2026년 11월 17일의 플랫폼 판본에는 이 판정과 별개인 병합 경로가 하나 더 있다. 제어 평면이 하루에 한 번 관리 저장소의 Dependabot PR을 점검하고, 조건을 모두 충족한 보안 업데이트를 사람 없이 병합한다. 조건에는 작성자가 Dependabot 계정이고 서명된 커밋이 하나라는 점, 한 패키지를 같은 메이저 버전 안에서 올린다는 점, 그 패키지에 열린 보안 경고가 있고 올린 버전이 수정 버전 이상이라는 점, 바뀐 파일이 의존성 선언과 잠금 파일에 한정된다는 점, 저장소 정책의 필수 체크가 통과했고 일정 기간이 지났다는 점이 있다. 플랫폼의 운영 문서는 이 변경에 AI 리뷰를 하지 않으며, 저장소 정책이 의존성 파일을 사람 확인 등급으로 두어도 병합하므로 이 예외를 받아들이는 저장소만 대상으로 삼으라고 적는다.[S159]

이 경로는 후보 판본에서 동작하지 않는다. 대상 저장소를 지정하는 설정이 후보 판본의 배포 설정에 없고, 저장소를 더하려면 운영자의 승인과 GitHub 앱의 추가 권한이 필요하다. 플랫폼의 기록에 따르면 실제 GitHub와 예약 실행으로는 실행한 적이 없고(2026년 11월 15일 기준) 가짜 GitHub로 시험했다. 판정 규칙만 한 저장소의 실제 PR 응답으로 돌려 확인했다고 한다. 서명 조건을 위조할 수 있는지는 확인하지 못했다고 현재 상태 문서가 적는다. 이 책은 이 경로를 운영 사례로 쓰지 않는다. 다만 병합 판정 함수 하나만 읽으면 그 저장소의 모든 병합 경로를 설명했다고 착각하기 쉽다는 점을 보여 준다.

## 구현 근거 읽기

| 확인할 대상 | 역할과 확인할 사실 | 구현 근거 |
|---|---|---|
| 저장소 정책 | 허용 등급과 필수 증거 선언 | [정책 예시 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/docs/examples/factory-policy.yml) |
| 해석과 위험 분류 | 엄격한 정책 형식과 보호 경계 | [분류 조건 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/apps/control/src/policy.ts) |
| 순수 판정 | 현재 커밋·체크 출처·운영자 판단 | [병합 조건 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/apps/control/src/decision.ts) |
| 현재 근거 수집 | 기본 브랜치 정책과 GitHub 자료 조회 | [자료 연결 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/apps/control/src/github-pulls.ts) |
| 별도 병합 경로 | Dependabot 보안 업데이트의 병합 조건 | [점검 규칙 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/apps/control/src/dependabot.ts) |
| 점검 실행 | 하루 한 번 예약 점검의 연결 | [예약 실행 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/apps/control/src/scheduled.ts) |
| 운영 조건과 한계 | 병합 조건, AI 리뷰를 하지 않음, 실제 환경 미실행, 정책 예외 | [Dependabot 절 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/docs/operations.md) |
| 대상 설정 | 이 경로의 대상 저장소 설정이 없음 | [설정 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/apps/control/wrangler.jsonc) |
| 확인 상태 | 이 경로의 확인 상태와 남은 항목을 적는 플랫폼의 문서 | [현재 상태 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/0c1b2ecbacfbead6f29fe39ab84e35b5bcf4e6e6/docs/status.md) |

## 리더의 판단과 한계

변경 위험 등급과 책의 정책 적용 범위 계층은 다르다. 저장소의 직접 병합·우회 권한까지 같은 통제가 적용되는지는 실제 설정을 별도로 확인해야 한다. 판정 함수가 있다는 사실만으로 모든 경로의 정책 집행이 보장되지는 않는다. 위의 Dependabot 점검처럼 같은 저장소에 병합하는 다른 경로가 추가될 수 있으므로 경로의 목록과 각 경로가 읽는 정책을 함께 확인한다.

2026년 11월 17일의 플랫폼 커밋(2026년 11월 19일 확인)을 기준으로 썼다. 문서·코드의 정적 구조와 플랫폼이 남긴 기록의 내용을 읽었으며, 이 책이 에이전트 실행·로그인·병합을 직접 시험하거나 운영 효과를 검증한 결과는 아니다.

[3장으로 돌아가기](../chapters/ch03.md) · [12장으로 돌아가기](../chapters/ch12.md) · [데모 해설 목록](index.md)
