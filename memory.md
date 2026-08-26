# CanonMesh — Project Memory

> Repository-local durable context. Update only for lasting decisions/status changes.

## Identity

**CanonMesh** — consensus-managed canon for collaborative fictional universes.

It settles which bounded facts belong to which world/branch/version and which earlier facts they supersede or branch-locally shadow.

## Current status

- Contract + full frontend implemented on `main`.
- Architecture: StudioNet Intelligent Contract + Vercel frontend only.
- GitHub verification gate is proven green on the implemented code: preflight PASS, **20 direct/source tests passed**, TypeScript PASS, ESLint completed with warnings only, Next.js `16.3.2` production build PASS.
- Production build generated all required CanonMesh routes.
- StudioNet deployment: **not yet proven**.
- Live Vercel frontend: **not yet proven**.
- `DEPLOYMENT.json` remains `NOT_DEPLOYED` until real public proof exists.

## Frozen engineering defaults

- StudioNet / chain `61999`
- RPC `https://studio.genlayer.com/api`
- explorer `https://explorer-studio.genlayer.com`
- `genlayer-js@1.1.8`
- Next.js `16.3.2`
- React / React DOM `19.2.4`
- TypeScript `^5`, target ES2022
- Tailwind `^4`
- injected wallet only for browser writes
- VecDB `all-MiniLM-L6-v2`, 384 dimensions, Euclidean distance
- similarity = retrieval only
- FINALIZED + explicit GenVM execution success before UI success

## Product boundary

There is no project backend, application database, custom indexer, project API, worker, queue or mock application-data mode. The frontend talks directly to the deployed Intelligent Contract. Optional public evidence is hosted independently by users and bound by SHA-256.

## Contract invariants

- accepted entries only are inserted into VecDB
- similarity cannot set final proposal status
- proposal lineage versions are frozen at submission and rechecked before review
- selected lineages with any inactive ancestor are ineligible for proposal submission, review, semantic retrieval, and descendant branch creation until reactivated
- explicit duplicate/equivalent canon identification settles `INSUFFICIENT_CONTEXT` and creates no second entry
- settlement target arrays are now strictly atomic, and non-empty entity-key intersections are required for retcon/branch target identity; validated `duplicate_of` is persisted in proposals
- RETCON_VALID targets only active same-world same-branch canon, max 8
- child branch cannot retcon/global-mutate parent canon
- BRANCH_ONLY targets active inherited ancestor canon, max 8
- branch overrides apply only to that branch and descendants
- COMPATIBLE supersedes/overrides nothing
- CONFLICT / INSUFFICIENT_CONTEXT create no canon entry and no VecDB memory
- branch parentage is immutable
- root `main` cannot be deactivated
- branch active changes bump branch version
- optional evidence must be HTTPS + SHA-256 pair and fails closed when unavailable/mismatched

## Consensus

Allowed decisions: `COMPATIBLE`, `RETCON_VALID`, `BRANCH_ONLY`, `CONFLICT`, `INSUFFICIENT_CONTEXT`.

Validators independently evaluate the same bounded charter, proposal, optional verified evidence and active retrieved canon. Decision enum must match. RETCON additionally requires exact supersession IDs; BRANCH additionally requires exact branch-override IDs.

## UI identity

Editorial story bible with marginalia rail, manuscript rules and preserved history. Palette: paper `#F3EBDD`, ink `#201B17`, vermilion `#B74432`, olive `#697255`, charcoal `#4B443D`. Source Serif 4 + Instrument Sans. No generic gradient AI/Web3 dashboard.

## Durable decisions

- 2026-08-23: VecDB is retrieval, never verdict.
- 2026-08-23: injected wallet is the only browser write identity.
- 2026-08-23: weak/malformed evidence fails closed.
- 2026-08-26: final architecture is contract + frontend only; old Worker/DB blueprint language is superseded.
- 2026-08-26: same-branch retcon and branch-local inherited-canon divergence are separate protocol mechanisms.
- 2026-08-26: TypeScript target is ES2022 because the GenLayer browser client uses native BigInt literals.
- 2026-08-26: `react-hooks/set-state-in-effect` is warning-level because the flagged refresh effects call asynchronous contract reads before state updates; the production gate still runs ESLint and fails on actual lint errors.

## Verified repository evidence

GitHub Actions run `32916066098` on commit `307a29c7d4a63e903e625e19012a337349de5aae` completed successfully:

- preflight: PASS — 23 required contract methods, no backend paths
- direct/source tests: 20 passed
- TypeScript: PASS
- ESLint: PASS with warnings only
- Next production build: PASS
- built routes: `/`, `/proposals/[proposalId]`, `/receipts/[proposalId]`, `/search`, `/worlds/[worldId]/branches`, `/worlds/[worldId]/canon`, `/worlds/[worldId]/entities/[entityKey]`, `/worlds/[worldId]/proposals/new`, `/worlds/[worldId]/timeline`

## Remaining facts to prove

- StudioNet contract address / deploy transaction / deployer / source parity
- real deterministic and consensus lifecycle transaction hashes + actual GenVM results
- fail-closed/insufficient live path where practical
- Vercel production URL
- at least one hosted injected-wallet write against the deployed contract

## 2026-08-26 — Takeover environment checkpoint

