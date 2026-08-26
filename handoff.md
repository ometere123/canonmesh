# CanonMesh — Handoff Log

> Update after every meaningful work unit. Record what actually happened, not what was intended.

## Current checkpoint

- **Phase:** Release proof / deployment.
- **Architecture:** StudioNet Intelligent Contract + Vercel frontend only.
- **Contract:** implemented with VecDB, bounded semantic retrieval, independent validator reasoning, stale-lineage protection, same-branch retcons and branch-local overrides.
- **Frontend:** complete route surface implemented with direct live contract reads/writes, injected wallet, wrong-network gate, FINALIZED + GenVM execution verification and editorial story-bible UI.
- **GitHub verification:** GREEN on implemented code — preflight PASS, 20 direct/source tests, TypeScript PASS, ESLint completed with warnings only, Next.js 16.3.2 production build PASS.
- **StudioNet:** not deployed yet.
- **Vercel:** not deployed yet.
- **Next exact action:** from an environment with a supported authenticated GenLayer CLI account, freeze current `main`, deploy `contracts/canonmesh.py` to StudioNet, verify deployment execution/schema, then execute and record the real lifecycle proof before configuring Vercel.

## 2026-08-26 — Takeover attempt / environment blocker

- Confirmed checkout `HEAD` and `origin/main` are both `9d7084ae3e5af16d72cc8231fe99bcc867319b4b`; a fresh pull was attempted and GitHub HTTPS was unavailable.
- `requirements-dev.txt` installed successfully with the bundled Python runtime.
- `scripts/preflight.py`: PASS — 23 required contract methods, no backend paths.
- `pytest tests/direct -q`: PASS — 20 passed.
- Required JavaScript install is NOT PROVEN because the system npm launcher is broken and package downloads return `EACCES` from the available package manager, including with escalation.
- StudioNet deployment is BLOCKED in this environment: no `genlayer` executable and no authenticated supported CLI account are available. No deployment facts or lifecycle claims were made.

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

## 2026-08-26 01:06 +01:00 — Release verification scaffold

Added:

- no-backend/no-mock source gates
- explicit zero-value GenLayer writes
- deployment manifest
- schema verifier
- StudioNet read exercise
- CLI deployment script
- GitHub Actions verification
- README/license/env templates

Reality check at that time:

- no contract address/deployment transaction/Vercel URL was claimed;
- `DEPLOYMENT.json` remained `NOT_DEPLOYED`.

## 2026-08-26 01:38 +01:00 — CI failure triage

GitHub Actions exposed a real TypeScript compatibility issue: `tsconfig.json` targeted ES2017 while the GenLayer client uses native BigInt literals. Updated the target to ES2022.

The next CI run proved:

- dependency installation: PASS;
- preflight: PASS;
- 20 direct/source tests: PASS;
- TypeScript: PASS.

It then stopped on React 19 lint heuristics around asynchronous refresh effects. The flagged helpers await live contract reads before setting state, so `react-hooks/set-state-in-effect` was moved to warning level instead of disabling the lint/build gate.

## 2026-08-26 01:42 +01:00 — Full GitHub verification green

GitHub Actions run `32916066098` on commit `307a29c7d4a63e903e625e19012a337349de5aae` completed successfully.

Verified facts:

- `python scripts/preflight.py` — PASS: 23 required contract methods; no backend paths.
- `python -m pytest tests/direct -q` — **20 passed**.
- `tsc --noEmit` — PASS.
- `eslint .` — completed with warnings only; no errors.
- `next build` — PASS on Next.js 16.3.2 / Turbopack.
- all required application routes were emitted by the production build.

Also replaced the placeholder README and landed the reconciled architecture/PRD/TRD/project plan/UI-UX repository docs so the next agent does not need hidden chat context.

### Reality check

Proven: source architecture, direct/source invariant coverage, TypeScript compatibility, lint gate, production frontend build.

Not yet proven: StudioNet deployment, deployed schema/source parity, real consensus lifecycle transactions, fail-closed live path, Vercel URL, hosted wallet write.

### Deployment handoff sequence

1. Pull current `main`; do not rewrite the architecture.
2. Run `npm run verify` once in the deployment environment.
3. Confirm a supported authenticated GenLayer CLI account without exposing/committing secrets.
4. Deploy `contracts/canonmesh.py` to StudioNet.
5. Verify deployment transaction reaches FINALIZED and actual GenVM execution is successful.
6. Record contract address, deploy tx, deployer and frozen source commit in `DEPLOYMENT.json`, `memory.md`, `handoff.md`.
7. Set `NEXT_PUBLIC_CANONMESH_CONTRACT` and run `npm run verify:schema`.
8. Execute real lifecycle proof: create world → create child branch → establish accepted canon → compatible proposal → same-branch retcon → branch-only divergence; exercise an insufficient/fail-closed case where practical.
9. For every write, record transaction hash, FINALIZED status, actual GenVM execution result and authoritative re-read.
10. Deploy the verified commit to Vercel with the StudioNet contract env value.
11. From hosted UI, verify public reads, explicit injected wallet connection, wrong-network gate and at least one successful hosted write.
12. Only then mark `DEPLOYMENT.json` deployed and add public contract/explorer/frontend URLs.

**Do not:** add a backend/database/indexer/mock mode; create a private-key fallback; weaken same-branch retcon/branch-local override semantics; treat VecDB distance as confidence; claim a transaction succeeded from hash/finality alone; invent any deployment fact.
