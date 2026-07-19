"""Export the canonical workflow registry for the browser client."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from research_os.engine import WORKFLOWS


PHASES = [
    {"id": "inspiration", "label": "靈感", "range": "W00–W12", "icon": "✦"},
    {"id": "evidence", "label": "證據", "range": "W20–W24", "icon": "⌁"},
    {"id": "protocol", "label": "方案", "range": "W30–W33", "icon": "◈"},
    {"id": "data", "label": "數據", "range": "W40–W45", "icon": "▦"},
    {"id": "writing", "label": "撰寫", "range": "W50–W53", "icon": "✎"},
    {"id": "quality", "label": "質控", "range": "W60–W65", "icon": "✓"},
]


def build_nodes():
    nodes = []
    for index, (workflow_id, name, artifact_type, requires) in enumerate(WORKFLOWS):
        phase = next((item for item in PHASES if workflow_id in _phase_ids(item["range"])), PHASES[-1])
        nodes.append({
            "id": workflow_id,
            "name": name,
            "artifact_type": artifact_type,
            "requires": requires,
            "phase": phase["id"],
            "status": "completed" if workflow_id in {"W00", "W20", "W21"} else "pending",
            "gate": "G2 證據完整性" if workflow_id in {"W21", "W22", "W23", "W24"} else "G0 信息完整性",
            "position": {"x": 70 + (index % 4) * 245, "y": 80 + (index // 4) * 128},
            "summary": _summary(workflow_id, artifact_type),
        })
    return nodes


def _phase_ids(range_text):
    start, end = range_text.split("–")
    start_num = int(start[1:])
    end_num = int(end[1:])
    return {f"W{number:02d}" for number in range(start_num, end_num + 1)}


def _summary(workflow_id, artifact_type):
    if workflow_id == "W00":
        return "項目已建立 · 研究目標已收錄"
    if workflow_id == "W21":
        return "24 個來源 · 已去重 · 3 個待核驗"
    if workflow_id == "W40":
        return "資料集版本 0.4 · 權限待確認"
    if workflow_id == "W44":
        return "n=120 · 結果核對中"
    return artifact_type.replace("_", " ").title()


def export(output):
    payload = {"version": "0.1.0", "phases": PHASES, "nodes": build_nodes()}
    Path(output).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    export(Path(__file__).parent / "workflow-registry.json")
