import { describe, expect, it } from "vitest";
import { confirmBranchCreated, confirmReviewedProposal, confirmWorldCreated, findSubmittedProposal } from "../../lib/genlayer/confirmations";
import type { Branch, CanonEntry, Proposal, World } from "../../lib/types";

const world = (id: number, name = "Vesper"): World => ({ id, steward: "0xabc", name, charter_text: "Charter", charter_url: "", charter_digest: "", version: 1, branch_count: 1, entry_count: 0, proposal_count: 0, created_at: "now" });
const branch = (id: number, active = true): Branch => ({ id, world_id: 1, parent_branch_id: 0, name: "main", version: 1, entry_count: 0, proposal_count: 0, active, created_at: "now" });
const proposal = (id: number, status = "SUBMITTED"): Proposal => ({ id, proposer: "0xabc", world_id: 1, branch_id: 1, mode: "ADD", title: "A fact", statement: "A fact is true.", artifact_url: "", artifact_digest: "", entity_keys_json: "[\"mira\"]", time_anchor: "dawn", status, status_code: 0, decision: status === "SUBMITTED" ? "" : "COMPATIBLE", related_ids_json: "[]", supersedes_json: "[]", branch_overrides_json: "[]", rationale: "", evidence_summary: "", base_branch_version: 1, lineage_snapshot_json: "[1]", submitted_at: "now", reviewed_at: "later", resulting_entry_id: status === "SUBMITTED" ? 0 : 1, duplicate_of: 0 });
const entry: CanonEntry = { id: 1, world_id: 1, branch_id: 1, proposal_id: 1, title: "A fact", statement: "A fact is true.", artifact_url: "", artifact_digest: "", entity_keys_json: "[\"mira\"]", time_anchor: "dawn", accepted_at: "later", superseded_by: 0, overrides_json: "[]", status: "ACTIVE", status_code: 1 };

describe("authoritative confirmation helpers", () => {
  it("requires a unique world delta and exact charter", () => {
    expect(confirmWorldCreated([world(1)], [world(1), world(2)], { name: "Vesper", charter_text: "Charter", charter_url: "", charter_digest: "" })?.id).toBe(2);
    expect(confirmWorldCreated([world(1)], [world(1), world(2), world(3)], { name: "Vesper", charter_text: "Charter", charter_url: "", charter_digest: "" })).toBeUndefined();
  });
  it("requires a unique active branch delta", () => {
    expect(confirmBranchCreated([branch(1)], [branch(1), { ...branch(2), name: "draft" }], { world_id: 1, parent_branch_id: 0, name: "draft" })?.id).toBe(2);
    expect(confirmBranchCreated([branch(1)], [branch(1), { ...branch(2), active: false }], { world_id: 1, parent_branch_id: 0, name: "main" })).toBeUndefined();
  });
  it("identifies proposals only from the ID delta and exact payload", () => {
    const found = findSubmittedProposal([proposal(1)], [proposal(1), proposal(2)], proposal(2));
    expect(found?.id).toBe(2);
    expect(findSubmittedProposal([proposal(1)], [proposal(1), proposal(2), proposal(3)], proposal(2))).toBeUndefined();
  });
  it("requires authoritative accepted entry and preserves non-accepted terminal outcomes", () => {
    expect(confirmReviewedProposal(proposal(1, "REVIEWED"), "ADD", entry)).toBe(true);
    expect(confirmReviewedProposal(proposal(1, "REVIEWED"), "ADD")).toBe(false);
    expect(confirmReviewedProposal({ ...proposal(1, "REVIEWED"), decision: "CONFLICT", resulting_entry_id: 0 }, "ADD")).toBe(true);
    expect(confirmReviewedProposal(proposal(1), "ADD", entry)).toBe(false);
  });
});
