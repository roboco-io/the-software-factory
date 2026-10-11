# 클라이언트 인계

## 실제 작업 위치

`/Users/dohyunjung/Workspace/roboco-io/education/idd-book`

2026-10-11 기존 education 폴더의 프로젝트를 확인한 뒤 저자가 하위 idd-book 경로를 선택했다. roboco-io/idd-book 비공개 저장소를 생성하고 ZIP 자료를 업로드한 뒤 이 경로에 클론했다. 기존 education 폴더는 유지했다.

## 이어서 시작

```bash
cd /Users/dohyunjung/Workspace/roboco-io/education/idd-book
git status --short
python3 scripts/check_project.py
```

AGENTS.md, STATUS.md, 집필 기획, 목차, 패턴 카탈로그를 읽고 현재 변경을 확인한다. 3장은 초고이며 저자 검토 대기다. 다음 집필은 7장, 이후 9장이다. 공개자료 확인과 실제 실행·성과 검증을 구분한다.

## 초기화 스크립트

`scripts/publish_private_repo.sh`는 신규 저장소·신규 경로용이다. 현재는 원격과 클론이 존재하므로 재실행하지 않는다. 기존 내용을 삭제해 초기화하지 않는다. 생성·푸시는 GitHub CLI 인증과 조직 권한, SSH 접근을 통해 실제 수행했다.

## 미결 사항

집필 일정·최종 분량·원서 본문 대조 판본은 미정이다. 현재 초고 작성의 선행 조건이 아니다. 원서 전체 본문 대조와 실제 조직 성과 검증은 미완료다.
