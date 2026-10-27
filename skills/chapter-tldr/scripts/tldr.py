#!/usr/bin/env python3
"""Chapter TL;DR placement and freshness checks; no model or network calls."""
from pathlib import Path
import argparse
import hashlib
import json
import re
from datetime import date

START = '<!-- chapter-tldr:start -->'
END = '<!-- chapter-tldr:end -->'
HEADING = '## TL;DR'
MANIFEST = 'planning/chapter-tldr-manifest.json'
MAX_BULLETS = 9
MAX_CHARACTERS = 1200


def digest(text):
    return hashlib.sha256(text.replace('\r\n', '\n').encode('utf-8')).hexdigest()


def chapters(root):
    project = json.loads((root / 'book_project.json').read_text(encoding='utf-8'))
    return {c['number']: c['manuscript_path'] for p in project['parts'] for c in p['chapters']}


def split(text):
    """Return the original body and summary, detecting malformed or duplicate sections."""
    if START not in text and END not in text:
        if re.search(r'^## TL;DR\s*$', text, re.M):
            raise ValueError('Unmarked TL;DR: read and migrate it rather than overwrite it')
        return text, None
    if text.count(START) != 1 or text.count(END) != 1:
        raise ValueError('TL;DR markers must form one complete section')
    first, last = text.index(START), text.index(END)
    if last < first:
        raise ValueError('TL;DR markers are reversed')
    block = text[first + len(START):last].strip()
    if not block.startswith(HEADING + '\n'):
        raise ValueError('Expected TL;DR heading inside markers')
    body = text[:first] + text[last + len(END):]
    # Insertion owns one blank separator. Removing it restores the exact original body.
    if body[first:first + 2] != '\n\n':
        raise ValueError('Expected blank separator after TL;DR section')
    body = body[:first] + body[first + 2:]
    if re.search(r'^## TL;DR\s*$', body, re.M):
        raise ValueError('Duplicate TL;DR heading outside markers')
    if re.search(r'^## ', body[:first], re.M):
        raise ValueError('TL;DR must precede the first body section')
    return body, block


def render(bullets):
    if not isinstance(bullets, list) or not 1 <= len(bullets) <= MAX_BULLETS:
        raise ValueError('TL;DR requires one to nine content bullets')
    if any(not isinstance(b, str) or not b.strip() or '\n' in b or START in b or END in b for b in bullets):
        raise ValueError('Each bullet must be one nonempty line')
    for bullet in bullets:
        plain = re.sub(r'\*\*|__', '', bullet).lstrip()
        if re.match(r'^(핵심|주장|결정|확인)\s*[:：]', plain):
            raise ValueError('Summarize chapter content without fixed role labels')
    visible = re.sub(r'\*\*|__', '', ''.join(bullets))
    if len(visible) > MAX_CHARACTERS:
        raise ValueError('TL;DR must be at most 1200 characters')
    return HEADING + '\n\n' + '\n'.join('- ' + b.strip() for b in bullets)


def check_block(block):
    lines = block.splitlines()
    if lines[:2] != [HEADING, ''] or any(not x.startswith('- ') for x in lines[2:]):
        raise ValueError('Expected a TL;DR heading and content bullets')
    render([line[2:] for line in lines[2:]])


def insert(body, block):
    # Preserve legacy aliases and any text before the first H2 exactly.
    match = re.search(r'^## ', body, re.M)
    if not match:
        raise ValueError('Chapter has no body section')
    pos = match.start()
    # Keep a legacy alias with its original heading rather than inside the new summary.
    aliases = re.search(r'(?:<span\b[^\n]*</span>\n\n)+$', body[:pos])
    if aliases:
        pos = aliases.start()
    return body[:pos] + START + '\n' + block + '\n' + END + '\n\n' + body[pos:]


def load_manifest(root):
    path = root / MANIFEST
    if not path.exists():
        return {'schema_version': 1, 'chapters': {}}
    data = json.loads(path.read_text(encoding='utf-8'))
    if data.get('schema_version') != 1 or not isinstance(data.get('chapters'), dict):
        raise ValueError('Unsupported TL;DR manifest')
    return data


