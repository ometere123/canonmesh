# CanonMesh

**Consensus-managed canon for collaborative fictional universes.**

CanonMesh is a GenLayer application for teams that need a shared, versioned story bible across branches, characters, places, timelines and retcons. Editors submit bounded canon statements. The Intelligent Contract retrieves only the nearest active canon memories from contract-owned VecDB, then independent GenLayer validators decide whether the proposal is compatible, a valid same-branch retcon, an intentional branch-local divergence, a conflict, or insufficiently supported.

## Why this is not an “AI decides X” demo

CanonMesh has a real protocol state machine:

- worlds have on-chain charters, stewards and editor roles;
- every world gets an immutable root `main` branch;
- branches carry versioned lineages;
- proposals freeze their lineage version snapshot at submission;
- VecDB is used only to retrieve bounded related canon;
- validators independently reason over the same charter, proposal and active semantic context;
- same-branch retcons can supersede only same-branch active canon;
- branch-only decisions shadow exact inherited entries only for that branch and descendants;
- conflicts and insufficient-context outcomes never mutate canon;
- only accepted entries enter canonical VecDB memory;
- final state transitions are deterministic after consensus.

## Deployment architecture

```text
Browser / Vercel frontend
          │
          ├── direct live reads (genlayer-js 1.1.8)
          └── injected-wallet writes
          │
          ▼
GenLayer StudioNet · chain 61999
          │
          ▼
CanonMesh Intelligent Contract
  ├── canonical state
  ├── VecDB semantic memory
  ├── independent validator consensus
  └── deterministic state transitions
```

There is **no project backend, application database, custom indexer, API service, server-action state layer, or mock application-data mode**. If the contract is empty, the UI shows a real empty state. Optional external evidence is independently hosted by the user and is accepted only as a public HTTPS URL paired with a SHA-256 digest that validators verify.

## Product surfaces

- `/` — editorial world desk / universe switcher
- `/worlds/[worldId]/canon` — append-only canon ledger with supersession history
- `/worlds/[worldId]/entities/[entityKey]` — entity dossier
- `/worlds/[worldId]/timeline` — time-anchor timeline
- `/worlds/[worldId]/branches` — branch genealogy and editor controls
- `/worlds/[worldId]/proposals/new` — bounded proposal composer
- `/proposals/[proposalId]` — semantic context + consensus review
- `/receipts/[proposalId]` — printable canonical decision receipt
- `/search` — direct contract VecDB semantic recall

The visual system is an editorial story bible with manuscript rules and marginalia, using paper/ink/vermilion/olive rather than a generic Web3/AI dashboard.

## GenLayer baseline

- Network: StudioNet
- Chain ID: `61999`
- RPC: `https://studio.genlayer.com/api`
- Explorer: `https://explorer-studio.genlayer.com`
- Browser SDK: `genlayer-js@1.1.8`
- Embedding model: `all-MiniLM-L6-v2`, 384 dimensions
- Writes: explicit injected wallet only
- Read account: ephemeral in-memory SDK account where required
- Success rule: wait for `FINALIZED`, re-read transaction, and require GenVM leader `execution_result === "SUCCESS"`

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the deployed contract address:

```bash
NEXT_PUBLIC_CANONMESH_CONTRACT=0x...
```

The frontend intentionally does not fall back to fake data if the address or network is unavailable.

## Verification

```bash
python -m pip install -r requirements-dev.txt
npm run preflight
npm run test:direct
npm run typecheck
npm run lint
npm run build
```

Or run the complete local gate:

```bash
npm run verify
```

Current deterministic/source suite covers accepted-only semantic memory, stale lineage, same-branch retcon safety, branch-local overrides, no-backend/no-mock architecture, required UI routes, injected-wallet behavior and finalized GenVM execution checks.

## StudioNet deployment

Current GenLayer CLI documentation uses:

```bash
npm install -g genlayer
genlayer network set studionet
genlayer account show
genlayer deploy --contract contracts/canonmesh.py
```

Or run `scripts/deploy-studionet.sh` after configuring a supported GenLayer CLI account. The repository never creates, prints or commits private keys. The current CLI documentation describes `genlayer account create` as an encrypted-keystore flow, so this project does not invent an unsupported passwordless-account mechanism.

Deployment status for the current release commit:

- Two StudioNet deployment transactions reached finalized/receipt-success state, but StudioNet contract schema and read calls returned `Contract not found` for both CLI-returned addresses.
- With GenLayer CLI `0.39.2`, both full receipts contained `data.contract_address` values byte-for-byte equal to the displayed addresses; no alternate receipt address was found.
- The supported address-based CLI/SDK schema, code and `gen_call(stats())` paths all failed for both receipt addresses. This remains a reproducible registration-resolution blocker, not a successful operational deployment.
- `DEPLOYMENT.json` records the public transaction evidence and keeps operational deployment/schema/lifecycle status explicitly unproven.
- No frontend or hosted URL is claimed until a returned address is resolvable by `gen_getContractSchema` and authoritative reads.

The current contract-owned VecDB API exposes global `knn(vector, k)` without metadata filtering or namespaces. CanonMesh therefore retains the bounded global top-32 scan followed by world/lineage filtering. A relevant entry beyond those 32 global neighbors can be starved; this limitation is documented and no unsupported VecDB filtering is claimed.

After a real operational deployment:

1. verify the deployment receipt/execution;
2. set `NEXT_PUBLIC_CANONMESH_CONTRACT`;
3. run `npm run verify:schema`;
4. run `npm run verify:studionet`;
5. exercise the canonical demo lifecycle with real StudioNet writes;
6. update `DEPLOYMENT.json`, `memory.md` and `handoff.md` with public proof only.

## Canon decision model

### `COMPATIBLE`
The proposal coexists with active canon in the selected branch lineage. No entries are superseded or shadowed.

### `RETCON_VALID`
Only valid for `RETCON` mode. Validators must independently agree on the exact active **same-branch** entries replaced. Deterministic code refuses ancestor/cross-branch targets.

### `BRANCH_ONLY`
Only valid on a child branch in `BRANCH` mode. Validators must independently agree on the exact active **ancestor-branch** entries the divergence shadows. Parent records remain unchanged and visible in their own lineage.

### `CONFLICT`
The proposal materially contradicts active canon without a valid retcon/branch interpretation. Canon is unchanged.

### `INSUFFICIENT_CONTEXT`
Evidence/context is too weak or cannot be independently verified. Canon is unchanged.

## Documentation

The repository includes the complete build specification and living continuity files:

- `AGENTS.md`
- `memory.md`
- `handoff.md`
- `prd.md`
- `trd.md`
- `architecture.md`
- `project-plan.md`
- `ui/ux.md`

`handoff.md` is updated after every meaningful work unit so another agent can continue without hidden conversation history.

## License

Apache-2.0.
