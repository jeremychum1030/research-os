---
name: research-os-router
description: Route research work through the active Hermes scientific skill library using one primary workflow, conditional domain executors, standard artifacts, and blocking quality gates. Use for any research, literature, biomedical, statistics, manuscript, peer-review, or journal-submission task.
version: 0.1.0
license: MIT
metadata:
  hermes:
    tags: [research, science, literature, statistics, biomedical, workflow, routing, provenance]
    category: research
---

# Research OS Router

This is the single entry point for the active research skill library. It routes a task to one primary workflow, adds only the conditional specialist skills required by the study type and inputs, and records a standard artifact handoff.

## Non-negotiable routing rules

1. Select exactly one primary orchestrator for a run:
   - `rw-research-router` for a normal single-step task.
   - `academic-pipeline` for a large end-to-end manuscript/project.
   - `academic-deep-research` for a multi-cycle evidence investigation.
   - `rw-research-lab-router` when the right scientific executor is unclear.
2. Do not run all research orchestrators in parallel.
3. Treat search results as candidate sources until identity and full text are verified.
4. Keep exploratory, confirmatory, and post-hoc analysis explicitly separated.
5. Writing and language skills may not change numbers, effect direction, causal strength, limitations, or uncertainty.
6. Human approval is required before ethics, clinical, statistical, authorship, submission, or public-release claims.

## Route by intent

| User intent | Primary route | Supporting skills |
|---|---|---|
| Define a question | `rw-research-question` | `rw-research-novelty`, `rw-research-design` |
| Search literature | `rw-literature-discovery` | `paper-lookup` or `pubmed-database`, then `rw-paper-extractor` |
| Conduct a systematic review | `literature-review` | `rw-review-methods`, `rw-evidence-map`, PRISMA checklist |
| Map evidence/gaps | `rw-evidence-map` | `rw-paper-extractor`, `research-synthesis`, `rw-claim-audit` |
| Design a study | `rw-research-design` | `experimental-design`, `statistical-power`, `rw-research-referee` |
| Prepare/analyse data | `rw-research-data` | `statistical-analysis`, one domain executor |
| Run classical statistics | `statistical-analysis` | `statsmodels`, `rw-statistics-audit` |
| Run Bayesian analysis | `pymc` | `statistical-analysis`, posterior checks, `rw-statistics-audit` |
| Analyze omics | `rw-research-lab-router` | `scanpy`, `pydeseq2`, `anndata`, `pysam`, `pathway-enrichment` as triggered |
| Draft a manuscript | `rw-phd-write` or `scientific-writing` | `rw-evidence-map`, `rw-claim-audit`, `rw-phd-tone` |
| Audit a manuscript | `rw-research-referee` | `rw-claim-audit`, `rw-statistics-audit`, `academic-paper-reviewer` |
| Submit/revise | `rw-journal-submission` | `venue-templates`, `rw-revision-patch`, `academic-paper` |

## Route by study type

- Randomized trial: protocol/reporting profile, `experimental-design`, `statistical-power`, registration/ethics/data-sharing gate, SPIRIT/CONSORT checklist.
- Observational study: confounding and bias review, STROBE checklist.
- Diagnostic accuracy: STARD checklist and reference-standard/threshold audit.
- Prediction model: TRIPOD checklist, calibration/discrimination and external-validation audit.
- Systematic review/meta-analysis: review protocol, search log, screening/extraction/risk-of-bias artifacts, PRISMA checklist.
- Case report: CARE checklist, consent/privacy gate.
- Animal study: ARRIVE checklist, welfare/3Rs gate.
- Economic evaluation: CHEERS checklist.
- Human/identifiable data: privacy, consent, access-control, and ethics-status gate.

## Standard handoff

Every route must produce or update:

```text
ResearchPassport
ResearchQuestion or StudyTypeProfile
SourceRegistry / DatasetManifest
EvidenceMap or AnalysisPlan
QualityGateResult
NextAction
```

Each artifact must retain `artifact_id`, `project_id`, `version`, `source_artifacts`, `content_hash`, `status`, `claims`, `limitations`, `open_questions`, and `human_approval`.

## Gate-first behavior

Before executing a downstream workflow, check its dependencies. If a gate fails, stop and return:

```text
status: blocked
gate_id:
failed_checks:
evidence_required:
suggested_next_workflow:
human_decision_required:
```

Do not fill missing sources, data, ethics decisions, registry records, statistics, or journal requirements by inference.

## Default end-to-end route

```text
rw-research-passport
→ rw-research-question
→ rw-research-novelty
→ rw-literature-discovery
→ rw-paper-extractor
→ rw-evidence-map
→ rw-research-design
→ statistical-power
→ rw-research-data
→ statistical-analysis
→ rw-statistics-audit
→ rw-phd-write
→ rw-phd-tone
→ rw-claim-audit
→ rw-research-referee
→ rw-journal-submission
→ rw-revision-patch
→ academic-pipeline
```

Add domain executors only after the study type, data format, and analysis plan justify them. Finish by updating `rw-research-passport` and recording unresolved limitations.
