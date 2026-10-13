# The Software Factory 집필 프로젝트

**The Software Factory — 소프트웨어 팩토리와 AI 시대의 조직 설계**

소프트웨어 조직 리더를 위한 한국어 책이다. 의도를 정책과 실행계획으로 구체화하고, 수행 결과를 증거로 검증하며, 피드백으로 정책과 계획을 개선하는 개발 접근법을 패턴 언어로 설명한다.

## 먼저 읽기

1. [AGENTS.md](AGENTS.md): 에이전트의 작업 지침
2. [STATUS.md](STATUS.md): 현재 상태와 다음 작업
3. [집필 기획](planning/book-brief.md)과 [편집 방침](planning/editorial-policy.md)
4. [목차](outline/toc.md)와 [패턴 목록](patterns/README.md)
5. [클라이언트 인계](planning/client-handoff.md)

## 자료의 위치

| 경로 | 내용 |
|---|---|
| `planning/` | 기획, 확정 결정, 집필 규칙, 클라이언트 인계 |
| `outline/` | 5부 20장 목차와 장별 질문·완료 목표 |
| `manuscript/front-matter/` | 서문 초고 |
| `manuscript/chapters/` | 장별 원고. 20장 모두 초고, 저자 검토·편집 확정 대기 |
| `manuscript/patterns/` | 패턴 원고. 15개 모두 초고, P06은 기존 샘플 초고 보존 |
| `patterns/` | 패턴 관계와 집필 안내 |
| `research/` | 출처 대장, 주장 메모, 공개 사례, 맥코넬 대응표 |
| `templates/` | 장·패턴·조사·세션 기록 양식 |
| `assets/` | 도표·그림의 원본과 근거 |
| `supplements/` | 확인일이 필요한 구현·도구 보조 자료 |
| `scripts/` | 저장소 연결과 구조 검증 |

`book_project.json`은 장 번호·경로·상태의 기준, `pattern_catalog.json`은 패턴 ID·이름·설계의 기준이다. Markdown은 집필·검토 원고다. 편집 중 기준을 바꾸면 관련 파일을 함께 갱신한다.

## 집필 방향

- 독자는 More Effective Agile과 동일한 소프트웨어 조직 리더다.
- 오래 유지되는 원리와 패턴, 판단·책임·권한·비용에 집중한다.
- 사례는 공개 자료에서 확인한 관찰과 그에 근거한 추론을 사용한다.
- 사실, 사례 주체의 자체 보고, 저자의 해석과 제안을 구분한다.
- IDD의 기존 용례를 인정한다. 기존 책의 공개 목차 대조와 본문 검토를 구분한다.

## 로컬에서 시작하기

원격 저장소가 준비되면 요청한 Mac 경로에서 다음과 같이 시작한다.

```bash
git clone git@github.com:roboco-io/idd-book.git /Users/dohyunjung/Workspace/roboco-io/education/idd-book
cd /Users/dohyunjung/Workspace/roboco-io/education/idd-book
python3 scripts/check_project.py
```

초기 파일 묶음을 받은 경우 원격 저장소 생성·연결은 `scripts/publish_private_repo.sh`를 사용할 수 있다. 실행 전 GitHub CLI의 인증 계정과 조직 권한을 확인한다. 기존 저장소나 경로는 덮어쓰지 않는다.

클라이언트에는 “AGENTS.md와 STATUS.md, 전체 초고 검토 기록을 읽고 사실 대조와 통합 퇴고를 진행해줘”라고 지시하면 된다. 집필 일정과 최종 분량은 아직 확정하지 않았으며 현재 작업의 선행 조건은 아니다.

## 검증

```bash
python3 scripts/check_project.py
```

이 검사는 구조, 내부 링크, 장과 패턴 ID 및 출처 연결을 확인한다. 논증의 타당성과 자료의 진실성은 편집 검토에서 별도로 확인한다.

로보코 기존 글의 차용 출처와 반영 위치: [검토 메모](research/roboco-blog-review.md).

전체 초고 작성과 남은 검토 범위: [통합 검토 기록](planning/draft-review-2026-10-12.md).

공통 구현 예제: [The Software Factory Demo](https://github.com/roboco-io/software-factory-demo). 고정 버전과 장별 관측·해석의 범위는 [구현 사례 지도](research/cases/software-factory-demo.md), 단계별 작업은 [반영 계획](planning/software-factory-demo-integration.md)에 기록한다.
