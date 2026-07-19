import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT))

from research_os.engine import ResearchProject, WorkflowEngine


class ResearchWorkflowTests(unittest.TestCase):
    def test_project_starts_with_intake_and_can_run_first_slice(self):
        project = ResearchProject.create("Diabetes screening review")
        engine = WorkflowEngine(project)
        self.assertEqual(project.current_stage, "W00")
        result = engine.run("W00", {"objective": "Compare screening strategies"})
        self.assertEqual(result.status, "completed")
        self.assertEqual(project.current_stage, "W01")
        self.assertIn("research_intake", project.artifacts)

    def test_dependencies_block_out_of_order_execution(self):
        project = ResearchProject.create("Test")
        result = WorkflowEngine(project).run("W22", {"sources": []})
        self.assertEqual(result.status, "blocked")
        self.assertIn("W21", result.message)

    def test_gate_blocks_claims_without_sources(self):
        project = ResearchProject.create("Test")
        engine = WorkflowEngine(project)
        engine.run("W00", {"objective": "A"})
        result = engine.run("W10", {"question": "Does X improve Y?"})
        self.assertEqual(result.status, "blocked")
        self.assertIn("source", result.message.lower())

    def test_artifacts_are_versioned_and_auditable(self):
        project = ResearchProject.create("Test")
        engine = WorkflowEngine(project)
        engine.run("W00", {"objective": "A"})
        artifact = project.artifacts["research_intake"]
        self.assertEqual(artifact["version"], 1)
        self.assertTrue(artifact["content_hash"])
        self.assertEqual(artifact["status"], "verified")
        self.assertTrue(project.events)

    def test_cli_lists_workflows(self):
        completed = subprocess.run(
            [sys.executable, "-m", "research_os", "list"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        self.assertIn("W00", completed.stdout)
        self.assertIn("W65", completed.stdout)


if __name__ == "__main__":
    unittest.main()
