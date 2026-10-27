"""Exercise freshness, safe insertion and conflicting edits without a model or network."""
from pathlib import Path
from tempfile import TemporaryDirectory
import importlib.util
import json
import subprocess
import sys
import unittest

SPEC = importlib.util.spec_from_file_location('chapter_tldr', Path(__file__).resolve().parents[2] / 'skills/chapter-tldr/scripts/tldr.py')
tldr = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(tldr)


class ChapterTldrTests(unittest.TestCase):
    def setUp(self):
        self.tmp = TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.paths = {}
        for n in [1, 2]:
            p = self.root / f'manuscript/chapters/ch{n:02}.md'
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(f'# {n}장\n\n상태: 초고\n\n<span id="기존-주소"></span>\n\n## 본문\n\n허용 범위에서 자동 수행한다.\n')
            self.paths[n] = p
        (self.root/'book_project.json').write_text(json.dumps({'parts':[{'chapters':[{'number':n,'manuscript_path':str(p.relative_to(self.root))} for n,p in self.paths.items()]}]}))

    def update(self, n=1):
        row = tldr.status(self.root, [n])[0]
        return {'chapter':n,'expected_body_sha256':row['body_sha256'],'expected_tldr_sha256':row['tldr_sha256'],'bullets':['핵심 주장.','리더의 판단.','확인할 조건.'],'reason':'본문의 허용 범위를 확인했다.'}

    def test_content_outline_accepts_variable_counts_and_longer_chapter_notes(self):
        for count in [1, 5, 9]:
            bullets = [f'장 내용의 요점 {i}를 설명한다.' for i in range(count)]
            block = tldr.render(bullets)
            tldr.check_block(block)
            self.assertEqual(len(block.splitlines()[2:]), count)
        # A chapter outline can exceed the former 450-character limit.
        tldr.check_block(tldr.render(['본문에서 설명한 조건을 빠뜨리지 않고 정리한다. ' * 5] * 5))
        for bullets in [[], ['요점.'] * 10]:
            with self.assertRaises(ValueError):
                tldr.render(bullets)

    def test_legacy_three_role_summary_migrates_without_changing_body(self):
        body = self.paths[1].read_text()
        legacy = '## TL;DR\n\n- **핵심:** 기존 주장.\n- **결정:** 기존 판단.\n- **확인:** 기존 조건.'
        self.paths[1].write_text(tldr.insert(body, legacy))
        with self.assertRaises(ValueError):
            tldr.check_block(legacy)
        update = self.update()
        update['bullets'] = ['본문의 목적을 정리한다.', '수행 범위를 설명한다.', '증거를 연결한다.', '한계를 남긴다.']
        tldr.apply(self.root, [update], '2026-10-27')
        after = self.paths[1].read_text()
        self.assertEqual(tldr.split(after)[0], body)
        self.assertNotIn('**핵심:**', after)
        self.assertEqual(tldr.status(self.root, [1])[0]['status'], 'current')

    def test_preserves_body_and_legacy_alias_without_self_staleness(self):
        before = self.paths[1].read_text()
        tldr.apply(self.root, [self.update()], '2026-10-27')
        after = self.paths[1].read_text()
        self.assertEqual(tldr.split(after)[0], before)
        self.assertLess(after.index(tldr.START), after.index('<span id="기존-주소">'))
        self.assertEqual(tldr.status(self.root, [1])[0]['status'], 'current')
        tldr.apply(self.root, [self.update()], '2026-10-27')
        self.assertEqual(self.paths[1].read_text(), after)

    def test_body_or_summary_edits_require_review_and_unchanged_summary_can_be_reviewed(self):
        tldr.apply(self.root, [self.update()], '2026-10-27')
        p = self.paths[1]
        p.write_text(p.read_text().replace('허용 범위에서', '새 조건의 허용 범위에서'))
        self.assertEqual(tldr.status(self.root, [1])[0]['status'], 'review-required')
        tldr.apply(self.root, [self.update()], '2026-10-27')
        self.assertEqual(tldr.status(self.root, [1])[0]['status'], 'current')
        p.write_text(p.read_text().replace('핵심 주장.', '수동 변경한 요약.'))
        self.assertEqual(tldr.status(self.root, [1])[0]['status'], 'review-required')

    def test_conflicting_batch_does_not_overwrite_either_chapter(self):
        updates = [self.update(1),self.update(2)]
        self.paths[2].write_text(self.paths[2].read_text()+'\n다른 작성자의 변경.\n')
        originals = [p.read_text() for p in self.paths.values()]
        with self.assertRaises(ValueError):
            tldr.apply(self.root, updates, '2026-10-27')
        self.assertEqual([p.read_text() for p in self.paths.values()], originals)
        self.assertFalse((self.root/tldr.MANIFEST).exists())

    def test_summary_change_after_reading_is_not_overwritten(self):
        tldr.apply(self.root, [self.update()], '2026-10-27')
        update = self.update()
        self.paths[1].write_text(self.paths[1].read_text().replace('핵심 주장.', '다른 작성자의 요약.'))
        with self.assertRaises(ValueError):
            tldr.apply(self.root,[update],'2026-10-27')
        self.assertIn('다른 작성자의 요약.',self.paths[1].read_text())

    def test_missing_or_malformed_section_is_not_current(self):
        self.assertEqual(tldr.status(self.root,[1])[0]['status'],'missing')
        self.paths[1].write_text(self.paths[1].read_text()+tldr.START)
        self.assertEqual(tldr.status(self.root,[1])[0]['status'],'invalid')

    def test_check_command_blocks_changed_body_without_writing_it(self):
        tldr.apply(self.root,[self.update(1),self.update(2)],'2026-10-27')
        command = [sys.executable, str(Path(SPEC.origin)), 'check', '--root', str(self.root)]
        self.assertEqual(subprocess.run(command,capture_output=True).returncode,0)
        self.paths[2].write_text(self.paths[2].read_text()+'\n변경된 허용 조건.')
        before = self.paths[2].read_bytes()
        result = subprocess.run(command,capture_output=True,text=True)
        self.assertEqual(result.returncode,1)
        self.assertIn('ch02',result.stdout)
        self.assertEqual(self.paths[2].read_bytes(),before)


if __name__ == '__main__':
    unittest.main()
