# CanonMesh — Technical Requirements Document (TRD)

## 1. Technical objective

Build a production-quality GenLayer application whose authoritative contract settles which bounded facts belong to a fictional universe, which branch/version they belong to, and which earlier facts they supersede or locally shadow. GenLayer must be load-bearing: replacing the consensus path with one centralized LLM call must materially change the trust model.

## 2. Frozen engineering baseline

- Network: **GenLayer StudioNet**
- Chain ID: **61999**
- RPC: `https://studio.genlayer.com/api`
- Explorer: `https://explorer-studio.genlayer.com`
- Browser SDK: `genlayer-js` **1.1.8**
- Frontend: Next.js **16.3.2**, React **19.2.4**, React DOM **19.2.4**, TypeScript ^5, Tailwind CSS ^4
- Import `studionet` from `genlayer-js/chains`.
- Writes are injected-wallet only through `window.ethereum`.
- Never create, persist, import, display or fall back to a browser/local/server private key.
- If the SDK needs an account for reads, an ephemeral in-memory read account may be used only for reads.
- There is **no project backend, application database, custom indexer, API service, object store, queue or server-action state layer**.
- The Vercel frontend communicates directly with the deployed Intelligent Contract.
- Product pages never silently fall back to mock application data.

## 3. Wallet/session requirements

1. Do not auto-connect on load.
2. Request accounts only after explicit user action.
3. Track `accountsChanged`, `chainChanged` and provider `disconnect`.
4. Display the chain actually reported by the wallet.
5. Gate writes in both UI and transaction helper.
6. Re-check the provider/account/network immediately before signature.
7. On the wrong network, offer `wallet_switchEthereumChain` to StudioNet (`0xF22F` / 61999); if refused, keep writes disabled.
8. Account removal or provider disconnect clears the write session.

## 4. Transaction truthfulness

For every write:

1. submit with the injected GenLayer client;
2. wait for `TransactionStatus.FINALIZED`;
3. re-read the transaction;
4. inspect the GenVM leader execution result;
5. treat only explicit `SUCCESS` as application success;
6. treat finalized rollback/error/unknown execution as failure;
7. after success, re-read authoritative contract state before rendering the final state.

Recommended polling baseline: 5-second interval, up to 90 retries unless measured runtime behavior justifies a change.

Never show “success” after merely receiving a transaction hash.

## 5. Contract dependencies and VecDB

The deployable contract uses the proven embedding dependencies:

```python
# {
#   "Seq": [
#     { "Depends": "py-lib-genlayer-embeddings:0bmbm3cyfwxsyh454z53vxqjf47wz2q7smcqp1q4g4a6k2kidnyk" },
#     { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
#   ]
# }
```

Vector memory requirements:

- native contract-owned `genlayer_embeddings.VecDB`;
- dtype `np.float32`;
- dimensions `384`;
- model `all-MiniLM-L6-v2`;
- distance `EuclideanDistanceSquared`;
- vector payload is a small typed pointer to the accepted canon entry/world/branch;
- only authoritative accepted entries may be inserted;
- KNN is bounded to at most eight decision candidates after deterministic eligibility filtering;
- vector distance is relatedness only, never probability, truth, confidence, authority or approval.

The system must preserve this separation:

- embedding: **what should we look at?**
- validator reasoning: **what does it mean?**
- consensus: **do independent validators agree on the decision-critical interpretation?**
- deterministic contract code: **what state transition is allowed?**

## 6. Domain state model

Required conceptual records:

### World

`steward, name, charter_text, charter_url, charter_digest, version, branch_count, entry_count, proposal_count`

### Branch

`world_id, parent_branch_id, name, version, active, entry_count`

The root `main` branch is created with the world. Parentage is immutable.

### CanonEntry

`world_id, branch_id, proposal_id, title, statement, artifact_url, artifact_digest, entity_keys_json, time_anchor, accepted_at, superseded_by, overrides_json, status`

### Proposal

`proposer, world_id, branch_id, mode, title, statement, artifact_url, artifact_digest, entity_keys_json, time_anchor, status, decision, related_ids_json, supersedes_json, branch_overrides_json, rationale, base_branch_version, lineage_snapshot, submitted_at, reviewed_at, resulting_entry_id`

### VectorPointer

Small storage-safe pointer identifying an accepted entry and its deterministic namespace.

## 7. Proposal modes and decisions

Proposal modes:

- `ADD`
- `RETCON`
- `BRANCH`

Consensus decisions:

- `COMPATIBLE`
- `RETCON_VALID`
- `BRANCH_ONLY`
- `CONFLICT`
- `INSUFFICIENT_CONTEXT`

### `COMPATIBLE`

May create a new accepted entry but must not supersede or branch-override anything.

### `RETCON_VALID`

Allowed only for `RETCON` mode. Validators must independently agree on the exact active **same-world, same-branch** entry IDs superseded. Deterministic code rejects ancestor/cross-branch targets and limits the set to eight.

### `BRANCH_ONLY`

