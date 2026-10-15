import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('demo_examples', Path(__file__).parents[1] / 'demo_examples.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class InventoryTest(unittest.TestCase):
    def test_finds_current_old_indirect_and_web_mentions_without_generated_content(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            files = {
                'research/sources.json': json.dumps({'sources': [{'id': 'S59', 'url': 'https://github.com/roboco-io/software-factory-demo'}]}),
                'book_project.json': json.dumps({'parts': [{'chapters': [{'manuscript_path': 'manuscript/chapters/ch01.md'}]}]}),
                'pattern_catalog.json': json.dumps([{'id': 'P01'}]),
                'manuscript/chapters/ch01.md': '# 장\n\n## 사례\n데모의 [코드](https://github.com/roboco-io/the-software-factory-demo/blob/abc/a.ts).[S59]\n[S59]. 확인 범위는 출처 대장에 있다.',
                'manuscript/patterns/p01.md': '# 패턴\n원칙만 설명한다.',
                'website/src/pages/about.astro': '<a href="https://roboco.io/the-software-factory-demo/">둘러보기</a>',
                'website/src/content/docs/demo/index.md': '데모 생성본',
            }
            for name, text in files.items():
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(text)
            result = module.inventory(root)
            self.assertFalse(result['semantics_verified'])
            self.assertEqual(len(result['coverage']), 2)
            self.assertEqual(result['coverage'][1]['mentions'], 0)
            self.assertEqual(len(result['mentions']), 3)
            self.assertEqual(result['mentions'][0]['section'], '사례')
            self.assertEqual(result['mentions'][1]['kind'], 'source-list')
            self.assertEqual(len(result['files']), 3)

    def test_missing_pattern_prevents_claiming_full_coverage(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'research').mkdir()
            (root / 'research/sources.json').write_text('{"sources":[]}')
            (root / 'book_project.json').write_text('{"parts":[]}')
            (root / 'pattern_catalog.json').write_text('[{"id":"P01"}]')
            with self.assertRaisesRegex(ValueError, 'Missing authored manuscripts'):
                module.inventory(root)


if __name__ == '__main__':
    unittest.main()
