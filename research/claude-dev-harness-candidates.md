# claude.dev 하네스·지식·스킬 글 후보

확인일: 2026-10-17. 주 에이전트가 아래 네 원문 전체를 웹 도구로 직접 읽고 9·10·11장의 관련 절과 대조했다. 원문 도표의 대체 텍스트는 읽었으나 이미지·외부 링크·제품 실행은 검증하지 않았다. 코드·표·도표·긴 번역은 복제하지 않았다. 각 글은 업체의 설계 설명으로 분류한다. 반영 후보이며 본문을 수정하지 않았다.

## A harness for every task: dynamic workflows in Claude Code

- Thariq Shihipar·Sid Bidasaria, 2026-06-02. https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/
- 확인 절: How/Why dynamic workflows, Helpful patterns, Triaging at scale, When not to use.
- 업체 설명: 작업에 맞게 실행 흐름을 구성하고, 외부 자료를 읽는 역할과 높은 권한으로 행동하는 역할을 분리하는 방식을 제시한다. 병렬화의 조정 비용도 지적한다.
- 저자 제안 후보: 3·6·9·12장에 ‘보호할 정책은 유지하되 실행 구조는 작업에 맞게 바꾼다’를 구체화한다. 생성된 흐름에도 권한·자원·종료·통합 조건을 적용한다.
- 차이와 한계: 기존 단위 분해에 실행 구조 생성의 변경 책임을 보탠다. 독립성·프롬프트 주입 방지 보장이나 일반 효과는 입증하지 않는다. 분리된 요약 역시 비신뢰 입력으로 다룰 필요가 있다.

## Seeing like an agent: how we design tools in Claude Code

- Thariq Shihipar, 2026-04-10. https://claude.dev/blog/seeing-like-an-agent/
- 확인 절: Updating with capabilities, Designing a search interface, Progressive disclosure.
- 업체 설명: 모델 능력 변화에 따라 작업 관리 도구를 바꾼 경험과 필요한 자료를 단계적으로 찾아오는 방식을 설명한다.
- 저자 제안 후보: 10·11·19장에 모델 교체 시 기존 도구·진행 강제가 여전히 도움이 되는지 함께 평가한다. 자료를 줬는지뿐 아니라 필요한 자료를 발견할 수 있는지도 시험한다.
- 차이와 한계: 기존 ‘조합 평가’를 불필요해진 보조 장치의 제거 판단으로 확장한다. 모든 검색에서 특정 방식이 우월하다는 근거나 영구적인 도구 구성으로 쓰지 않는다.

## Lessons from building Claude Code: How we use skills

- Thariq Shihipar, 2026-06-03. https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/
- 확인 절: Tips for making skills, Distributing, Managing, Measuring skills.
- 업체 설명: 반복 실패를 스킬에 축적하고, 사용·호출 상황을 관측하며 팀에 배포하는 경험을 소개한다.
- 저자 제안 후보: 10·13·19장의 조직 지식 자산에 소유자·판본·회귀 평가·폐기 조건을 연결한다. 사용 횟수는 성과가 아니라 도달 여부의 자료로 보고 작업 성공과 별도로 평가한다.
- 차이와 한계: 개인 노하우를 공유 자산으로 바꿀 책임을 보강한다. 문서로 된 지침이 실제 권한을 집행한다거나 사용량이 품질을 증명한다고 쓰지 않는다. 아홉 분류나 스킬 제작법은 전재하지 않는다.

## Lessons from building Claude Code: Prompt caching is everything

- Thariq Shihipar, 2026-04-30. https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/
- 확인 절: Lay out your prompt, Don't change models, Never add/remove tools, Lessons learned.
- 업체 설명: 맥락·도구·모델 구성 변경이 캐시 재사용과 실행 비용에 영향을 주며 적중률을 운영 관측에 포함한다고 설명한다.
- 저자 제안 후보: 11·17장의 교체 비용에 재사용 손실과 준비 비용을 포함한다. 단가가 낮은 모델로 바꾸는 것이 같은 작업의 총비용을 낮추는지는 실제 조합으로 판단한다.
- 차이와 한계: 기존 총비용 논의에 숨은 실행 비용의 짧은 반례로만 검토한다. 캐시를 보존하려고 필요한 보안 경계나 정책 갱신을 미루지 않는다. 제품별 세부 설정은 본문에서 제외한다.
