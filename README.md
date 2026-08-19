## Break to Adapt: Knowledge-Based Updates of Breaking Dependencies in JavaScript

This repository contains the research data and the current implementation of
BDUpdater.

## Agent-Native BDUpdater

BDUpdater has been redesigned as an agent skill for modern coding agents such
as TRAE CLI and Claude Code. The agent is now the reasoning and orchestration
layer: it reads upstream repositories, evaluates evidence, writes the structured
breaking-change list, reviews candidate locations, and performs downstream
adaptation.

The skill is located in [`BDUpdater/`](BDUpdater):

- [`BDUpdater/SKILL.md`](BDUpdater/SKILL.md): two-stage agent workflow and input
  contract.
- [`BDUpdater/references/`](BDUpdater/references): evidence, validation, repair,
  and TAPIR pattern rules.
- [`BDUpdater/scripts/`](BDUpdater/scripts): deterministic pattern compilation,
  TAPIR/ripgrep locating, AST context extraction, stage handoff, preflight, and
  completion validation.
- [`BDUpdater/static_components/`](BDUpdater/static_components): bundled static
  runtime and its production dependency manifest.

## Workflow

BDUpdater keeps the paper's two-stage design.

### Stage 1: Upstream Change Mining

The agent:

1. Collects changelogs, migration guides, release notes, commits, issues, pull
   requests, tests, and source changes.
2. Produces and refines `bc_final_list.json`.
3. Verifies each locatable breaking change against upstream source/diff
   evidence.
4. Compiles the structured changed-object description into TAPIR patterns.
5. Reviews uncertain access paths and writes `tapirN.json`.
6. Creates and validates `handoff.json`.

Stage 1 can run independently. Its handoff can be reused for multiple
downstream clients.

### Stage 2: Downstream Location and Repair

A fresh agent session can consume `handoff.json` without the Stage 1
conversation. It:

1. Runs the executable preflight.
2. Uses TAPIR as the mandatory initial locator.
3. Optionally runs ripgrep as supplemental recall.
4. Extracts AST contexts while preserving BC IDs and confidence provenance.
5. Repairs confirmed affected code and updates the dependency.
6. Records a disposition for every breaking change.
7. Validates tests/build checks, dependency state, lockfile policy, artifact
   hashes, and completion status.

See [`BDUpdater/SKILL.md`](BDUpdater/SKILL.md) for the full execution contract
and required inputs.

## Repository Layout

- `BDUpdater/`: agent skill implementation.
- `BDUpdater/static_components/`: bundled TAPIR static-analysis runtime.
- `data/preStudy/`: study data and literature review material.
- `data/motivationExample/`: motivating example used in the paper.
- `data/experiment/`: experiment metadata and outputs.
- `data/figures/`: paper figures.

## Acknowledgements

BDUpdater's downstream localization is based on **TAPIR (Tool for API
Recognition)** and includes substantial project-specific secondary development.

We thank Anders Moller, Benjamin Barslev Nielsen, and Martin Toldam Torp for the
original TAPIR implementation and its access-path pattern language for locating
JavaScript client code affected by breaking library changes.

- TAPIR project: https://brics.dk/tapir/
- Paper: [Detecting Locations in JavaScript Programs Affected by Breaking
  Library Changes](https://doi.org/10.1145/3428255)

## Requirements

The exact inputs are checked by the skill before each stage. The deterministic
components require:

- Python 3
- Node.js
- bundled TAPIR dependencies:
  `cd BDUpdater/static_components && npm install --omit=dev`
- `tree_sitter` and `tree_sitter_javascript`
- ripgrep for supplemental location
