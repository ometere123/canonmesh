# CanonMesh — Project Plan

## Mission

Build **CanonMesh** into a complete contract + frontend product, using the specifications in this folder as the source of truth.

CanonMesh is a production system for teams that create a large fictional world across scripts, quests, episodes, character notes and lore documents. Drafting and collaboration stay off-chain. GenLayer is used only when an editor wants a bounded statement to become part of the canonical universe. The contract remembers accepted canon semantically, retrieves the small set of prior facts most likely to conflict, and lets validators classify the new entry as compatible, intentional retcon, branch-only material, or unresolved conflict.

## MVP target

One world, multiple branches, bounded text canon entries, immutable public artifact bundles, semantic conflict retrieval, consensus classification, retcon supersession and a fully live StudioNet UI.

## Planning principles

1. Do not build the UI first and retrofit a weak contract.
2. Do not build consensus before deterministic state/version/size guards.
3. Do not store high-frequency work on-chain simply because it is easy to model.
4. Do not turn VecDB into a classifier. It is context retrieval.
5. Do not call a deployment “done” until a real StudioNet lifecycle is exercised.
6. Do not create fake fallback data in live mode.
7. Every meaningful work unit updates `handoff.md` immediately.
8. When a durable decision changes, update `memory.md` in the same work unit.

## Reference demo the implementation must support

Create a universe, accept three canon entries about a character and city, submit a compatible side-story fact, then submit an explicit retcon that changes the character's origin. Show VecDB related memories, validator decision, supersession links, version increment and branch timeline.

## Phase 0 — Repository and truth scaffold

- Create the recommended repository tree.
- Copy these blueprint docs verbatim first; do not rewrite them from memory.
- Add package manifests with pinned baseline versions.
- Add `.env.example` with StudioNet variables and no secrets.
- Create a placeholder README that explicitly says not deployed yet.
- Initialize `handoff.md` workflow and commit.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 1 — Deterministic contract skeleton

- Add dependency header and imports.
- Implement storage dataclasses, enums and counters.
- Implement create/register deterministic methods and view methods.
- Implement all size, role, namespace and version guards.
- Write direct tests for creation, invalid inputs, ownership, pagination and forbidden transitions.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 2 — Semantic memory

- Add the project-specific `VectorPointer`.
- Implement normalized embedding text exactly around: Embed each accepted canon entry using a normalized string containing world, branch, entity names, time anchors, location, claim type and bounded canon statement. A proposal embeds the same normalized shape and retrieves at most 8 nearest accepted entries within the same world/branch. Similarity only selects context; it never proves compatibility or conflict.
- Insert only invariant-approved records.
- Implement bounded KNN + namespace/version filters.
- Expose a preview view for testing/audit.
- Add tests proving a semantically related but out-of-namespace record cannot authorize anything.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 3 — Consensus path

- Define strict decision envelope and allowed enums.
- Implement leader logic for: Given the proposal, on-chain world charter, proposal mode and retrieved active canon entries, do validators agree on COMPATIBLE, RETCON_VALID, BRANCH_ONLY, CONFLICT, or INSUFFICIENT_CONTEXT? RETCON_VALID must agree on the exact active **same-branch** entry IDs superseded. BRANCH_ONLY must agree on the exact active **ancestor-branch** entry IDs shadowed only for that branch lineage. Validators compare decision-critical fields/IDs, not rationale prose.
- Implement independent validator reasoning rather than format-only validation.
- Treat fetched evidence as hostile/untrusted data.
- Add deterministic post-consensus validation.
- Add explicit abstain/failure path.
- Forge incorrect leader outputs in tests and prove rejection.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 4 — Contract-first data plane

- Keep the deployed Intelligent Contract as the sole authoritative application data source.
- Do not create a backend, application database, object store, custom indexer, Next.js API backend, or server-action state layer.
- Keep draft authoring ephemeral in browser form state or in users' existing writing tools.
- Support optional user-supplied public HTTPS evidence references only when paired with a SHA-256 digest; CanonMesh does not host evidence.
- Add source/tests that fail if a project backend or mock application-data path is introduced.

**Exit gate:** The repository still has exactly two deployable product layers — Intelligent Contract + Vercel frontend — and this is logged in `handoff.md`.
## Phase 5 — GenLayer web client

- Implement config/client/read-client modules.
- Implement injected-wallet provider and network gate.
- Implement typed contract reads and schema verification.
- Implement write helper and FINALIZED + GenVM execution check.
- Implement one direct live contract data-source boundary; there is no mock/fixture application data mode.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 6 — Distinct frontend

- Implement the visual archetype: editorial story bible with a marginalia rail, not a dashboard.
- Build routes around domain records, not generic cards.
- Build the semantic-memory context view.
- Build the transaction rail and authoritative receipt.
- Implement responsive/mobile behavior.
- Implement all empty/error/abstain states from `ui/ux.md`.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 7 — Integration and adversarial testing

- Wire browser forms and direct live contract reads/writes end to end; optional evidence remains user-supplied public URL + digest.
- Verify every frontend-required contract method against schema.
- Run deterministic/direct suites.
- Run wallet-session regressions.
- Test malformed RPC/contract data.
- Test missing evidence, stale version and forged consensus output.
- Run production build/typecheck/lint.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 8 — StudioNet proof

