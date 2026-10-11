#!/usr/bin/env bash
# Create and populate the private book repository, then clone to the requested Mac directory.
set -euo pipefail

project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
book_repository="roboco-io/idd-book"
book_clone_path="${1:-/Users/dohyunjung/Workspace/roboco-io/education}"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Run this Mac checkout script on the user's Mac. No external changes were made." >&2
  exit 1
fi

for required_command in git gh python3; do
  if ! command -v "$required_command" >/dev/null 2>&1; then
    echo "Missing command: $required_command" >&2
    exit 1
  fi
done
gh_book() {
  env GH_HOST=github.com gh "$@"
}
gh_book auth status --hostname github.com
python3 "$project_root/scripts/check_project.py"

if [[ -e "$book_clone_path" || -L "$book_clone_path" ]]; then
  echo "Destination already exists. Inspect it before cloning: $book_clone_path" >&2
  exit 1
fi

if gh_book repo view "$book_repository" >/dev/null 2>&1; then
  echo "Repository already exists. Inspect it before importing these initial files: $book_repository" >&2
  exit 1
fi

if [[ -e "$project_root/.git" || -L "$project_root/.git" ]]; then
  echo "The initial package already contains a Git repository. Inspect it before publishing." >&2
  exit 1
fi

book_user_login="$(gh_book api user --jq .login)"
book_user_id="$(gh_book api user --jq .id)"
book_git_protocol="$(gh_book config get git_protocol --host github.com 2>/dev/null || printf 'https')"
if [[ "$book_git_protocol" == "ssh" ]]; then
  book_remote_url="git@github.com:$book_repository.git"
else
  book_remote_url="https://github.com/$book_repository.git"
fi

git_book() {
  if [[ "$book_git_protocol" == "ssh" ]]; then
    git "$@"
  else
    git -c credential.helper= -c 'credential.helper=!GH_HOST=github.com gh auth git-credential' "$@"
  fi
}
git -C "$project_root" init -b main
if ! git -C "$project_root" var GIT_AUTHOR_IDENT >/dev/null 2>&1 || ! git -C "$project_root" var GIT_COMMITTER_IDENT >/dev/null 2>&1; then
  git -C "$project_root" config user.name "$book_user_login"
  git -C "$project_root" config user.email "$book_user_id+$book_user_login@users.noreply.github.com"
fi
git -C "$project_root" add .
git -C "$project_root" commit -m "docs: initialize IDD book writing project"

# Create first without pushing. An ambiguous failure stops here; inspect before retrying.
gh_book repo create "$book_repository" --private --description "IDD 의도 주도 개발: 소프트웨어 팩토리와 AI 시대의 조직 설계 — 집필 프로젝트"
book_visibility="$(gh_book repo view "$book_repository" --json visibility --jq .visibility)"
if [[ "$book_visibility" != "PRIVATE" ]]; then
  echo "Private visibility was not confirmed. Nothing has been pushed." >&2
  exit 1
fi
git -C "$project_root" remote add origin "$book_remote_url"
git_book -C "$project_root" push -u origin main

mkdir -p "$(dirname -- "$book_clone_path")"
git_book clone "$book_remote_url" "$book_clone_path"
if [[ "$book_git_protocol" != "ssh" ]]; then
  git -C "$book_clone_path" config credential.https://github.com.helper '!GH_HOST=github.com gh auth git-credential'
fi
python3 "$book_clone_path/scripts/check_project.py"

# Record verified external operations in the actual local checkout.
python3 - "$book_clone_path" <<'PY'
from pathlib import Path
import json
import sys
root = Path(sys.argv[1])
path = root / 'book_project.json'
data = json.loads(path.read_text())
data['repository']['remote_created'] = True
data['repository']['actual_clone_path'] = str(root)
data['repository']['local_checkout_verified'] = True
data['repository']['local_mac_clone_verified'] = str(root) == data['repository']['requested_local_path']
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
status_path = root / 'STATUS.md'
status = status_path.read_text()
status = status.replace('원격 저장소 생성: 아직 확인하지 않음', '원격 저장소 생성: roboco-io/idd-book 비공개 저장소 확인')
verified_text = '요청한 Mac 경로의 checkout 및 구조 검사 확인' if data['repository']['local_mac_clone_verified'] else '다른 경로의 checkout 확인: ' + str(root) + ' (요청 경로는 미확인)'
status = status.replace('지정 Mac 경로의 클론: 아직 확인하지 않음', '지정 Mac 경로의 클론: ' + verified_text)
status_path.write_text(status)
PY
git -C "$book_clone_path" add book_project.json STATUS.md
git -C "$book_clone_path" -c "user.name=$book_user_login" -c "user.email=$book_user_id+$book_user_login@users.noreply.github.com" commit -m "docs: record verified repository and local checkout"
git_book -C "$book_clone_path" push
echo "Ready for Codex: $book_clone_path"
