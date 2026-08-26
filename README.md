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
- a lineage with an inactive ancestor cannot submit, review, retrieve, or create further descendants until reactivated;
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
npm ci
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
npm run test:frontend
npm run verify:deployment-source
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

Current release proof (GitHub main `27af44ec95341f6547b64cf64756d9babb722b58`): the unchanged deployed contract is `0xCb4E8279Eff17c734c3eA2e32657691610b3467A`, with source parity PASS and live schema/stats reads PASS. The release gate is 59 Python Direct/source tests plus 5 frontend unit tests, TypeScript PASS, ESLint 0/0, and production build PASS. The owner has deployed Vercel separately; its URL and hosted-wallet write are not exposed in this environment.

Current GenLayer CLI documentation uses:

```bash
npm install -g genlayer
genlayer network set studionet
genlayer account show
genlayer deploy --contract contracts/canonmesh.py
```

Or run `scripts/deploy-studionet.sh` after configuring a supported GenLayer CLI account. The repository never creates, prints or commits private keys. The current CLI documentation describes `genlayer account create` as an encrypted-keystore flow, so this project does not invent an unsupported passwordless-account mechanism.

Deployment status for the current release commit:

- Current source commit `b5c339435e440c9a99a1993b061525f1d8b689fb` is deployed at `0xCb4E8279Eff17c734c3eA2e32657691610b3467A` ([explorer](https://explorer-studio.genlayer.com/address/0xCb4E8279Eff17c734c3eA2e32657691610b3467A)).
- Deployment transaction: `0x54856986a9b0bfd1f591e5027c9c36b2960e30edb10178fb97c4f80fe7c16f63`; deployer: `0xb29Ead15B1E8A2420faE84de974088f67a15ccC2`.
- The receipt address matches the CLI address. It reached `FINALIZED`, leader GenVM execution was `SUCCESS`, and the independent StudioNet EVM receipt status was `0x1`.
- Address-based code, schema and `stats()` reads resolve successfully. Contract source SHA-256 is `8a6e4aa3a4fafab477618043637736d39e80988eb508a12f1736521f9d41528e`.
- The earlier unresolved deployments remain historical evidence only; they are not release proof for this hardened source.
- Final-source live proof includes world creation, root/child branch, evidence-bound COMPATIBLE canon, semantic retrieval. The remaining branch/retcon/negative-path transactions are listed as `NOT PROVEN` unless independently recorded in `DEPLOYMENT.json`.
- The owner has deployed the frontend to Vercel; the production URL and hosted-wallet proof are not available in this environment.

The current contract-owned VecDB API exposes global `knn(vector, k)` without metadata filtering or namespaces. CanonMesh therefore retains the bounded global top-32 scan followed by world/lineage filtering. A relevant entry beyond those 32 global neighbors can be starved; this limitation is documented and no unsupported VecDB filtering is claimed.

For the current operational deployment:

1. set `NEXT_PUBLIC_CANONMESH_CONTRACT` to the verified address;
2. run `npm run verify:schema` and `npm run verify:studionet`;
3. keep deployment source parity green with `npm run verify:deployment-source`;
4. consult `DEPLOYMENT.json` for the exact public transaction evidence.

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
