# CanonMesh — UI/UX Specification

## 1. Design thesis

**Archetype:** editorial story bible with a marginalia rail, not a dashboard

**Signature:** A vertical manuscript gutter contains version markers and conflict annotations. The main pane reads like a printed story bible; the right rail shows semantically related canon as footnotes.

The interface must visually belong to this domain. Remove the logo and a reviewer should still identify what kind of product it is.

## 2. Anti-generic-AI rules

Do not use:

- purple/blue gradient hero;
- glowing background orbs;
- centered “AI-powered” headline + 3 feature cards;
- glassmorphism;
- bento-grid filler;
- giant rounded rectangles everywhere;
- decorative metric cards without a workflow purpose;
- meaningless radar/donut charts;
- excessive icons;
- sparkle/brain/robot AI motifs;
- 3D tokens/network spheres;
- wallet-connect as primary visual identity;
- hover lift/drop-shadow on every surface.

Do not import a UI kit and accept its default look. If primitives are used, restyle them to this system.

## 3. Color system

| Token | Hex | Primary use |
| --- | --- | --- |
| paper | `#F3EBDD` | main manuscript surface |
| ink | `#201B17` | primary canon text |
| vermilion | `#B74432` | conflict/retcon and active annotation |
| olive | `#697255` | branch/secondary editorial state |
| charcoal | `#4B443D` | metadata and ruled separators |

Use status text alongside color. Do not create gradients between these colors.

## 4. Typography

Source Serif 4 for canon text and headings; Instrument Sans for controls and metadata

### Type roles

- **Domain title:** strong display face defined above.
- **Primary prose/evidence:** readable text face with generous line height.
- **Identifiers/digests:** mono where specified.
- **Controls:** compact UI face.
- **Status:** uppercase or small-cap only when it matches this project's design language; never use every label as a pill.

## 5. Geometry and surfaces

square cards, ruled separators, 2px left-margin annotations, almost no pills; 6px corner radius maximum

Borders/rules should do more work than shadows. Keep domain documents, maps, timelines, brackets or matrices visually primary.

## 6. Motion

page-turn/crossfade only for branch changes; no floating blobs, glowing gradients or card-hover theatrics

All motion obeys `prefers-reduced-motion`.

## 7. Application chrome

### Header

- Project/domain context left.
- Live StudioNet/configuration/unavailable provenance visible but quiet.
- Actual wallet network + address utility right.
- No auto-connect.
- Wrong network blocks the write in-context.

### Navigation

Navigation should use the domain concepts from the route list below. Avoid generic “Dashboard / Analytics / Settings” unless a screen genuinely is settings.

## 8. Route-by-route specification

### `/` — World desk

**Desktop composition:** Two-pane library index: worlds/branches left, selected universe manuscript center, latest decision marginalia right.

**Primary action:** Open world or create world

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/worlds/[worldId]/canon` — Canon ledger

**Desktop composition:** Continuous editorial ledger grouped by version and time anchor; superseded facts remain visible with strike/rule treatment.

**Primary action:** Inspect entry / propose addition

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/worlds/[worldId]/entities/[entityKey]` — Entity dossier

**Desktop composition:** Entity title page + chronological canon excerpts + relationship references.

**Primary action:** Open related canon

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/worlds/[worldId]/timeline` — Timeline strip

**Desktop composition:** Horizontal time ribbon with manuscript cards pinned to eras; branch fork marks are physical rules.

**Primary action:** Filter by entity/location

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/worlds/[worldId]/proposals/new` — Proposal composer

**Desktop composition:** Writing surface center, immutable artifact manifest below, proposal mode in left margin, related-memory preview right.

**Primary action:** Submit proposal

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/proposals/[proposalId]` — Conflict table

**Desktop composition:** Proposal on left, retrieved canon on right, decision strip through center; exact supersession checkboxes are read-only from result.

**Primary action:** Run review / inspect decision

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/worlds/[worldId]/branches` — Branch map