def status(root, selected=None):
    paths = chapters(root)
    if selected and not set(selected) <= paths.keys():
        raise ValueError('Unknown chapter number')
    records = load_manifest(root)['chapters']
    result = []
    for n, relative in paths.items():
        if selected and n not in selected:
            continue
        item = {'chapter': n, 'path': relative}
        try:
            body, block = split((root / relative).read_text(encoding='utf-8'))
            item.update(body_sha256=digest(body), tldr_sha256=digest(block) if block else None)
            record = records.get(f'ch{n:02}', {})
            if block is None:
                item['status'] = 'missing'
            else:
                check_block(block)
                item['status'] = 'current' if (record.get('body_sha256') == item['body_sha256'] and record.get('tldr_sha256') == item['tldr_sha256'] and record.get('path') == relative and record.get('reason')) else 'review-required'
        except ValueError as error:
            item.update(status='invalid', error=str(error))
        result.append(item)
    return result


def apply(root, updates, reviewed_on):
    date.fromisoformat(reviewed_on)
    paths = chapters(root)
    manifest = load_manifest(root)
    pending, seen = [], set()
    if not isinstance(updates, list) or not updates:
        raise ValueError('updates must be a nonempty list')
    for entry in updates:
        n = entry.get('chapter')
        if n not in paths or n in seen:
            raise ValueError('Unknown or duplicate chapter')
        seen.add(n)
        relative = paths[n]
        body, old = split((root / relative).read_text(encoding='utf-8'))
        if entry.get('expected_body_sha256') != digest(body):
            raise ValueError(f'ch{n:02}: body changed after reading; reread before applying')
        if 'expected_tldr_sha256' not in entry or entry['expected_tldr_sha256'] != (digest(old) if old else None):
            raise ValueError(f'ch{n:02}: TL;DR changed after reading; reread before applying')
        reason = entry.get('reason')
        if not isinstance(reason, str) or not reason.strip():
            raise ValueError('A review reason is required, including when wording stays unchanged')
        block = render(entry.get('bullets'))
        updated = insert(body, block)
        if split(updated)[0] != body:
            raise ValueError('Insertion would change the chapter body')
        pending.append((relative, updated, f'ch{n:02}', {'path': relative, 'body_sha256': digest(body), 'tldr_sha256': digest(block), 'reviewed_on': reviewed_on, 'reason': reason.strip()}))
    # Validate the complete batch before changing any file.
    for relative, updated, key, record in pending:
        path = root / relative
        temporary = path.with_suffix(path.suffix + '.tldr-tmp')
        temporary.write_text(updated, encoding='utf-8')
        temporary.replace(path)
        manifest['chapters'][key] = record
    target = root / MANIFEST
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return len(pending)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['status', 'check', 'apply'])
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[3])
    parser.add_argument('--chapters', type=int, nargs='+')
    parser.add_argument('--input', type=Path)
    parser.add_argument('--date')
    args = parser.parse_args()
    try:
        if args.command == 'apply':
            if not args.input or not args.date:
                parser.error('apply requires --input and --date')
            if args.chapters:
                parser.error('apply takes its chapter scope from the input')
            data = json.loads(args.input.read_text(encoding='utf-8'))
            print(f'Updated {apply(args.root, data["updates"], args.date)} chapter TL;DR records.')
            return 0
        rows = status(args.root, args.chapters)
        if args.command == 'status':
            print(json.dumps(rows, ensure_ascii=False, indent=2))
            return 0
        stale = [r for r in rows if r['status'] != 'current']
        if stale:
            for row in stale:
                print(f'ch{row["chapter"]:02}: TL;DR {row["status"]}; run chapter-tldr skill')
            return 1
        print(f'PASS: {len(rows)} chapter TL;DRs match reviewed body and summary versions.')
        return 0
    except (ValueError, KeyError, OSError, TypeError) as error:
        print(f'TL;DR error: {error}')
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