Allowed only for `BRANCH` mode on a child branch. Validators must independently agree on the exact active **ancestor-branch** entries shadowed for the selected branch lineage. The ancestor entry is never globally mutated; the override applies only to that branch and descendants.

### `CONFLICT`

No canonical mutation.

### `INSUFFICIENT_CONTEXT`

No canonical mutation. Use when evidence/context cannot support an independent positive decision.

## 8. Lineage and stale-state safety

A proposal freezes the relevant branch-lineage version snapshot at submission. Before consensus and again before mutation, the contract checks that the lineage is still current.

Required properties:

- branch creation/activation changes version state;
- stale pending proposals cannot mutate newer branch state;
- same-branch retcon never corrupts parent canon;
- branch-local overrides are inherited only by descendants of the diverging branch;
- inactive or superseded records are not eligible to authorize a fresh positive decision;
- if any ancestor in a selected branch lineage is inactive, the lineage is ineligible for proposal submission, review, semantic retrieval, and descendant branch creation until reactivated;
- settlement-critical target arrays are strict and atomic; booleans, floats, numeric strings, non-positive, duplicate, invalid, out-of-context, cross-world, wrong-branch/lineage, and wrong-entity IDs fail closed as a complete set;
- historical records remain inspectable.

## 9. Public evidence

CanonMesh does not host evidence.

A proposal may optionally bind an independently hosted public HTTPS artifact by URL + SHA-256 digest. If one is supplied:

- both URL and digest are required;
- URL/digest are immutable after submission;
- validators independently fetch the artifact during review;
- bytes are bounded before prompt construction;
- SHA-256 must match the committed digest;
- fetched content is treated as hostile/untrusted data, never instructions;
- unavailable/oversized/digest-mismatched evidence fails closed to a non-authorizing outcome.

No secrets or private manuscript material belong in public contract storage or VecDB.

## 10. Consensus implementation

Keep nondeterminism small.

### Before nondeterminism

Run deterministic checks for:

- caller role/authorization;
- record existence;
- proposal state;
- mode/enum validity;
- branch/world membership;
- frozen lineage freshness;
- string/list/count bounds;
- URL/digest shape;
- KNN and namespace bounds.

### Leader

The leader independently builds a bounded case from:

- on-chain world charter;
- proposal mode;
- bounded statement/title/entity keys/time anchor;
- branch ancestry;
- optional digest-verified public evidence excerpt;
- bounded active VecDB memories with IDs and branch provenance.

Return a strict bounded object containing only allowed decision enums, exact critical IDs and bounded rationale.

### Validator

The validator must do independent semantic work rather than validating JSON format only:

- independently obtain decision-critical external evidence;
- independently evaluate the same canon question;
- reject impossible IDs/branches/enums;
- compare decision-critical decision + critical IDs rather than rationale wording;
- fail closed when evidence cannot be independently obtained.

### After consensus

Deterministically:

1. validate the returned decision and every referenced ID;
2. re-check lineage/base state;
3. enforce same-branch retcon or ancestor-only branch-override rules;
4. apply the exact state transition once;
5. insert new VecDB memory only after authoritative acceptance;
6. update counters/versions/events;
7. persist an inspectable receipt.

## 11. Contract invariants

- Only accepted entries enter canonical VecDB memory.
- A similarity hit can supply context only.
- `RETCON_VALID` targets only active same-world/same-branch entries, max eight.
- `BRANCH_ONLY` targets only active inherited ancestor entries, max eight, and never globally supersedes them.
- `COMPATIBLE` has no supersession/override list.
- `CONFLICT` and `INSUFFICIENT_CONTEXT` never mutate canon entries or canonical versions as if accepted.
- Artifact URL/digest are immutable after submission.
- Branch parentage is immutable.
- A finalized transaction with GenVM rollback/error is never presented as success.
- Repeated review/finalization cannot apply the same mutation twice.

## 12. Public contract surface

The frontend-required surface must include and schema-check the implemented equivalents of:

- `create_world`
- `set_editor`
- `create_branch`
- branch activation/editor management where exposed by the implementation
- `submit_proposal`
- `review_proposal`
- `cancel_proposal`
- `get_world`
- `get_branch`
- `get_entry`
- `get_proposal`
- list world/branch/entity entries
- list world proposals
- `preview_related`
- semantic canon search
- `is_editor`
- `stats`

`lib/genlayer/required-methods.json` is the machine-readable frontend schema requirement. Any contract/API change must update contract, frontend wrapper, required-method list, tests and docs together.

## 13. Direct browser data plane

There is no CanonMesh application API boundary.

```text
React page/component
  -> lib/genlayer/data-source.ts
  -> typed contract wrapper
  -> genlayer-js client
  -> StudioNet CanonMesh contract
```

Rules:

- no `/api/*` product backend;
- no server action that persists/authorizes canonical state;
- no database/object store/indexer required;
- draft form state may exist only in browser memory or external user tools;
- product pages read live contract state;
- missing contract address is explicit configuration/unavailable state;
- read failure is explicit unavailable/error state;
- empty contract is a truthful empty state;
- no fixture/mock dataset silently substitutes for chain state.

