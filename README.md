# Research OS

Artifact-driven, resumable research workflows for Hermes Agent.

## What is implemented

- 31 registered workflows covering intake through finalization.
- Dependency-aware execution with blocking quality gates.
- Versioned artifacts with SHA-256 content hashes and provenance links.
- Project state, run history, and quality-gate events.
- Dependency-free Python 3.9+ engine and CLI.
- Blueprint documenting the complete scientific operating model.

## Run

```bash
python3 -m research_os list
python3 -m research_os new "Your research project"
python3 -m unittest discover -s tests -v
```

## Skill organization

The research skill library is organized around one router instead of parallel orchestrators:

- `research-os-router` is the single research entry point.
- `rw-research-router` handles normal day-to-day stage routing.
- `academic-pipeline` handles large end-to-end manuscript projects.
- `rw-research-passport` persists project state and handoffs.
- Domain skills such as `scanpy`, `pymc`, `statsmodels`, and `pysam` are conditional executors.
- Evidence, statistics, provenance, reporting-guideline, and human-approval gates remain explicit.

See [`docs/skill-catalog-and-routing.md`](docs/skill-catalog-and-routing.md), [`docs/skill-catalog.json`](docs/skill-catalog.json), and [`hermes/research-os-router/SKILL.md`](hermes/research-os-router/SKILL.md).

## Scientific boundary

This project does not claim ethical approval, clinical validation, statistical approval, or publication acceptance. It records evidence, assumptions, limitations, provenance, and human approval requirements so those decisions remain auditable.
