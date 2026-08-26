# CanonMesh — Handoff Log

> Update after every meaningful work unit. Record what actually happened, not what was intended.

## Current checkpoint

- **Phase:** Release proof / deployment.
- **Architecture:** StudioNet Intelligent Contract + Vercel frontend only.
- **Contract:** implemented with VecDB, bounded semantic retrieval, independent validator reasoning, stale-lineage protection, same-branch retcons and branch-local overrides.
- **Frontend:** complete route surface implemented with direct live contract reads/writes, injected wallet, wrong-network gate, FINALIZED + GenVM execution verification and editorial story-bible UI.
- **GitHub verification:** GREEN on implemented code — preflight PASS, 20 direct/source tests, TypeScript PASS, ESLint completed with warnings only, Next.js 16.3.2 production build PASS.
- **StudioNet:** operational current release deployment is recorded below.
- **Vercel:** not deployed; no Vercel CLI/authenticated deployment context is available.
- **Next exact action:** from an environment with a supported authenticated GenLayer CLI account, freeze current `main`, deploy `contracts/canonmesh.py` to StudioNet, verify deployment execution/schema, then execute and record the real lifecycle proof before configuring Vercel.

## 2026-08-26 — Takeover attempt / environment blocker

- Confirmed checkout `HEAD` and `origin/main` are both `9d7084ae3e5af16d72cc8231fe99bcc867319b4b`; a fresh pull was attempted and GitHub HTTPS was unavailable.
- `requirements-dev.txt` installed successfully with the bundled Python runtime.
- `scripts/preflight.py`: PASS — 23 required contract methods, no backend paths.
- `pytest tests/direct -q`: PASS — 20 passed.
- Required JavaScript install is NOT PROVEN because the system npm launcher is broken and package downloads return `EACCES` from the available package manager, including with escalation.
- StudioNet deployment is BLOCKED in this environment: no `genlayer` executable and no authenticated supported CLI account are available. No deployment facts or lifecycle claims were made.

## 2026-08-26 — StudioNet deployment proof

- Using the supported `npm.cmd` CLI path, selected built-in StudioNet and used the existing unlocked account `0xb29Ead15B1E8A2420faE84de974088f67a15ccC2`.
- Deployed frozen commit `7a6eb49fae2cabd8f865ad2a4f232987c703e3a0`; contract source SHA-256 is `fbc45de30aad01dd4fbf0cf5f9e8ee8bb47b923993824cc35c04a6ea9fa154f9`.
- Deployment tx: `0xe2eb9438f5b44c395a10fd2e4fe2ab690322f471cef39b648c0182223dce4831`.
- Contract address: `0xE386595d8Eb891e07597a6BAEad32c27E749FEc9`.
- GenLayer receipt: `FINALIZED`; leader GenVM execution `SUCCESS`; stdout/stderr empty; no execution error.
- Independent StudioNet RPC receipt returned `status: 0x1`.
- Next exact action: set `NEXT_PUBLIC_CANONMESH_CONTRACT` to the deployed address, run schema/live-read checks, then execute and record every real lifecycle transaction with authoritative state re-reads.

## 2026-08-26 — Deployment registration blocker

- The first deployment transaction is receipt-verified (`FINALIZED`, leader `SUCCESS`, independent EVM `status: 0x1`) but `gen_getContractSchema`, `gen_getContractCode`, and `gen_call` all return `Contract 0xe386595d8eb891e07597a6baead32c27e749fec9 not found`.
- A second deployment of the exact same frozen source returned tx `0x6f108e4b557d709de9d5d28d148c7f3b82d587296fad2b284969c482f21c8635`; independent EVM receipt is `status: 0x1`, but its target `0x8Ca88ECbA344892a0e1f281c4c025897094dD8Bb` is also absent from `gen_getContractSchema`.
- This is a StudioNet/CLI deployment-registration blocker. Schema/live reads cannot be proven, so no lifecycle transactions or frontend deployment were attempted.

## 2026-08-26 — Receipt address and Direct Mode follow-up

- Confirmed CLI `0.39.2`, built-in `studionet` network, chain `61999`, RPC `https://studio.genlayer.com/api`, and active deployer `0xb29Ead15B1E8A2420faE84de974088f67a15ccC2`.
- Extracted complete receipts for both prior deployments. For tx `0xe2eb9438f5b44c395a10fd2e4fe2ab690322f471cef39b648c0182223dce4831`, `data.contract_address` is `0xE386595d8Eb891e07597a6BAEad32c27E749FEc9`; for tx `0x6f108e4b557d709de9d5d28d148c7f3b82d587296fad2b284969c482f21c8635`, it is `0x8Ca88ECbA344892a0e1f281c4c025897094dD8Bb`. Both match their CLI-displayed addresses byte-for-byte.
- Both receipts are `FINALIZED`, leader GenVM `SUCCESS`, and independent `eth_getTransactionReceipt` status `0x1`. Address-based CLI/SDK code, schema and `gen_call(stats())` checks still return `Contract not found`; no alternate canonical address was discovered. This is Case C registration resolution, not proven operational deployment.
- Added genuine GenLayer Direct Mode execution coverage using `genlayer-test 0.29.2` with the contract-pinned `v0.2.16` GenVM runner: deployment/create-world/root branch, authorization, invalid modes/bounds, compatible acceptance, same-branch retcon supersession, branch-local shadowing, sibling isolation, semantic retrieval, and insufficient-context no-entry behavior. Full direct suite result after correction: 23 passed (20 existing + 3 new).
- On Windows, `genlayer-test 0.29.2` has a harness cleanup bug when unlinking its still-open stdin temp file (`WinError 32`). `tests/direct/conftest.py` contains a narrowly scoped cleanup workaround; the contract remains loaded and executed by the real Direct VM.
- VecDB source inspection found only global `knn(vector, k)` and iteration, with no metadata filter or namespace. The existing bounded global top-32 scan can starve eligible same-world entries beyond rank 32; no unsupported fix was made. This remains a documented limitation requiring either future runtime filtering or an explicitly bounded contract indexing design.
- StudioNet schema/live reads remain NOT PROVEN; therefore no real StudioNet lifecycle, Vercel deployment or hosted-wallet write is claimed.

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