## 14. Frontend routes

| Route | Screen | Primary action |
| --- | --- | --- |
| `/` | World desk | Open/create world |
| `/worlds/[worldId]/canon` | Canon ledger | Inspect/propose canon |
| `/worlds/[worldId]/entities/[entityKey]` | Entity dossier | Inspect related canon |
| `/worlds/[worldId]/timeline` | Timeline | Inspect temporal canon |
| `/worlds/[worldId]/branches` | Branch genealogy | Create/manage branch |
| `/worlds/[worldId]/proposals/new` | Proposal composer | Submit proposal |
| `/proposals/[proposalId]` | Proposal/consensus review | Run review / inspect decision |
| `/receipts/[proposalId]` | Decision receipt | Inspect/copy/explorer |
| `/search` | Semantic recall | Query related canon |

The frontend must follow `ui/ux.md`, with the manuscript/story-bible artifact visually dominant and wallet/network kept as utility chrome.

## 15. GenLayer client modules

Expected separation:

```text
lib/genlayer/
├── config.ts
├── client.ts
├── read-client.ts
├── contract.ts
├── execution.ts
├── data-source.ts
└── required-methods.json
```

Responsibilities:

- `config.ts`: StudioNet, endpoint, address, explorer URLs, method list.
- `client.ts`: injected write client.
- `read-client.ts`: non-custodial read client.
- `contract.ts`: typed views/writes and finality handling.
- `execution.ts`: robust leader execution-result parsing.
- `data-source.ts`: the sole live contract data boundary; no mock implementation.

## 16. Failure taxonomy

| Category | Meaning | UI behavior |
| --- | --- | --- |
| Expected input error | invalid user/state precondition | inline actionable error |
| Wrong network | wallet not on 61999 | block signature + switch action |
| Unavailable read | RPC/contract unavailable or malformed | explicit unavailable state |
| Consensus pending | transaction not finalized | transaction rail, no fake percentage |
| Consensus disagreement | no equivalent accepted decision | no authoritative positive state |
| GenVM rollback/error | finalized but execution failed | failure; re-read chain |
| Stale lineage | branch state changed | reject/invalidate, do not review stale case |
| Insufficient context | weak/unavailable evidence | neutral non-authorizing terminal outcome |

## 17. Testing requirements

### Contract/source/direct

Cover:

- creation/input bounds;
- editor authorization;
- branch parentage/activation;
- proposal modes and state transitions;
- stale lineage/base versions;
- accepted-only VecDB insertion;
- KNN bounds and namespace/lineage eligibility;
- same-branch retcon restrictions;
- ancestor-only branch overrides;
- replay/duplicate finalization;
- malformed consensus envelope;
- invented/cross-namespace IDs;
- missing/digest-mismatched evidence;
- forged syntactically valid but semantically wrong leader results where tooling permits.

### Frontend/source/session

Cover:

- no backend/API/mock-data path;
- required routes and required contract methods;
- connect refused;
- account change/removal;
- chain change;
- provider disconnect;
- wrong-chain write refusal;
- finalized rollback not success;
- success requires authoritative re-read;
- no contract address = unavailable/configuration state;
- raw vector distance is never labeled confidence.

### Build gate

`npm run verify` must run:

```text
preflight
-> direct/source tests
-> TypeScript
-> ESLint
-> Next production build
```

GitHub Actions runs this gate on Node 22 / Python 3.13.

## 18. StudioNet proof

Release proof requires more than source tests.

1. Freeze a source commit.
2. Deploy `contracts/canonmesh.py` to StudioNet using a supported GenLayer CLI/account.
3. Record contract address and deploy transaction.
4. Verify deployed schema against `required-methods.json`.
5. Execute deterministic create/config writes.
6. Exercise a real semantic-memory insertion path.
7. Exercise at least one real consensus success.
8. Exercise a fail-closed/insufficient path where practical.
9. Re-read final authoritative state after every write.
10. Record transaction hashes and actual GenVM results in `DEPLOYMENT.json`, `handoff.md` and `memory.md`.
11. Never claim unexercised branches as live-proven.

## 19. Hosted frontend proof

After StudioNet deployment:

- set `NEXT_PUBLIC_CANONMESH_CONTRACT` on Vercel;
- build/deploy the current verified commit;
- confirm public reads without wallet;
- connect an injected wallet explicitly;
- confirm wrong-network blocking and switch flow;
- execute at least one hosted write;
- verify FINALIZED + GenVM success + authoritative re-read in the hosted UI;
- record the exact public URL only after verification.

## 20. Reference scenario

Use the same deterministic scenario in tests and later reproduce it with real StudioNet transactions:

> World `Vesper Archive`: accepted facts establish Mira was born in Orin and joined the Cartographers in 2142. A compatible proposal says she maps the Salt March in 2144. A retcon says she was born in Vale and supersedes the active Orin birth entry in the same branch. A child-branch divergence must be demonstrated separately to prove local override behavior without rewriting its parent.

The reference scenario is test input, not mock application state and not live proof until the corresponding StudioNet transactions exist.
