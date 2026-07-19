"""Build a transparent inventory of the active Hermes skill library."""
from __future__ import annotations

import json
import re
from pathlib import Path

SKILLS_ROOT = Path('/Users/jeremychum/.hermes/skills')
OUTPUT = Path(__file__).parents[1] / 'docs' / 'skill-catalog.json'

CURATED_GROUPS = {
    'research-orchestration': ['academic-pipeline', 'academic-deep-research', 'rw-research-router', 'rw-research-passport', 'rw-research-lab-router', 'research-synthesis'],
    'research-question-and-design': ['rw-research-question', 'rw-research-novelty', 'rw-research-design', 'experimental-design', 'statistical-power', 'ab-testing'],
    'literature-and-evidence': ['rw-literature-discovery', 'paper-lookup', 'pubmed-database', 'literature-review', 'arxiv-watcher', 'citation-management', 'rw-paper-extractor', 'rw-evidence-map', 'rw-claim-audit', 'rw-review-methods', 'rw-research-referee'],
    'data-and-statistics': ['rw-research-data', 'statistical-analysis', 'rw-statistics-audit', 'statsmodels', 'pymc', 'scikit-learn', 'polars', 'dask', 'vaex', 'xlsx'],
    'biomedical-and-omics': ['biopython', 'pysam', 'anndata', 'scanpy', 'pydeseq2', 'scvi-tools', 'pathway-enrichment', 'tiledbvcf', 'deeptools', 'histolab', 'pydicom', 'pyhealth', 'rdkit', 'deepchem', 'diffdock', 'molecular-dynamics'],
    'scientific-writing-and-publication': ['rw-phd-write', 'rw-phd-tone', 'scientific-writing', 'academic-paper', 'academic-paper-reviewer', 'rw-journal-submission', 'rw-revision-patch', 'venue-templates', 'scientific-visualization', 'scientific-schematics', 'scientific-slides', 'latex-posters', 'matplotlib', 'seaborn'],
    'quality-and-safety': ['thinking-scientific-method', 'thinking-bayesian', 'thinking-probabilistic', 'thinking-debiasing', 'thinking-red-team', 'zone-of-truth', 'security-review', 'healthcare-phi-compliance', 'hipaa-compliance'],
    'workflow-and-engineering': ['dynamic-workflow-mode', 'orch-pipeline', 'product-capability', 'system-design', 'agent-harness-construction', 'verification-loop', 'verification-before-completion', 'test-driven-development'],
}


def parse_metadata(path: Path):
    text = path.read_text(encoding='utf-8', errors='replace')
    header = text[:4000]
    name = re.search(r'^name:\s*["\']?([^"\'\n]+)', header, re.MULTILINE)
    desc = re.search(r'^description:\s*["\']?(.+?)["\']?\s*$', header, re.MULTILINE)
    return {
        'name': name.group(1).strip() if name else path.parent.name,
        'description': desc.group(1).strip() if desc else '',
        'path': str(path),
    }


def main():
    entries = []
    for skill_file in sorted(SKILLS_ROOT.glob('*/SKILL.md')):
        entry = parse_metadata(skill_file)
        entry['directory'] = skill_file.parent.name
        entry['curated_groups'] = [group for group, names in CURATED_GROUPS.items() if skill_file.parent.name in names]
        entries.append(entry)
    catalog = {
        'generated_from': str(SKILLS_ROOT),
        'skill_count': len(entries),
        'curated_groups': CURATED_GROUPS,
        'skills': entries,
    }
    OUTPUT.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'wrote {OUTPUT} with {len(entries)} skills')


if __name__ == '__main__':
    main()