**Desktop composition:** Tree diagram styled as printed genealogy; no force-directed blobs.

**Primary action:** Create branch

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/receipts/[proposalId]` — Decision receipt

**Desktop composition:** Print-like single decision sheet with tx, version, related IDs, resulting entries.

**Primary action:** Copy receipt / explorer

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.


## 9. Signature components

The component library should be named around the domain. Core cross-project primitives may exist internally, but visible components should reflect this product.

- **Primary domain surface:** implement the `editorial story bible with a marginalia rail, not a dashboard` rather than a card grid.
- **Decision strip/rail:** fixed place for on-chain status and tx lifecycle.
- **Semantic context:** related records with ID/version/raw distance.
- **Immutable reference block:** URL + digest + copy + provenance.
- **History/version object:** append-only past decisions.
- **Network gate:** exact expected/actual chain.
- **Receipt:** printable/copyable authoritative outcome.

Project pages to support:

- World desk / universe switcher
- Canon ledger
- Entity dossier
- Timeline strip
- Proposal composer
- Conflict table
- Branch map
- Decision receipt
- Search / semantic recall

## 10. Transaction experience

Never show “success” after only receiving a transaction hash.

```text
Awaiting signature
  -> submitted (hash)
  -> consensus/finality pending
  -> FINALIZED
  -> inspect GenVM execution
     -> SUCCESS: re-read record
     -> ROLLBACK/ERROR: show failure, do not fake state
```

Do not show a fake percentage while consensus is pending.

## 11. Semantic-memory presentation

Semantic memory is related context, not truth.

### Show

- record title/ID;
- namespace/version;
- raw vector distance;
- one bounded authoritative excerpt/summary;
- final status of that prior record;
- why it is eligible.

### Never show

- “92% true”;
- “AI confidence based on similarity”;
- “validator certainty” derived from KNN;
- a green check merely because distance is small.

## 12. Density and information design

This product should be usefully dense.

- Repeated records use ruled lists/tables.
- Identifiers are selectable/copyable.
- Evidence and result are visually distinguishable.
- Digests/versions sit beside the object they bind.
- Do not hide critical details behind hover.
- Avoid excessive whitespace that turns an operational app into a landing page.

## 13. Responsive system

### Desktop

Use the full signature composition.

### Tablet

Primary domain object + one context pane; other nav/context becomes a drawer.

### Mobile

- one main column;
- 44px touch targets;
- dedicated full-screen mode for map/graph/bracket/complex matrix;
- hashes wrap and have copy controls;
- evidence/context becomes a sheet;
- primary write can use a bottom action bar only when contextually valid.

## 14. Accessibility

- WCAG AA text contrast.
- Text labels for all status colors.
- Full keyboard access.
- Visible focus state.
- Table headers/semantic HTML.
- List alternative to visual graph/map.
- Evidence selectable as text.
- Reduced motion.
- Minimum practical text size 12px for dense metadata, larger for critical text.

## 15. Content language

Use domain language and precise transaction language.

Good:

- “Related records retrieved”
- “Bound to version 3”
- “Finalized; GenVM execution rolled back”
- “Insufficient public evidence”
- “No eligible semantic memory found”

Avoid:

- “AI magic”
- “Trustless revolution”
- “Intelligence score”
- “Smart insights”
- “Powered by next-gen AI”

## 16. Screenshot quality bar

- [ ] Logo can be removed and the product is still visually identifiable.
- [ ] No generic AI-template motifs.
- [ ] Main domain artifact occupies more attention than metrics.
- [ ] Wallet is utility chrome.
- [ ] Provenance is visible.
- [ ] Transaction truth is inspectable.
- [ ] VecDB distance is not mislabeled.
- [ ] Empty/error/abstain states look intentional.
- [ ] Mobile primary workflow is viable.
- [ ] Color, type, geometry and composition differ materially from the other nine packs.
