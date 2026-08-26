# CanonMesh — Product Requirements Document (PRD)

## 1. Product summary

**Consensus-managed canon for collaborative fictional universes.**

CanonMesh is a production system for teams that create a large fictional world across scripts, quests, episodes, character notes and lore documents. Drafting and collaboration stay off-chain. GenLayer is used only when an editor wants a bounded statement to become part of the canonical universe. The contract remembers accepted canon semantically, retrieves the small set of prior facts most likely to conflict, and lets validators classify the new entry as compatible, intentional retcon, branch-only material, or unresolved conflict.

The product uses a deliberate operating model:

1. high-frequency domain work happens off-chain;
2. a bounded, immutable/public artifact or case is frozen;
3. the Intelligent Contract retrieves only relevant semantic memory;
4. validators judge the semantic question independently;
5. deterministic contract code decides whether/how authoritative state changes.

## 2. Problem

The product must settle:

> **the canonical state of a fictional universe: which bounded facts belong to which version/branch and which earlier facts they supersede**

The problem is not that centralized software cannot produce an answer. It can. The problem is that when multiple parties care about the final result, letting one operator/model author the authoritative state reintroduces the trust assumption GenLayer is meant to remove.

## 3. Why GenLayer is load-bearing

Delete GenLayer and the system loses at least one of:

- independent access to public evidence;
- independent semantic judgment;
- agreement on decision-critical meaning;
- a shared immutable result other contracts can consume.

VecDB alone does not fix this. Similarity only identifies relevant history.

## 4. Goals

- Fast normal workflow off-chain.
- Explicit escalation to shared judgment.
- Project-owned semantic institutional memory.
- Version-bound rules/evidence.
- Deterministic, inspectable state changes.
- Composable final receipts.
- Distinct domain-specific user experience.
- Honest failure/abstain states.
- Real StudioNet deployment proof before release claims.

## 5. Non-goals

- writing the story with AI
- storing full scripts on-chain
- judging artistic quality
- private/unpublished manuscripts in VecDB
- automatic political approval of a retcon; the steward chooses proposal mode

## 6. Actors

| Actor | Role |
| --- | --- |
| world steward/editor | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| writer/contributor | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| reader/reviewer | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| GenLayer validator | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |
| external lore consumer | Participates in the domain workflow; exact authorization is defined in TRD/contract state. |

## 7. Scope split

### Off-chain

Drafting may happen in a user's normal writing tools or temporary browser form state. CanonMesh itself has **no backend, application database, object store or custom indexer**. A submitted proposal writes its bounded canon statement, branch/version metadata, entity keys and lifecycle directly to the Intelligent Contract. Optional public evidence is supplied as an independently hosted HTTPS URL plus SHA-256 digest; CanonMesh does not host it.

### On-chain

World charter hash; branches; accepted canon entries; proposal lifecycle; supersession links; semantic vector pointers; consensus classification; version counters; immutable decision receipts.

### Semantic memory

Embed each accepted canon entry using a normalized string containing world, branch, entity names, time anchors, location, claim type and bounded canon statement. A proposal embeds the same normalized shape and retrieves at most 8 nearest accepted entries within the same world/branch. Similarity only selects context; it never proves compatibility or conflict.

### Consensus question

Given the proposal, on-chain world charter, proposal mode and retrieved active canon entries, do validators agree on COMPATIBLE, RETCON_VALID, BRANCH_ONLY, CONFLICT, or INSUFFICIENT_CONTEXT? RETCON_VALID must agree on the exact active **same-branch** entry IDs superseded. BRANCH_ONLY must agree on the exact active **ancestor-branch** entry IDs shadowed only for that branch lineage. Validators compare decision-critical fields/IDs, not rationale prose.

## 8. MVP

One world, multiple branches, bounded text canon entries, immutable public artifact bundles, semantic conflict retrieval, consensus classification, retcon supersession and a fully live StudioNet UI.

The MVP is not considered complete until a hosted frontend performs the critical path against a real StudioNet deployment.

## 9. User stories

