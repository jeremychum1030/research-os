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

The current engine is deliberately deterministic and local. Hermes skills are the next execution adapter: each registered workflow can call its corresponding skill while retaining the same artifact and gate contracts.

## Scientific boundary

This project does not claim ethical approval, clinical validation, statistical approval, or publication acceptance. It records evidence, assumptions, limitations, provenance, and human approval requirements so those decisions remain auditable.
