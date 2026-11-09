# 실패에서 복구로

중지 요청, 실행 종료, 이미 생긴 외부 효과의 복구는 다른 조치다. 리뉴얼 플랫폼은 실행 상태와 중지 요청을 연결하고 샌드박스 정리를 별도로 관리한다.[S161]

## 무엇을 멈추고 무엇을 재개하는가

운영자의 중지 요청은 표시를 남기고 상태 기계가 처리하도록 깨운다. 이미 진행 중인 작업이 끝나야 PR과 샌드박스 상태를 확인할 수 있으므로 즉시 모든 외부 행동을 취소했다는 뜻은 아니다. 병합을 이미 시도한 시점 이후에는 중지 요청으로 그 병합을 되돌리지 않는다.[S161]

PR 생성 전에 실패한 실행과 PR이 생긴 뒤 사람 확인으로 끝난 실행도 다르다. 전자는 조건을 갖춰 다시 시작할 수 있지만, 후자는 기존 PR을 사람이 처리해야 하며 같은 요청에 두 번째 PR을 만드는 경로로 읽지 않는다. 승인을 기다리는 상태와 사람에게 넘긴 종료 상태를 구분해야 한다.

일반 재시도·상태 정리와 서비스의 롤백은 별도로 판단한다. 현재 플랫폼의 `merged`는 병합 상태이며 배포나 데이터 복구의 완료가 아니다. 이전 데모의 실패율 차단기나 자동 수정 반복을 새 플랫폼의 기능으로 가져오지 않는다.

## 구현 근거 읽기

| 확인할 대상 | 역할과 확인할 사실 | 구현 근거 |
|---|---|---|
| 상태와 종료 | 대기·실패·사람 이관의 다른 의미 | [전이 규칙 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/1a8d3f3a0edbeb0cba6f03b8658a08ee8127ef4a/apps/control/src/run-state.ts) |
| 중지와 정리 | 요청 시점·병합 시도·샌드박스 종료 | [중지 경로 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/1a8d3f3a0edbeb0cba6f03b8658a08ee8127ef4a/apps/control/src/run-machine.ts) |
| 정의된 시험 | 중지와 경합의 기대 동작 | [시험 조건 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/1a8d3f3a0edbeb0cba6f03b8658a08ee8127ef4a/apps/control/src/run-machine-stop.test.ts) |
| 후속 행동 표시 | 현재 상태에 맞는 운영자 안내 | [화면의 판단 읽기](https://github.com/roboco-io/the-software-factory-demo/blob/1a8d3f3a0edbeb0cba6f03b8658a08ee8127ef4a/apps/portal/src/labels.ts) |

## 리더의 판단과 한계

여기서 시험 코드를 읽은 것은 이번 책 갱신에서 시험을 실행했다는 뜻이 아니다. 종료 표시와 샌드박스 정리, 외부 시스템의 실제 상태를 함께 확인해야 한다. 보안 노출이나 이미 전달한 결과는 상태 변경만으로 회수되지 않는다.

2026년 11월 9일 확인한 리뉴얼 플랫폼의 고정 판본을 기준으로 썼다. 문서·코드의 정적 구조를 확인했으며, 에이전트 실행·로그인·병합을 직접 시험하거나 운영 효과를 검증한 결과는 아니다.

[8장으로 돌아가기](../chapters/ch08.md) · [데모 해설 목록](index.md)
