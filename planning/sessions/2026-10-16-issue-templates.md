# 독자용 GitHub 이슈 템플릿 설정

- 요청: 책 저장소의 이슈에 책 피드백을 포함한 템플릿을 설정한다.
- 구성: `.github/ISSUE_TEMPLATE/`에 책 내용 피드백·질문, 오탈자·사실·출처 정정, 웹사이트 문제, 주제·사례·기능 제안의 한국어 양식 4개와 config.yml을 추가했다. 일반 이슈 작성도 허용하고 책 읽기 링크를 제공한다.
- 입력 설계: 위치와 핵심 설명을 필수로 받고, 수정안·근거·사용 환경 등은 가능한 범위에서 선택 입력한다. 책 버전·커밋 ID를 요구하지 않는다. 자동 담당자·라벨·이슈 생성은 설정하지 않았다.
- 기준 확인: 2026-10-16 GitHub 공식 문서의 이슈 양식 문법·필드·chooser 설정을 읽었다. https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms 와 syntax-for-githubs-form-schema, configuring-issue-templates-for-your-repository. 본문 주장 추가가 아니므로 원고 출처 대장에는 등록하지 않았다.
- 검증: YAML 구문·고유 이름/ID·유효한 필드 종류·필수 입력·HTTPS 링크 검사, 구조 검사 20장/15패턴/111출처, 공백 검사 통과. 웹사이트 코드·본문 변경이 없어 사이트 전체 빌드/브라우저 시험은 새로 수행하지 않았다.
- 적용: 템플릿 5개 파일만 f92d4fcc72c6e9b9e9e4009e255a25dfb3b431e2로 커밋해 유일한 원격 origin/main에 푸시했다. 원격 SHA 일치와 GitHub Contents API의 5개 blob SHA가 로컬 git ls-tree와 일치함을 확인했다. 저장소 이슈는 활성화되어 있고 기본 브랜치는 main이다.
- 한계: GitHub의 실제 로그인 후 양식 화면·제출은 시험하지 않았다. 공개 chooser 페이지는 웹 조회 도구에서 cache miss로 열리지 않았으나 API에서 파일 존재·내용 해시는 확인했다. 시험 이슈를 만들지 않았다.
- 이전 D35/D36/D37 원고 작업은 미커밋 상태로 보존했다. 이번 STATUS·세션 기록도 로컬에 남긴다. Pages의 경로 조건상 이슈 템플릿 커밋은 사이트 배포 대상이 아니다.