At the original implementation checkpoint, StudioNet deployment, schema parity and live lifecycle were not proven. Current deployment and lifecycle facts are recorded in the dated entries below. Still not proven: Vercel URL, hosted wallet write, remote Studio Mode disagreement, and several live negative paths.

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

## Hardening checkpoint

- Studio Mode isolation: the bundled executable is available and was invoked with `--network studionet`, but its fixtures remained Direct Mode; the temporary control contract passed in-memory. Remote Studio Mode control/CanonMesh deployment is `NOT PROVEN`.
- An inactive ancestor now makes a selected lineage ineligible for proposal submission, review, semantic retrieval, and descendant branch creation until reactivated.
- Review performs a second lineage freshness check immediately after consensus. Explicit `duplicate_of` equivalence settles `INSUFFICIENT_CONTEXT` without appending duplicate canon.
- Direct Mode covers unavailable, mismatched, and valid HTTPS SHA-256-bound evidence. Frontend writes remain in `confirming` until authoritative state re-read succeeds.
- The Direct Mode framework executes one mocked leader path and cannot simulate separate leader/validator responses; adversarial disagreement proof is `NOT PROVEN`.
- The strict-target hardening rejects malformed/mixed/duplicate/coerced IDs as complete target-set failures and applies deterministic entity-key intersection checks. `duplicate_of` is now persisted and returned by `get_proposal`; frontend parsing is updated.
- The bundled `gltest.exe` was invoked at `C:\Users\\USER\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\Scripts\\gltest.exe --network studionet`. Its available fixtures remained Direct Mode; a temporary control contract passed in-memory, so remote Studio Mode deployment remains `NOT PROVEN`.
- Fresh current-source CLI deployment is operational: commit `50506030388dd3570b6474d7ce02219b28ffe85b`, source SHA-256 `d19575da9f1e5d1f090cde62eb852377887adb588b729ae013b07f959c2fd71a`, address `0x86280023045b2801966f9561313DaeB82EdC3C74`, tx `0x934a31d7aef2b071091505c91bb8b22407a973f7f1bf477d6140decd3e1bfd36`. FINALIZED, leader SUCCESS, independent EVM receipt `0x1`, exact code/schema/stats reads PASS.
- Historical pre-release proof on the previous deployment commit: create world `0xbc1e7298d2506732246be06ab0f4f580be085f9f03a7bbf6020b17dee0b25c50`; child branch `0x2c309e82d31da739b73873d44d9d41209da529d8eff65a50e8c74b13e943df80`; proposal submission `0xc2b553e5b759dd15fa6f2fc5986e4ea293c31f1808d3d3700ca50d89b872ab4b`; COMPATIBLE review `0xd6867982769a30f2832ca93b03cd44a8172edd018d240d98041f520803a2598f`; grandchild `0x37489f8c24098be2d0481a6e7bebf9e9ae60ec3a73dfb030281caa06f7e06339`. All reached FINALIZED, leader SUCCESS, and state re-reads confirmed.
- Additional live proof on the current deployment: branch-only submission `0xc06334c81996be66ebb97f7de3ed667e6454ee0f7a5b5c9f956845ace0f1c888` and review `0xc20cc1dd68ff2c841ce03f0c612d2bbe8467cd271fe1e776984eef6d44a225dd` reached FINALIZED with leader SUCCESS. Proposal 3 settled BRANCH_ONLY, resulting entry 2 on branch 2 recorded override [1], while parent entry 1 remained readable. Same-branch RETCON submission `0x05ad69aba423fb8ad9e304d96a1254a8d921d3b6bb7d09f833f3182e76b20109` and review `0x6230c4ec7494c35a28978df0511175027ae0df022d2d8c7f2b8424c083076401` likewise reached FINALIZED with leader SUCCESS. Proposal 4 settled RETCON_VALID, resulting entry 3; entry 1 remained readable with superseded_by=3. Grandchild search returned current lineage entries.
- Final hardened release redeployed after strict envelope/duplicate validation changes: commit `b5c339435e440c9a99a1993b061525f1d8b689fb`, SHA-256 `8a6e4aa3a4fafab477618043637736d39e80988eb508a12f1736521f9d41528e`, address `0xCb4E8279Eff17c734c3eA2e32657691610b3467A`, tx `0x54856986a9b0bfd1f591e5027c9c36b2960e30edb10178fb97c4f80fe7c16f63`. Receipt address matches CLI, FINALIZED, leader SUCCESS, EVM receipt 0x1, code/schema/stats PASS.
- Final-source live proof: create world `0xa259a16ff111c9f54d231359c34b3092abd40355d187763e8e1f6ecbe331784b`; child branch `0x5968c462d853bb6ea41162aad1eea0d903070bd14d29f0ac3ebb5f9db1768031`; submit `0x235e05096ec18f765da5c4bd05fb1ea3fe4021f2d2ec7d162b66a434d0ced334`; review `0x5ab893d835b64e0878ed24e194a61bbba51250e1a6c6353e91526f4b877aa8de`. Each reached FINALIZED with leader SUCCESS; authoritative state is world=1, branches=2, proposal=1 COMPATIBLE, entry=1, and search_canon returns entry 1.