- Checkout is at `9d7084ae3e5af16d72cc8231fe99bcc867319b4b`; `origin/main` resolves to the same SHA. A fresh `git pull origin main` was attempted but GitHub HTTPS was unavailable from this environment.
- `requirements-dev.txt` installation passed using the bundled Python runtime.
- `scripts/preflight.py` passed: 23 required contract methods and no backend paths.
- `pytest tests/direct -q` passed: 20 tests.
- JavaScript dependency installation could not complete: the system npm launcher is broken and registry package downloads return `EACCES` from the available package manager, including after an escalation attempt. Therefore the npm verification scripts are not proven in this environment.
- No `genlayer` CLI executable or authenticated account is available in this environment. StudioNet deployment, live lifecycle, Vercel deployment, and hosted-wallet proof remain NOT PROVEN.

## 2026-08-26 — StudioNet deployment proven

- Frozen source commit: `7a6eb49fae2cabd8f865ad2a4f232987c703e3a0`.
- Contract source SHA-256: `fbc45de30aad01dd4fbf0cf5f9e8ee8bb47b923993824cc35c04a6ea9fa154f9`.
- Network: StudioNet, chain `61999`, RPC `https://studio.genlayer.com/api`.
- Deployer: `0xb29Ead15B1E8A2420faE84de974088f67a15ccC2`.
- Contract: `0xE386595d8Eb891e07597a6BAEad32c27E749FEc9`.
- Deployment transaction: `0xe2eb9438f5b44c395a10fd2e4fe2ab690322f471cef39b648c0182223dce4831`.
- GenLayer receipt: `FINALIZED`; leader `execution_result: SUCCESS`; GenVM stdout/stderr empty and no error.
- Independent RPC `eth_getTransactionReceipt`: `status: 0x1`.
- The repository schema script and CLI `schema`/`call` checks return `Contract ... not found` for the returned address, including after a delay. A second unchanged deployment attempt (`0x6f108e4b557d709de9d5d28d148c7f3b82d587296fad2b284969c482f21c8635`) also has independent EVM receipt `status: 0x1`, but its target `0x8Ca88ECbA344892a0e1f281c4c025897094dD8Bb` is likewise not registered by `gen_getContractSchema`.
- Therefore operational contract deployment, schema verification, live lifecycle, Vercel deployment and hosted-wallet proof remain NOT PROVEN. Do not configure or publish the frontend against either address.

## 2026-08-26 — Direct Mode and registration diagnosis

- GenLayer CLI `0.39.2` is configured for built-in StudioNet; active deployer is the existing unlocked account `0xb29Ead15B1E8A2420faE84de974088f67a15ccC2`.
- Full deployment receipt extraction proves `data.contract_address` matches the CLI-displayed address for both prior transactions. This rules out an incorrect predicted/displayed address as the current explanation.
- Added 3 genuine Direct Mode contract execution tests; complete direct suite is 23 passed using `genlayer-test 0.29.2` and pinned GenVM runner `v0.2.16`. Direct Mode covers deployment, state writes/reads, authorization and lifecycle invariants with mocked LLM output for nondeterministic review.
- VecDB runtime API has no metadata filtering or namespace. Global top-32 retrieval followed by world/lineage filtering is bounded but can starve eligible entries ranked after 32; this is documented as a runtime limitation, not fixed with unsupported APIs.
- Frontend writes now expose a confirming-state stage and only display terminal success after an authoritative contract re-read; transaction hashes/finality are not persisted by the contract and are therefore local transaction proof.
- Fresh current-source deployment: commit `50506030388dd3570b6474d7ce02219b28ffe85b`, source SHA-256 `d19575da9f1e5d1f090cde62eb852377887adb588b729ae013b07f959c2fd71a`, address `0x86280023045b2801966f9561313DaeB82EdC3C74`, tx `0x934a31d7aef2b071091505c91bb8b22407a973f7f1bf477d6140decd3e1bfd36`. Receipt is FINALIZED/leader SUCCESS, EVM status `0x1`; code/schema/stats reads pass.
- Live lifecycle proof on that address: create world `0xbc1e7298d2506732246be06ab0f4f580be085f9f03a7bbf6020b17dee0b25c50`, child `0x2c309e82d31da739b73873d44d9d41209da529d8eff65a50e8c74b13e943df80`, submit `0xc2b553e5b759dd15fa6f2fc5986e4ea293c31f1808d3d3700ca50d89b872ab4b`, review `0xd6867982769a30f2832ca93b03cd44a8172edd018d240d98041f520803a2598f`, grandchild `0x37489f8c24098be2d0481a6e7bebf9e9ae60ec3a73dfb030281caa06f7e06339`; each FINALIZED with leader SUCCESS and authoritative reads confirmed. Full proof is in `DEPLOYMENT.json`.

Never invent any of these.
## Live proof continuation (2026-08-26)

On current deployment `0x86280023045b2801966f9561313DaeB82EdC3C74`, branch-only submission `0xc06334c81996be66ebb97f7de3ed667e6454ee0f7a5b5c9f956845ace0f1c888` and review `0xc20cc1dd68ff2c841ce03f0c612d2bbe8467cd271fe1e776984eef6d44a225dd` finalized with leader SUCCESS. Proposal 3 became BRANCH_ONLY and created entry 2 on branch 2 with override [1]. RETCON submission `0x05ad69aba423fb8ad9e304d96a1254a8d921d3b6bb7d09f833f3182e76b20109` and review `0x6230c4ec7494c35a28978df0511175027ae0df022d2d8c7f2b8424c083076401` finalized with leader SUCCESS. Proposal 4 became RETCON_VALID, created entry 3, and entry 1 remained readable with superseded_by=3. Grandchild branch search returned the active lineage entries. Duplicate, conflict, stale, inactive-ancestor and evidence-failure live scenarios remain NOT PROVEN.
