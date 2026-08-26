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

Never invent any of these.
