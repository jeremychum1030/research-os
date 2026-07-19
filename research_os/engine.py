"""A small, deterministic workflow engine for the Research OS MVP."""

from __future__ import annotations

import hashlib
import json
import sys
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


WORKFLOWS = [
    ("W00", "Research Intake", "research_intake", []),
    ("W01", "Research Router", "routing_decision", ["W00"]),
    ("W02", "Research Passport", "research_passport", ["W00"]),
    ("W10", "Research Question", "research_question", ["W00"]),
    ("W11", "Landscape Mapping", "landscape_map", ["W10"]),
    ("W12", "Novelty Discovery", "novelty_candidates", ["W11", "W23"]),
    ("W20", "Search Design", "search_protocol", ["W10"]),
    ("W21", "Literature Retrieval", "source_registry", ["W20"]),
    ("W22", "Paper Extraction", "paper_cards", ["W21"]),
    ("W23", "Evidence Mapping", "evidence_map", ["W22"]),
    ("W24", "Claim Audit", "claim_audit", ["W23"]),
    ("W30", "Study Design", "study_design", ["W10", "W12"]),
    ("W31", "Protocol Builder", "study_protocol", ["W30"]),
    ("W32", "Power Analysis", "power_analysis", ["W31"]),
    ("W33", "Bias Ethics Feasibility", "risk_review", ["W31"]),
    ("W40", "Data Readiness", "data_readiness", ["W31"]),
    ("W41", "Data Exploration", "eda_report", ["W40"]),
    ("W42", "Statistical Analysis Plan", "statistical_analysis_plan", ["W40"]),
    ("W43", "Domain Analysis", "analysis_run", ["W41", "W42"]),
    ("W44", "Results Audit", "results_audit", ["W43"]),
    ("W45", "Reproducibility Package", "reproducibility_manifest", ["W43"]),
    ("W50", "Manuscript Architecture", "manuscript_outline", ["W24", "W44"]),
    ("W51", "Manuscript Drafting", "manuscript_draft", ["W50"]),
    ("W52", "Figures and Tables", "figure_package", ["W44"]),
    ("W53", "Language and Tone Editing", "polished_manuscript", ["W51"]),
    ("W60", "Pre-review Integrity", "integrity_report", ["W24", "W44", "W45", "W53"]),
    ("W61", "Peer Review Simulation", "review_reports", ["W60"]),
    ("W62", "Revision and Response", "revision_package", ["W61"]),
    ("W63", "Re-review", "rereview_report", ["W62"]),
    ("W64", "Journal Submission", "submission_package", ["W60", "W63"]),
    ("W65", "Final Integrity and Finalize", "final_package", ["W64"]),
]

REGISTRY = {
    workflow_id: {"name": name, "artifact_type": artifact_type, "requires": requires}
    for workflow_id, name, artifact_type, requires in WORKFLOWS
}


@dataclass
class RunResult:
    workflow_id: str
    status: str
    message: str
    artifact_id: str | None = None


@dataclass
class ResearchProject:
    project_id: str
    title: str
    status: str = "INTAKE"
    current_stage: str = "W00"
    artifacts: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    runs: List[Dict[str, Any]] = field(default_factory=list)
    events: List[Dict[str, Any]] = field(default_factory=list)

    @classmethod
    def create(cls, title: str) -> "ResearchProject":
        if not title.strip():
            raise ValueError("title must not be empty")
        return cls(project_id=str(uuid.uuid4()), title=title.strip())

    def save(self, path: str | Path) -> None:
        Path(path).write_text(json.dumps(self.to_dict(), ensure_ascii=False, indent=2), encoding="utf-8")

    @classmethod
    def load(cls, path: str | Path) -> "ResearchProject":
        data = json.loads(Path(path).read_text(encoding="utf-8"))
        return cls(**data)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "project_id": self.project_id,
            "title": self.title,
            "status": self.status,
            "current_stage": self.current_stage,
            "artifacts": self.artifacts,
            "runs": self.runs,
            "events": self.events,
        }


