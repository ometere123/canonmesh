# CanonMesh — Handoff Log

> Update after every meaningful work unit. Record what actually happened, not what was intended.

## Current checkpoint

- **Phase:** GitHub delivery / CI verification.
- **Architecture:** StudioNet Intelligent Contract + Vercel frontend only.
- **Contract:** implemented with VecDB, bounded semantic retrieval, independent validator reasoning, stale-lineage protection, same-branch retcons and branch-local overrides.
- **Frontend:** complete route surface implemented with direct live contract reads/writes, injected wallet, wrong-network gate, FINALIZED + GenVM execution verification and editorial story-bible UI.
- **Local direct/source suite:** 21 passed before GitHub delivery.
- **Local npm/type/lint/build:** not proven because sandbox package installation was network-blocked.
- **GitHub Actions:** verification workflow added to run `npm run verify` on Node 22/Python 3.13.
- **StudioNet:** not deployed yet.
- **Vercel:** not deployed yet.

## 2026-08-23 — Blueprint pack

Created AGENTS, PRD, TRD, architecture, UI/UX, plan, memory and handoff. No code/deployment existed yet.

Durable defaults: StudioNet 61999, `genlayer-js` 1.1.8, injected-wallet writes, accepted-only semantic memory, distinct editorial UI.

## 2026-08-26 00:18 +01:00 — Architecture reconciliation

Final owner requirement superseded the old Worker/D1/R2 blueprint boundary. CanonMesh became contract + browser frontend only, with no application database/backend/indexer/mock-data mode. Optional public evidence is externally hosted and digest-bound.

Implemented initial protocol/client foundations: worlds, root branch, editor roles, branches, proposals, lineage snapshots, VecDB, semantic search, direct StudioNet data source and wallet/finality helpers.

## 2026-08-26 00:34 +01:00 — Canon semantics hardening

Discovered a critical branch semantics issue and fixed it:

- `RETCON_VALID` may supersede only active same-branch canon.
- `BRANCH_ONLY` uses branch-local override flags for active inherited ancestor canon.
- Ancestor entries are never globally mutated by child branches.
- Descendant branches inherit the override shadow.
- Branch activation changes bump version and can stale frozen proposals.

Implemented the full product route set: world desk, canon ledger, entity dossier, timeline, branch genealogy, proposal composer/review, semantic recall and decision receipt.

Verification at this stage:

- Python contract syntax: PASS.
- Preflight: PASS.
- direct/source tests: 20 passed.

## 2026-08-26 01:06 +01:00 — Release verification

Added:

- no-backend/no-mock source gates
- explicit zero-value GenLayer writes
- deployment manifest
- schema verifier
- StudioNet read exercise
- CLI deployment script
- GitHub Actions verification
- README/license/env templates

Verification:

- `python scripts/preflight.py` — PASS, 23 required methods, no backend paths.
- `python -m pytest tests/direct -q` — **21 passed**.
- local `npm install` — blocked by sandbox outbound package access.
- TypeScript/lint/Next production build — therefore not run locally.

Reality check:

- no contract address/deployment transaction/Vercel URL is claimed.
- `DEPLOYMENT.json` remains `NOT_DEPLOYED`.

## 2026-08-26 — GitHub branch delivery

Repository target: `ometere123/canonmesh`.

The source/config/contract/frontend/test/docs files are being committed directly to `main` so the final branch is self-contained and CI can verify real SDK/frontend compatibility.

**Next exact action:** inspect the latest GitHub Actions `verify` workflow; fix any type/lint/build failure found there. If CI is green, attempt StudioNet deployment only in an environment with supported GenLayer CLI/account/network access, then record public proof without secret material.
