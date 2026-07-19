import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1]
WEB = ROOT / "web"


class WebAssetTests(unittest.TestCase):
    def test_web_assets_exist_and_html_wires_app(self):
        html = (WEB / "index.html").read_text(encoding="utf-8")
        self.assertIn('id="nodeLayer"', html)
        self.assertIn('styles.css', html)
        self.assertIn('app.js', html)
        self.assertIn('workflow-registry.json.js', html)

    def test_registry_matches_canonical_workflow_count(self):
        script = (WEB / "workflow-registry.json.js").read_text(encoding="utf-8")
        payload = json.loads(script.removeprefix("window.SciFlowRegistry = ").removesuffix(";"))
        self.assertEqual(len(payload["phases"]), 6)
        self.assertEqual(len(payload["nodes"]), 31)
        self.assertEqual({node["id"] for node in payload["nodes"]}, {f"W{number:02d}" for number in [0, 1, 2, *range(10, 13), *range(20, 25), *range(30, 34), *range(40, 46), *range(50, 54), *range(60, 66)]})

    def test_javascript_contains_required_controls(self):
        app = (WEB / "app.js").read_text(encoding="utf-8")
        for control in ["renderPhaseNav", "renderNodes", "renderKanban", "rerunButton", "branchButton", "rollbackButton", "localStorage"]:
            self.assertIn(control, app)


if __name__ == "__main__":
    unittest.main()