- As a **world steward/editor**, I can configure the authoritative rules/charter and see exactly which version every case uses.
- As a **writer/contributor**, I can perform normal work off-chain and escalate only the bounded cases that need shared judgment.
- As a **reader/reviewer**, I can inspect the public evidence and related semantic history without treating similarity as truth.
- As a **GenLayer validator**, I receive bounded, versioned inputs and can reject a semantically wrong leader decision.
- As an external integrator, I can read a typed final receipt without trusting a project-operated server or scraping rationale prose.

## 10. Lifecycle

Product statuses:

- DRAFT_OFFCHAIN
- SUBMITTED
- UNDER_REVIEW
- COMPATIBLE
- RETCON_VALID
- BRANCH_ONLY
- CONFLICT
- INSUFFICIENT_CONTEXT
- CANCELLED

Generic lifecycle:

```text
normal off-chain work
 -> freeze bounded public artifact/case
 -> on-chain submit
 -> deterministic preflight
 -> bounded semantic retrieval
 -> consensus
 -> deterministic validation/state transition
 -> finalized receipt
 -> frontend authoritative re-read
```

## 11. Product surfaces

| Route | Product surface | Primary action |
| --- | --- | --- |
| / | World desk | Open world or create world |
| /worlds/[worldId]/canon | Canon ledger | Inspect entry / propose addition |
| /worlds/[worldId]/entities/[entityKey] | Entity dossier | Open related canon |
| /worlds/[worldId]/timeline | Timeline strip | Filter by entity/location |
| /worlds/[worldId]/proposals/new | Proposal composer | Submit proposal |
| /proposals/[proposalId] | Conflict table | Run review / inspect decision |
| /worlds/[worldId]/branches | Branch map | Create branch |
| /receipts/[proposalId] | Decision receipt | Copy receipt / explorer |

The visual composition for each route is specified in `ui/ux.md`.

## 12. Functional requirements

### FR-1 — Public browsing

Where a record is public, the user can inspect it without connecting a wallet.

### FR-2 — Explicit wallet identity

Wallet connection occurs only after user action. Production writes are injected-wallet only and network-gated.

### FR-3 — Versioned top-level configuration

Rules/charter/rubric/manifests that affect a decision are versioned and visible in the resulting receipt.

### FR-4 — Off-chain work plane

Routine/high-volume work does not require one transaction per action.

### FR-5 — Immutable escalation

Before chain submission, the user can inspect the exact bounded artifact/reference/digest being committed. Editing afterward produces a new digest/version.

### FR-6 — Related-memory preview

The product can show relevant semantic memories, clearly labeled as related context.

### FR-7 — Consensus trigger

The eligible actor can trigger the project-specific review. Long-running consensus is represented as stages, not fake percentage progress.

### FR-8 — Fail closed

Unavailable evidence, malformed outputs, stale state or validator disagreement cannot silently become a positive decision. An inactive branch ancestor makes the selected lineage ineligible for new proposals, review, retrieval, and descendant creation until reactivated. Explicit semantic equivalence/cosmetic rewording does not silently append duplicate canon; it settles fail-closed without creating a new entry.

### FR-9 — Authoritative receipt

A final receipt includes record ID, contract/network, input version/digests, memory IDs, decision-critical output, tx/finality and resulting state.

### FR-10 — Append-only history

Historical decisions remain inspectable after later versions/corrections.

### FR-11 — Integrator surface

Stable view methods expose machine-readable final status.

## 13. Product-specific contract capabilities

- create_world(name, charter_text, charter_url, charter_digest) -> world_id
- set_editor(world_id, editor_address, enabled)
- create_branch(world_id, branch_name, parent_branch_id) -> branch_id
- submit_proposal(world_id, branch_id, mode, title, canon_statement, artifact_url, artifact_digest, entity_keys, time_anchor) -> proposal_id
- review_proposal(proposal_id) -> decision receipt
- cancel_proposal(proposal_id)
- get_world(world_id)
- get_branch(branch_id)
- get_entry(entry_id)
- get_proposal(proposal_id)
- list_world_entries(world_id, branch_id, offset, limit)
- preview_related(proposal_id, k)

## 14. Product-specific rules