class WorkflowEngine:
    def __init__(self, project: ResearchProject):
        self.project = project

    def run(self, workflow_id: str, inputs: Dict[str, Any] | None = None) -> RunResult:
        inputs = inputs or {}
        if workflow_id not in REGISTRY:
            return RunResult(workflow_id, "blocked", f"Unknown workflow: {workflow_id}")
        spec = REGISTRY[workflow_id]
        missing = [dependency for dependency in spec["requires"] if not self._has_completed(dependency)]
        if missing:
            return self._record_blocked(workflow_id, f"Missing completed dependencies: {', '.join(missing)}")
        gate_error = self._validate_inputs(workflow_id, inputs)
        if gate_error:
            return self._record_blocked(workflow_id, gate_error)

        artifact_type = spec["artifact_type"]
        version = self.project.artifacts.get(artifact_type, {}).get("version", 0) + 1
        payload = {
            "workflow_id": workflow_id,
            "workflow_name": spec["name"],
            "inputs": inputs,
            "project_id": self.project.project_id,
        }
        serialized = json.dumps(payload, ensure_ascii=False, sort_keys=True)
        artifact = {
            "artifact_id": str(uuid.uuid4()),
            "project_id": self.project.project_id,
            "artifact_type": artifact_type,
            "version": version,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "source_artifacts": [self.project.artifacts[self._artifact_for(dep)]["artifact_id"] for dep in spec["requires"]],
            "content_hash": hashlib.sha256(serialized.encode("utf-8")).hexdigest(),
            "status": "verified",
            "quality_gates": [{"gate": self._gate_for(workflow_id), "status": "passed"}],
            "payload": payload,
        }
        self.project.artifacts[artifact_type] = artifact
        self.project.runs.append({"workflow_id": workflow_id, "status": "completed", "artifact_id": artifact["artifact_id"]})
        self.project.events.append({"event": "artifact_created", "workflow_id": workflow_id, "artifact_id": artifact["artifact_id"]})
        self.project.current_stage = self._next_stage(workflow_id)
        self.project.status = "IN_PROGRESS" if self.project.current_stage else "FINALIZED"
        return RunResult(workflow_id, "completed", f"Created {artifact_type} v{version}", artifact["artifact_id"])

    def _validate_inputs(self, workflow_id: str, inputs: Dict[str, Any]) -> str | None:
        if workflow_id == "W00" and not inputs.get("objective"):
            return "G0 requires a non-empty objective"
        if workflow_id == "W10" and not inputs.get("question"):
            return "G0 requires a research question"
        if workflow_id == "W10" and not self.project.artifacts.get("source_registry") and not inputs.get("sources"):
            return "Research question requires at least one source or a source plan"
        if workflow_id == "W21" and not inputs.get("sources"):
            return "Literature retrieval requires sources"
        if workflow_id in {"W22", "W23", "W24"} and inputs.get("verified") is False:
            return "Evidence gate requires verified source material"
        return None

    def _has_completed(self, workflow_id: str) -> bool:
        return any(run["workflow_id"] == workflow_id and run["status"] == "completed" for run in self.project.runs)

    def _artifact_for(self, workflow_id: str) -> str:
        return REGISTRY[workflow_id]["artifact_type"]

    def _gate_for(self, workflow_id: str) -> str:
        if workflow_id in {"W00", "W01", "W02", "W10", "W20"}:
            return "G0_information_integrity"
        if workflow_id in {"W11", "W12", "W21", "W22", "W23", "W24"}:
            return "G2_evidence_integrity"
        if workflow_id in {"W40", "W41", "W42", "W43", "W44", "W45"}:
            return "G3_data_statistics_integrity"
        if workflow_id in {"W33", "W60", "W61", "W63", "W64", "W65"}:
            return "G5_safety_or_publication_integrity"
        return "G1_scientific_feasibility"

    def _next_stage(self, workflow_id: str) -> str | None:
        index = [item[0] for item in WORKFLOWS].index(workflow_id)
        return WORKFLOWS[index + 1][0] if index + 1 < len(WORKFLOWS) else None

    def _record_blocked(self, workflow_id: str, message: str) -> RunResult:
        self.project.runs.append({"workflow_id": workflow_id, "status": "blocked", "message": message})
        self.project.events.append({"event": "quality_gate_blocked", "workflow_id": workflow_id, "message": message})
        return RunResult(workflow_id, "blocked", message)


def cli(argv: List[str]) -> int:
    if not argv or argv[0] == "list":
        for workflow_id, name, artifact_type, requires in WORKFLOWS:
            suffix = f" <- {', '.join(requires)}" if requires else ""
            print(f"{workflow_id} {name} [{artifact_type}]{suffix}")
        return 0
    if argv[0] == "new" and len(argv) >= 2:
        project = ResearchProject.create(" ".join(argv[1:]))
        print(json.dumps(project.to_dict(), ensure_ascii=False, indent=2))
        return 0
    print("usage: python -m research_os [list|new TITLE]", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(cli(sys.argv[1:]))
