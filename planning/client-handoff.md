# 클라이언트 인계

## 지정한 작업 위치

`/Users/dohyunjung/Workspace/roboco-io/education`

이 경로는 저자가 지정한 Mac 경로다. 원격 작업 환경은 해당 Mac 파일시스템에 접근하지 못하므로 여기서의 클론 완료를 확인하지 않았다. 저장소 이름은 작업명에 맞춰 `roboco-io/idd-book`을 기본값으로 사용하고, 지정한 로컬 디렉터리명은 `education`으로 유지한다.

## 시작

원격 저장소가 준비된 경우:

```bash
git clone git@github.com:roboco-io/idd-book.git /Users/dohyunjung/Workspace/roboco-io/education
cd /Users/dohyunjung/Workspace/roboco-io/education
python3 scripts/check_project.py
```

원격 저장소가 아직 없는 파일 묶음인 경우, 파일 묶음을 임시 디렉터리에 풀고 `bash scripts/publish_private_repo.sh`를 실행한다. GitHub CLI 인증과 roboco-io 조직의 생성 권한이 필요하다. 스크립트는 자료를 검증한 뒤 비공개 저장소를 생성·업로드하고 지정한 Mac 위치에 클론한다. 실제 생성 여부를 확인하지 못하면 중단하며 공개 저장소에는 푸시하지 않는다.

이 스크립트는 Mac에서 실행한다. GitHub CLI의 전송 방식에 맞춰 HTTPS 또는 SSH를 사용한다. HTTPS에서는 GitHub CLI의 인증을 사용하고, SSH에서는 기존 SSH 접근 설정이 필요하다. 현재는 구조 검사와 셸 문법만 확인했으며 원격 생성·푸시·Mac 클론을 실제 실행하지 않았다. 중간에 실패하면 원격 저장소와 임시 폴더의 Git 상태를 먼저 확인한다. 자동 재실행을 위해 기존 내용을 삭제하지 않는다.

## 새 세션에 전달할 지시

> AGENTS.md와 STATUS.md를 읽고 집필 기획, 목차와 패턴 카탈로그를 확인해줘. 독자는 More Effective Agile과 동일한 소프트웨어 조직 리더이고 본질과 패턴에 집중한다. 공개자료에서 관찰한 사실과 주체의 자체 보고, 추론과 저자 제안을 구분한다. 다음 작업은 3장 ‘정책과 실행계획을 분리한다’의 초고다. 출처와 주장 메모를 연결하고 세션 종료 시 STATUS.md를 갱신해줘.

## 이어갈 작업

1. 서문과 2장 및 P06의 저자 검토를 반영한다.
2. 3장의 리더 결정·정책/계획 변경 권한을 설계하고 초고를 쓴다.
3. 7장과 9장을 집필하여 완료 판정과 팩토리 책임 구조를 연결한다.
4. 공개 사례의 원천 PR·문서 대조를 진행한다.

주당 집필 시간·목표 출판일·최종 분량은 미정이다. 현재 초고 작성의 차단 조건은 아니다. 원서 전체 본문 대조는 미완료이며 목차 기반 질문만 현재 확인된 상태다.
