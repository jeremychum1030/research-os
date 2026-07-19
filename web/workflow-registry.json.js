window.SciFlowRegistry = {
  "version": "0.1.0",
  "phases": [
    {
      "id": "inspiration",
      "label": "靈感",
      "range": "W00–W12",
      "icon": "✦"
    },
    {
      "id": "evidence",
      "label": "證據",
      "range": "W20–W24",
      "icon": "⌁"
    },
    {
      "id": "protocol",
      "label": "方案",
      "range": "W30–W33",
      "icon": "◈"
    },
    {
      "id": "data",
      "label": "數據",
      "range": "W40–W45",
      "icon": "▦"
    },
    {
      "id": "writing",
      "label": "撰寫",
      "range": "W50–W53",
      "icon": "✎"
    },
    {
      "id": "quality",
      "label": "質控",
      "range": "W60–W65",
      "icon": "✓"
    }
  ],
  "nodes": [
    {
      "id": "W00",
      "name": "Research Intake",
      "artifact_type": "research_intake",
      "requires": [],
      "phase": "inspiration",
      "status": "completed",
      "gate": "G0 信息完整性",
      "position": {
        "x": 70,
        "y": 80
      },
      "summary": "項目已建立 · 研究目標已收錄"
    },
    {
      "id": "W01",
      "name": "Research Router",
      "artifact_type": "routing_decision",
      "requires": [
        "W00"
      ],
      "phase": "inspiration",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 315,
        "y": 80
      },
      "summary": "Routing Decision"
    },
    {
      "id": "W02",
      "name": "Research Passport",
      "artifact_type": "research_passport",
      "requires": [
        "W00"
      ],
      "phase": "inspiration",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 560,
        "y": 80
      },
      "summary": "Research Passport"
    },
    {
      "id": "W10",
      "name": "Research Question",
      "artifact_type": "research_question",
      "requires": [
        "W00"
      ],
      "phase": "inspiration",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 805,
        "y": 80
      },
      "summary": "Research Question"
    },
    {
      "id": "W11",
      "name": "Landscape Mapping",
      "artifact_type": "landscape_map",
      "requires": [
        "W10"
      ],
      "phase": "inspiration",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 70,
        "y": 208
      },
      "summary": "Landscape Map"
    },
    {
      "id": "W12",
      "name": "Novelty Discovery",
      "artifact_type": "novelty_candidates",
      "requires": [
        "W11",
        "W23"
      ],
      "phase": "inspiration",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 315,
        "y": 208
      },
      "summary": "Novelty Candidates"
    },
    {
      "id": "W20",
      "name": "Search Design",
      "artifact_type": "search_protocol",
      "requires": [
        "W10"
      ],
      "phase": "evidence",
      "status": "completed",
      "gate": "G0 信息完整性",
      "position": {
        "x": 560,
        "y": 208
      },
      "summary": "Search Protocol"
    },
    {
      "id": "W21",
      "name": "Literature Retrieval",
      "artifact_type": "source_registry",
      "requires": [
        "W20"
      ],
      "phase": "evidence",
      "status": "completed",
      "gate": "G2 證據完整性",
      "position": {
        "x": 805,
        "y": 208
      },
      "summary": "24 個來源 · 已去重 · 3 個待核驗"
    },
    {
      "id": "W22",
      "name": "Paper Extraction",
      "artifact_type": "paper_cards",
      "requires": [
        "W21"
      ],
      "phase": "evidence",
      "status": "pending",
      "gate": "G2 證據完整性",
      "position": {
        "x": 70,
        "y": 336
      },
      "summary": "Paper Cards"
    },
    {
      "id": "W23",
      "name": "Evidence Mapping",
      "artifact_type": "evidence_map",
      "requires": [
        "W22"
      ],
      "phase": "evidence",
      "status": "pending",
      "gate": "G2 證據完整性",
      "position": {
        "x": 315,
        "y": 336
      },
      "summary": "Evidence Map"
    },
    {
      "id": "W24",
      "name": "Claim Audit",
      "artifact_type": "claim_audit",
      "requires": [
        "W23"
      ],
      "phase": "evidence",
      "status": "pending",
      "gate": "G2 證據完整性",
      "position": {
        "x": 560,
        "y": 336
      },
      "summary": "Claim Audit"
    },
    {
      "id": "W30",
      "name": "Study Design",
      "artifact_type": "study_design",
      "requires": [
        "W10",
        "W12"
      ],
      "phase": "protocol",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 805,
        "y": 336
      },
      "summary": "Study Design"
    },
    {
      "id": "W31",
      "name": "Protocol Builder",
      "artifact_type": "study_protocol",
      "requires": [
        "W30"
      ],
      "phase": "protocol",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 70,
        "y": 464
      },
      "summary": "Study Protocol"
    },
    {
      "id": "W32",
      "name": "Power Analysis",
      "artifact_type": "power_analysis",
      "requires": [
        "W31"
      ],
      "phase": "protocol",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 315,
        "y": 464
      },
      "summary": "Power Analysis"
    },
    {
      "id": "W33",
      "name": "Bias Ethics Feasibility",
      "artifact_type": "risk_review",
      "requires": [
        "W31"
      ],
      "phase": "protocol",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 560,
        "y": 464
      },
      "summary": "Risk Review"
    },
    {
      "id": "W40",
      "name": "Data Readiness",
      "artifact_type": "data_readiness",
      "requires": [
        "W31"
      ],
      "phase": "data",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 805,
        "y": 464
      },
      "summary": "資料集版本 0.4 · 權限待確認"
    },
    {
      "id": "W41",
      "name": "Data Exploration",
      "artifact_type": "eda_report",
      "requires": [
        "W40"
      ],
      "phase": "data",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 70,
        "y": 592
      },
      "summary": "Eda Report"
    },
    {
      "id": "W42",
      "name": "Statistical Analysis Plan",
      "artifact_type": "statistical_analysis_plan",
      "requires": [
        "W40"
      ],
      "phase": "data",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 315,
        "y": 592
      },
      "summary": "Statistical Analysis Plan"
    },
    {
      "id": "W43",
      "name": "Domain Analysis",
      "artifact_type": "analysis_run",
      "requires": [
        "W41",
        "W42"
      ],
      "phase": "data",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 560,
        "y": 592
      },
      "summary": "Analysis Run"
    },
    {
      "id": "W44",
      "name": "Results Audit",
      "artifact_type": "results_audit",
      "requires": [
        "W43"
      ],
      "phase": "data",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 805,
        "y": 592
      },
      "summary": "n=120 · 結果核對中"
    },
    {
      "id": "W45",
      "name": "Reproducibility Package",
      "artifact_type": "reproducibility_manifest",
      "requires": [
        "W43"
      ],
      "phase": "data",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 70,
        "y": 720
      },
      "summary": "Reproducibility Manifest"
    },
    {
      "id": "W50",
      "name": "Manuscript Architecture",
      "artifact_type": "manuscript_outline",
      "requires": [
        "W24",
        "W44"
      ],
      "phase": "writing",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 315,
        "y": 720
      },
      "summary": "Manuscript Outline"
    },
    {
      "id": "W51",
      "name": "Manuscript Drafting",
      "artifact_type": "manuscript_draft",
      "requires": [
        "W50"
      ],
      "phase": "writing",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 560,
        "y": 720
      },
      "summary": "Manuscript Draft"
    },
    {
      "id": "W52",
      "name": "Figures and Tables",
      "artifact_type": "figure_package",
      "requires": [
        "W44"
      ],
      "phase": "writing",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 805,
        "y": 720
      },
      "summary": "Figure Package"
    },
    {
      "id": "W53",
      "name": "Language and Tone Editing",
      "artifact_type": "polished_manuscript",
      "requires": [
        "W51"
      ],
      "phase": "writing",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 70,
        "y": 848
      },
      "summary": "Polished Manuscript"
    },
    {
      "id": "W60",
      "name": "Pre-review Integrity",
      "artifact_type": "integrity_report",
      "requires": [
        "W24",
        "W44",
        "W45",
        "W53"
      ],
      "phase": "quality",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 315,
        "y": 848
      },
      "summary": "Integrity Report"
    },
    {
      "id": "W61",
      "name": "Peer Review Simulation",
      "artifact_type": "review_reports",
      "requires": [
        "W60"
      ],
      "phase": "quality",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 560,
        "y": 848
      },
      "summary": "Review Reports"
    },
    {
      "id": "W62",
      "name": "Revision and Response",
      "artifact_type": "revision_package",
      "requires": [
        "W61"
      ],
      "phase": "quality",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 805,
        "y": 848
      },
      "summary": "Revision Package"
    },
    {
      "id": "W63",
      "name": "Re-review",
      "artifact_type": "rereview_report",
      "requires": [
        "W62"
      ],
      "phase": "quality",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 70,
        "y": 976
      },
      "summary": "Rereview Report"
    },
    {
      "id": "W64",
      "name": "Journal Submission",
      "artifact_type": "submission_package",
      "requires": [
        "W60",
        "W63"
      ],
      "phase": "quality",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 315,
        "y": 976
      },
      "summary": "Submission Package"
    },
    {
      "id": "W65",
      "name": "Final Integrity and Finalize",
      "artifact_type": "final_package",
      "requires": [
        "W64"
      ],
      "phase": "quality",
      "status": "pending",
      "gate": "G0 信息完整性",
      "position": {
        "x": 560,
        "y": 976
      },
      "summary": "Final Package"
    }
  ]
};