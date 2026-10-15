# 첨부 코발트 SNS 썸네일 적용

- 사용자 지시: 첨부 이미지를 책의 SNS 공유 썸네일로 사용한다. 이미지 생성·편집 없이 원본 PNG를 복사했다.
- 자산: website/public/images/software-factory-social-cobalt.png,1734×907. 이전 파일은 보존하고 Open Graph·Twitter의 공통 이미지 URL을 새 경로로 교체했다. 색상과 로고·세 핵심 구성에 맞게 대체 설명을 수정했다.
- 확인: 첨부 화면과 PNG 크기, 공통 설정 위치를 확인했다. 최종 빌드와 생성 HTML의 메타데이터·원본 일치를 검증한다.
- 범위: 로컬 적용. 본문·읽기 저장 구조·독자 체인지로그는 변경하지 않았다. 커밋·푸시·배포와 SNS 사업자별 공유 카드 갱신 시험은 수행하지 않았다.

- 검증 완료: 공유 메타데이터가 있는 55개 페이지의 새 Open Graph/Twitter URL·실제크기, 첨부/저장/빌드 PNG의 바이트 일치를 확인했다. /releases/는 noindex 리다이렉트로 공유 메타데이터 검사에서 제외하고 /changelog/ 목적지를 확인했다. 56페이지 빌드/내부링크 통과. SHA-256: b7ed3f9bab3b1f2a5a6734eec044ccade00785d48fe57343f8e3ede400bb60e6.

### 공개 확인 · 2026-10-15

9c5de8d를 origin/main에 푸시하고 원격 SHA 일치를 확인했다. [Pages 실행38686800209](https://github.com/roboco-io/the-software-factory/actions/runs/38686800209) 빌드·검사·배포 성공. 공개 새PNG의 HTTP200·image/png·원본SHA256일치, 홈·18장의 Open Graph/Twitter 새URL과1734×907크기를 확인했다. 푸시 전 단위26·56페이지빌드/링크·구조/공백 검사도 통과했다. SNS 사업자별 실제 카드 캐시 갱신은 별도 시험하지 않았다. 이 공개확인 기록만 후속 문서 커밋으로 푸시하며 사이트 내용은9c5de8d의 배포본이다.
