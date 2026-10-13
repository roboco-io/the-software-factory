# 2026-10-14 GitHub Pages 공개 배포

사용자가 factory.roboco.io, 저장소 공개 전환·현재 이슈 사용·공식 로보코 로고와 홈 링크·커밋/푸시·Pages 배포를 명시했다.

- 저장소를 PUBLIC으로 전환하고 이슈 활성 상태를 확인했다.
- Pages workflow 발행과 사용자 지정 도메인 factory.roboco.io를 등록했다.
- 가비아 CNAME은 factory → roboco-io.github.io로 안내했다. DNS 설정은 사용자가 맡는다.
- 공식 홈페이지가 참조하는 https://roboco.io/images/roboco-logo.svg 를 원형으로 저장하고 로고와 홈페이지 링크를 바닥글·소개에 넣었다. 로고를 CC/MIT로 재허락하지 않는다.
- GitHub 공식 워크플로·도메인 문서와 Astro 공식 배포 문서를 확인했다. Actions 방식에서는 저장소의 CNAME 파일에 의존하지 않고 Pages 설정에 도메인을 등록한다. site는 대표 도메인, base는 루트로 유지한다.
- checkout·setup-node·configure-pages·upload-pages-artifact·deploy-pages는 확인한 GitHub 공식 태그의 SHA를 사용한다. 배포 권한은 deploy job에만 부여한다.
- 로컬 단위 13개·새 서버 E2E 12개·타입·45페이지 출력 검사를 통과했다. 현재 파일에서 명백한 비밀키 패턴은 발견하지 못했으며 전체 과거 이력의 완전한 보안 감사로 표시하지 않는다.

원문: [GitHub workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [사용자 지정 도메인](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [Astro 배포 문서](https://docs.astro.build/en/guides/deploy/github/).

커밋·원격 일치·Actions 결과·실제 DNS/HTTPS는 후속 결과에 기록한다.