- Deploy a frozen source commit to StudioNet.
- Record address and deployment tx.
- Verify deployed source/schema.
- Execute the reference demo with real transactions.
- Capture at least one live consensus success.
- Capture at least one fail-closed/abstain path where feasible.
- Re-read all final state from chain.
- Update handoff/memory with exact facts only.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.
## Phase 9 — Release hardening

- Deploy hosted frontend in live mode.
- Exercise one write from hosted UI.
- Audit all copy for fabricated/unproven claims.
- Confirm no generated/local private-key path exists.
- Confirm no backend/database/indexer/API-route application layer exists.
- Run accessibility/responsive pass.
- Freeze release tag/commit and create reviewer-oriented deployment evidence.

**Exit gate:** All work is logged in `handoff.md`; relevant tests for this phase pass or the blocker is explicitly recorded.


## Workstreams and ownership

| Workstream | Primary outputs | Release blocker? |
|---|---|---|
| Intelligent Contract | State machine, VecDB, consensus, views | Yes |
| Direct/testing | Invariants, forged leader rejection, ABI/schema | Yes |
| Direct data plane | Browser forms + direct contract reads/writes | Yes |
| Web3 client | Injected wallet, reads/writes/finality | Yes |
| UI/UX | Domain-specific routes and states | Yes |
| StudioNet proof | Deployment + live transaction evidence | Yes |
| Documentation | Handoff, memory, deployment truth | Yes |

## Contract milestone checklist

- Implement and test `create_world(name, charter_text, charter_url, charter_digest) -> world_id`.
- Implement and test `set_editor(world_id, editor_address, enabled)`.
- Implement and test `create_branch(world_id, branch_name, parent_branch_id) -> branch_id`.
- Implement and test `submit_proposal(world_id, branch_id, mode, title, canon_statement, artifact_url, artifact_digest, entity_keys, time_anchor) -> proposal_id`.
- Implement and test `review_proposal(proposal_id) -> decision receipt`.
- Implement and test `cancel_proposal(proposal_id)`.
- Implement and test `get_world(world_id)`.
- Implement and test `get_branch(branch_id)`.
- Implement and test `get_entry(entry_id)`.
- Implement and test `get_proposal(proposal_id)`.
- Implement and test `list_world_entries(world_id, branch_id, offset, limit)`.
- Implement and test `preview_related(proposal_id, k)`.

## Invariant checklist

- Test: Only accepted entries are inserted into canonical VecDB memory.
- Test: A similarity hit can only supply context; it cannot set a proposal status.
- Test: RETCON_VALID must name existing same-world/same-branch entries and may supersede at most 8.
- Test: COMPATIBLE may not supersede anything.
- Test: CONFLICT and INSUFFICIENT_CONTEXT never mutate canon version or entries.
- Test: Artifact digest and URL are immutable after submission.
- Test: Branch parentage is immutable once created.

## UX milestone checklist

- Build and verify: World desk / universe switcher.
- Build and verify: Canon ledger.
- Build and verify: Entity dossier.
- Build and verify: Timeline strip.
- Build and verify: Proposal composer.
- Build and verify: Conflict table.
- Build and verify: Branch map.
- Build and verify: Decision receipt.
- Build and verify: Search / semantic recall.

## Risk register

| Risk | Early signal | Mitigation |
|---|---|---|
| Consensus prompts too large | timeouts/rotation spikes | lower KNN/evidence bounds; split cases |
| VecDB namespace contamination | irrelevant candidates | deterministic namespace/version filters |
| Frontend derives fake authority | UI infers final state locally | contract re-read is authoritative after every final action |
| Wrong-chain wallet writes | user wallet not 61999 | write gate in UI and client helper |
| Finalized rollback shown as success | receipt-only logic | inspect GenVM execution |
| UI drifts generic | component-kit/default template | enforce `ui/ux.md` screenshot review |
| Public evidence disappears | validator fetch failures | immutable/content-addressed refs + abstain |
| Runtime API differs from plan | compile/lint/integration failure | verify current SDK, log exact change, do not invent API |
| Overclaim in README | branch only unit-tested | proof table distinguishes direct vs live |

## Project-specific edge-case backlog

- Two different characters share a name; entity_keys must prevent accidental cross-context retrieval from becoming authoritative.
- Proposal is compatible with the branch but contradicts the parent timeline intentionally.
- Artifact URL is unavailable during review; classify UNAVAILABLE/abort with no state mutation rather than infer from caller text.
- Retcon claims to supersede an entry outside retrieved context; validators may reject, and deterministic code bounds IDs.
- Cosmetic rewording of a canon fact should not create a second canonical fact without an explicit editorial purpose.

## Definition of complete

The project is complete only when:

- the MVP flow works end to end;
- the contract is deployed on StudioNet;
- at least one real consensus path is proven;
- the frontend is wired to that contract;
- injected wallet is the only write mechanism;
- contract reads are authoritative;
- direct and frontend checks pass;
- UI is recognizably distinct;
- evidence and VecDB behavior are bounded;
- `memory.md` and `handoff.md` contain the exact final state.
