#!/usr/bin/env python3
"""Inventory authored demo mentions; evidence and editorial decisions remain human/agent work."""
from pathlib import Path
import argparse
import datetime
import hashlib
import json
import re
import subprocess

REPO = re.compile(r'https://github\.com/roboco-io/(?:the-)?software-factory-demo(?:/[^\s)"<>]*)?')
SITE = re.compile(r'https://roboco\.io/(?:the-)?software-factory-demo(?:/[^\s)"<>]*)?')
SOURCE = re.compile(r'\[(S\d+)\]')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inventory(root):
    data = json.loads((root / 'research/sources.json').read_text())
    demo_ids = {s['id'] for s in data['sources'] if REPO.search(s.get('url', '')) or SITE.search(s.get('url', ''))}
    paths = sorted(set(root.glob('manuscript/**/*.md')) | set(root.glob('website/src/**/*.astro')) | set(root.glob('website/src/pages/**/*.ts')))
    files, mentions = [], []
    for path in paths:
        text = path.read_text()
        location = path.relative_to(root).as_posix()
        files.append({'path': location, 'sha256': sha(path)})
        section = ''
        for number, line in enumerate(text.splitlines(), 1):
            if re.match(r'^#{1,6} ', line):
                section = line.lstrip('# ').strip()
            urls = sorted(set(REPO.findall(line) + SITE.findall(line)))
            ids = sorted(set(SOURCE.findall(line)) & demo_ids)
            if not (urls or ids or '데모' in line or re.search(r'(?:the-)?software-factory-demo', line)):
                continue
            kind = 'source-list' if re.match(r'^\[S\d+\].*(?:확인 범위|출처 대장)', line) else 'content'
            mentions.append({'path': location, 'line': number, 'section': section, 'kind': kind,
                             'source_ids': ids, 'urls': urls, 'text': line,
                             'status': 'unreviewed', 'decision': None})
    project = json.loads((root / 'book_project.json').read_text())
    expected = [c['manuscript_path'] for part in project['parts'] for c in part['chapters']]
    patterns = json.loads((root / 'pattern_catalog.json').read_text())
    expected += [f"manuscript/patterns/{p['id'].lower()}.md" for p in patterns]
    scanned = {f['path'] for f in files}
    missing = sorted(set(expected) - scanned)
    if missing:
        raise ValueError(f'Missing authored manuscripts: {missing}')
    coverage = [{'path': p, 'mentions': sum(m['path'] == p for m in mentions)} for p in expected]
    return {'schema_version': 1, 'scope': 'Authored manuscript and web pages/components; generated content excluded',
            'semantics_verified': False, 'files': files, 'coverage': coverage, 'mentions': mentions,
            'demo_source_ids': sorted(demo_ids)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--run-id', required=True)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    if not re.fullmatch(r'[A-Za-z0-9_-]+', args.run_id):
        parser.error('run-id must contain only letters, numbers, hyphens or underscores')
    root = Path(__file__).resolve().parents[1]
    result = inventory(root)
    result.update(run_id=args.run_id, checked_on=datetime.date.today().isoformat(),
                  book_commit=subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
                  policy_sha256=sha(root / 'planning/demo-example-maintenance-policy.md'))
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        # Exclusive create protects the baseline of a previous run.
        with args.output.open('x', encoding='utf-8') as stream:
            stream.write(rendered)
        print(f"Scanned {len(result['files'])} files; {len(result['mentions'])} mentions. Editorial/evidence review pending.")
    else:
        print(rendered, end='')


if __name__ == '__main__':
    main()
