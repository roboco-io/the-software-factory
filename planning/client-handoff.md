# 클라이언트 인계

현재 책 제목은 **The Software Factory**다. 2026-10-13 저자 지시로 변경했으며 GitHub 저장소는 `roboco-io/the-software-factory`다. 프로젝트 내부 ID와 현재 로컬 디렉터리는 `idd-book`이다. 구현 예제의 조사·장별 반영은 [반영 계획](software-factory-demo-integration.md)과 [사례 지도](../research/cases/software-factory-demo.md)를 읽는다. 이전 리뷰 수정 뒤 추가한 예제는 별도 검토 기록으로 관리한다.

## 실제 작업 위치

`/Users/dohyunjung/Workspace/roboco-io/education/idd-book`

2026-10-11 기존 education 폴더의 프로젝트를 확인한 뒤 저자가 하위 idd-book 경로를 선택했다. roboco-io/idd-book 비공개 저장소를 생성하고 ZIP 자료를 업로드한 뒤 이 경로에 클론했다. 기존 education 폴더는 유지했다.

## 이어서 시작

```bash
cd /Users/dohyunjung/Workspace/roboco-io/education/idd-book
git status --short
python3 scripts/check_project.py
```

AGENTS.md, STATUS.md, 집필 기획, 목차, 패턴 카탈로그와 [통합 검토 기록](draft-review-2026-10-12.md)을 읽는다. 20장과 15개 패턴 원고 모두 초고다. 다음은 저자 검토·사실 대조·중복과 연결의 통합 퇴고다. 작성 완료를 편집 확정이나 패턴 효과 검증 완료로 취급하지 않는다. 집필 변경의 커밋·원격 반영 기록은 STATUS.md를 확인하고 작업 시작 시 새 변경이 있는지 확인한다.

## 초기화 스크립트

`scripts/publish_private_repo.sh`는 신규 저장소·신규 경로용이다. 현재는 원격과 클론이 존재하므로 재실행하지 않는다. 기존 내용을 삭제해 초기화하지 않는다. 생성·푸시는 GitHub CLI 인증과 조직 권한, SSH 접근을 통해 실제 수행했다.

## 미결 사항

집필 일정·최종 분량·원서 본문 대조 판본은 미정이다. 현재 초고 작성의 선행 조건이 아니다. 원서 전체 본문 대조와 실제 조직 성과 검증은 미완료다.

인간 오너십 논점은 기존 16장 초고에 반영하고 7·9장 본문과 13·17장 설계에 연결했다. [16장 세션](sessions/2026-10-11-ch16.md)을 확인한다. 장 신설·장명 변경·패턴 신설은 하지 않았다.

로보코 기존 글은 고정 커밋의 원문에서 차용했다. 2·3·4·7·9·16장 본문과 10·11·12·13·17·18·19·20장 설계를 보강했다. [블로그 검토](../research/roboco-blog-review.md)의 공개 원고·게시 상태 구분과 보류 항목을 확인한다.

전체 집필 기록: [남은 초고 완료 세션](sessions/2026-10-12-complete-drafts.md).
