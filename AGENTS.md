# AGENTS.md — CanonMesh

## Required read order

1. `memory.md`
2. `prd.md`
3. `architecture.md`
4. `trd.md`
5. `ui/ux.md`
6. `project-plan.md`
7. `handoff.md`

Repository files are the source of truth. Do not rely on hidden chat/model memory.

## Mandatory operating loop

For every meaningful work unit: read relevant docs, make the smallest coherent change, run relevant checks, immediately update `handoff.md`, update `memory.md` for durable decisions, and keep docs/API/UI descriptions aligned with reality.

## Non-negotiables

- StudioNet, chain `61999`.
- `genlayer-js` exactly `1.1.8` unless explicitly approved otherwise.
- Injected wallet only for browser writes; no generated/local/server signer.
- FINALIZED is not success until GenVM leader execution is explicitly successful.
- Product architecture is **GenLayer Intelligent Contract + browser frontend only**.
- No project backend, application DB, custom indexer, project API service, worker or queue.
- Contract is the authoritative application source of truth.
- No mock/fixture application-data mode and no fake fallback state.
- VecDB retrieves related canon; it never decides truth or authorization by itself.
- Public storage is public; never put secrets/private manuscripts into contract storage or VecDB.
- Keep consensus bounded and fail closed.
- Same-branch retcon and branch-local divergence are distinct state transitions.
- Do not turn CanonMesh into a generic “AI decides X” wrapper.
- Follow `ui/ux.md`; do not replace the story-bible/marginalia system with a generic SaaS/Web3 template.

## Core invariant

**Only accepted canon entries enter canonical VecDB memory.**

## Definition of done

Code, tests, deployment evidence, documentation and `handoff.md` must agree about reality. Never claim a deployment, transaction, test or hosted URL that has not actually been verified.