- Only accepted entries are inserted into canonical VecDB memory.
- A similarity hit can only supply context; it cannot set a proposal status.
- RETCON_VALID must name existing active same-world/same-branch entries and may supersede at most 8.
- BRANCH_ONLY must name active inherited ancestor entries and may create at most 8 branch-local overrides; it never globally supersedes the ancestor.
- COMPATIBLE may not supersede or branch-override anything.
- CONFLICT and INSUFFICIENT_CONTEXT never mutate canon version or entries.
- Artifact digest and URL are immutable after submission.
- Branch parentage is immutable once created.

## 15. Public evidence requirements

- HTTPS/content-addressed and validator-accessible.
- Digest/version bound.
- Bounded before prompt construction.
- Treated as untrusted data.
- No private secrets in chain/VecDB.
- Unavailable source produces no invented positive result.

## 16. Primary reference scenario

World 'Vesper Archive': accepted facts establish Mira was born in Orin and joined the Cartographers in 2142. Compatible proposal says she maps the Salt March in 2144. Retcon says she was born in Vale, explicitly superseding the Orin entry.

Use this as a deterministic test/reference scenario and, after deployment, reproduce it with real StudioNet transactions. It must not become a mock application data mode.

## 17. Required edge behavior

- Two different characters share a name; entity_keys must prevent accidental cross-context retrieval from becoming authoritative.
- Proposal is compatible with the branch but contradicts the parent timeline intentionally.
- Artifact URL is unavailable during review; classify UNAVAILABLE/abort with no state mutation rather than infer from caller text.
- Retcon claims to supersede an entry outside retrieved context; validators may reject, and deterministic code bounds IDs.
- Cosmetic rewording of a canon fact should not create a second canonical fact without an explicit editorial purpose.

## 18. UX requirements

UI identity:

- **Archetype:** editorial story bible with a marginalia rail, not a dashboard
- **Signature:** A vertical manuscript gutter contains version markers and conflict annotations. The main pane reads like a printed story bible; the right rail shows semantically related canon as footnotes.
- **Fonts:** Source Serif 4 for canon text and headings; Instrument Sans for controls and metadata
- **Geometry:** square cards, ruled separators, 2px left-margin annotations, almost no pills; 6px corner radius maximum
- **Motion:** page-turn/crossfade only for branch changes; no floating blobs, glowing gradients or card-hover theatrics

The wallet must remain utility chrome. The main artifact/work object dominates.

## 19. Security requirements

1. No project backend/database/indexer exists; all application writes are direct browser-to-GenLayer.
2. Wrong-chain writes are blocked both in UI and client helper.
3. Finalized rollback/error is not success.
4. Unknown RPC/contract shape fails closed.
5. Prompt-injection-like fetched content cannot alter governing rules.
6. Similarity cannot directly authorize state.
7. Stale versions cannot mutate newer state.
8. Decision enums/IDs are deterministically bounded.
9. Public storage contains no secrets/private source material.
10. No live-mode fabricated fallback.

## 20. Success metrics

- 100% of writes injected-wallet signed.
- 100% final successes verified through GenVM execution + authoritative re-read.
- 0 mock/fixture application records or silent fake fallback in the production data path.
- 0 VecDB distance displayed as truth/confidence.
- 100% final decisions expose input versions/digests.
- One happy-path and one fail-closed/abstain path demonstrated before release.
- Fresh agent can implement from this pack + repository files without prior chat context.

## 21. Acceptance criteria

- [ ] Contract state/API implements the intended domain lifecycle.
- [ ] Direct tests cover every invariant.
- [ ] VecDB insert/retrieval rules are tested.
- [ ] Validator rejects a well-formed wrong leader payload in direct mode where tooling permits.
- [ ] No project backend/database/indexer is required; direct frontend contract reads are authoritative.
- [ ] Hosted UI follows `ui/ux.md`.
- [ ] Hosted UI reads deployed StudioNet state.
- [ ] Contract schema verified.
- [ ] StudioNet consensus path proven.
- [ ] Wallet/network regressions tested.
- [ ] Deployment facts recorded in `handoff.md`/`memory.md`.
- [ ] README/submission copy distinguishes live proof from direct-test coverage.

## 22. Reference end-to-end demo

Create a universe, accept three canon entries about a character and city, submit a compatible side-story fact, then submit an explicit retcon that changes the character's origin. Show VecDB related memories, validator decision, supersession links, version increment and branch timeline.
