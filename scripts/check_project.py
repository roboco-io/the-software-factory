#!/usr/bin/env python3
"""Check the writing project's references; no third-party dependencies."""
from pathlib import Path
import json
import re
import sys
import os

ROOT = Path(__file__).resolve().parents[1]
errors = []

# Generated website output and installed dependencies are checked by the web build.
# Do not traverse them as authored manuscript files.
def authored_files(suffix):
    for directory, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '.astro', 'dist', 'test-results', 'playwright-report'}]
        if Path(directory) == ROOT / 'website' / 'src' / 'content':
            dirs[:] = [d for d in dirs if d != 'docs']
        for name in files:
            if name.endswith(suffix):
                yield Path(directory) / name


def require(condition, message):
    if not condition:
        errors.append(message)

project = json.loads((ROOT / 'book_project.json').read_text(encoding='utf-8'))
patterns = json.loads((ROOT / 'pattern_catalog.json').read_text(encoding='utf-8'))
source_data = json.loads((ROOT / 'research/sources.json').read_text(encoding='utf-8'))
pattern_ids = {p['id'] for p in patterns}
source_ids = {s['id'] for s in source_data['sources']}
chapters = [c for part in project['parts'] for c in part['chapters']]
require([c['number'] for c in chapters] == list(range(1, 21)), 'Expected chapters 1 through 20 in order')
require(len(pattern_ids) == 15 and len(patterns) == 15, 'Pattern IDs must be unique; expected 15')
require(len(source_ids) == len(source_data['sources']), 'Source IDs must be unique')

for c in chapters:
    require((ROOT / c['manuscript_path']).is_file(), f"Missing manuscript: {c['manuscript_path']}")
    require(set(c['patterns']) <= pattern_ids, f"Unknown pattern in chapter {c['number']}")
for p in patterns:
    require(set(p['related']) <= pattern_ids, f"Unknown related pattern: {p['id']}")
    require((ROOT / f"manuscript/patterns/{p['id'].lower()}.md").is_file(), f"Missing pattern draft: {p['id']}")
for f in authored_files('.json'):
    try:
        json.loads(f.read_text(encoding='utf-8'))
    except (ValueError, UnicodeError) as error:
        errors.append(f'Invalid JSON or UTF-8: {f.relative_to(ROOT)}: {error}')
for f in authored_files('.md'):
    text = f.read_text(encoding='utf-8')
    for target in re.findall(r'\]\(([^\s)]+)\)', text):
        if '://' in target or target.startswith(('mailto:', '#')):
            continue
        relative = target.split('#')[0]
        require((f.parent / relative).exists(), f'Broken link: {f.relative_to(ROOT)} -> {target}')
    for sid in re.findall(r'\[(S\d{2,})\]', text):
        require(sid in source_ids, f'Unknown source: {f.relative_to(ROOT)} -> {sid}')
    for pid in set(re.findall(r'\bP\d{2}\b', text)):
        require(pid in pattern_ids, f'Unknown pattern: {f.relative_to(ROOT)} -> {pid}')
def check_claim_sources(value, file):
    if isinstance(value, dict):
        if 'source' in value:
            require(value['source'] in source_ids, f"Unknown claim source: {file} -> {value['source']}")
        for child in value.values():
            check_claim_sources(child, file)
    elif isinstance(value, list):
        for child in value:
            check_claim_sources(child, file)

for file in (ROOT / 'research/claims').rglob('*.json'):
    check_claim_sources(json.loads(file.read_text()), file.relative_to(ROOT))

if errors:
    print('\n'.join(errors), file=sys.stderr)
    raise SystemExit(1)
print(f'PASS: {len(chapters)} chapters, {len(patterns)} patterns, {len(source_ids)} sources; JSON and local links valid')
print('This check does not verify facts, causality, or editorial quality.')
