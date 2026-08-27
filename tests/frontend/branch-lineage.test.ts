import { describe, expect, it } from "vitest";
import { branchStatusWriteEligible, effectiveBranchActivity, inactiveAncestorLabel, proposalCancellationEligible, proposalLineageIsStale } from "../../lib/branch-lineage";
import { applyProviderEvent, hydrateWalletState, MANUAL_DISCONNECT_KEY, nextWalletState } from "../../lib/wallet-session";
import type { Branch } from "../../lib/types";

const b = (id: number, parent_branch_id: number, active = true): Branch => ({ id, world_id: 1, parent_branch_id, name: String(id), version: 1, entry_count: 0, proposal_count: 0, active, created_at: "now" });

describe("effective branch eligibility", () => {
  it("blocks active descendants of inactive ancestors and restores after reactivation", () => {
    const branches = [b(1, 0), b(2, 1, false), b(3, 2)];
    expect(effectiveBranchActivity(3, branches)).toBe(false);
    expect(inactiveAncestorLabel(3, branches)).toBe("Blocked by inactive ancestor");
    branches[1].active = true;
    expect(effectiveBranchActivity(3, branches)).toBe(true);
  });
  it("silently hydrates an authorized account without treating it as a connect request", () => {
    expect(hydrateWalletState(["0xAbc"], "0xf22f", false)).toEqual({ mode: "injected", address: "0xAbc", chainId: 61999 });
    expect(MANUAL_DISCONNECT_KEY).toBe("canonmesh.wallet.manualDisconnect");
    expect(hydrateWalletState([], "0xf22f", false)).toEqual({ mode: "none" });
  });
  it("keeps provider account and chain events distinct from explicit disconnect", () => {
    const connected = hydrateWalletState(["0xAbc"], "0xf22f", false);
    expect(nextWalletState(connected, { type: "accounts-changed", accounts: ["0xDef"] }).address).toBe("0xDef");
    expect(nextWalletState(connected, { type: "accounts-changed", accounts: [] })).toEqual({ mode: "none" });
    expect(nextWalletState(connected, { type: "chain-changed", chainId: "0x1" }).chainId).toBe(1);
    expect(nextWalletState(connected, { type: "provider-disconnected", message: "gone" })).toEqual({ mode: "none", error: "gone" });
  });
  it("does not reconnect from provider events while manually disconnected", () => {
    const disconnected = { mode: "none" as const };
    expect(applyProviderEvent(disconnected, { type: "accounts-changed", accounts: ["0xDef"] }, true)).toEqual(disconnected);
    expect(applyProviderEvent(disconnected, { type: "chain-changed", chainId: "0xf22f" }, true)).toEqual(disconnected);
    expect(applyProviderEvent(disconnected, { type: "provider-disconnected", message: "gone" }, true)).toEqual({ mode: "none", error: "gone" });
    const reconnected = nextWalletState(disconnected, { type: "connected", address: "0xDef", chainId: 61999 });
    expect(applyProviderEvent(reconnected, { type: "accounts-changed", accounts: ["0x123"] }, false).address).toBe("0x123");
  });
  it("fails closed for malformed, missing, or changed proposal snapshots", () => {
    const branches = [b(1, 0), b(2, 1)];
    const base = { id: 1, proposer: "0xabc", world_id: 1, branch_id: 2, mode: "ADD" as const, title: "x", statement: "x", artifact_url: "", artifact_digest: "", entity_keys_json: "[]", time_anchor: "now", status: "SUBMITTED", status_code: 1, decision: "", related_ids_json: "[]", supersedes_json: "[]", branch_overrides_json: "[]", rationale: "", evidence_summary: "", base_branch_version: 1, lineage_snapshot_json: "[[2,1],[1,1]]", submitted_at: "now", reviewed_at: "", resulting_entry_id: 0, duplicate_of: 0 };
    expect(proposalLineageIsStale(base, branches)).toBe(false);
    expect(proposalLineageIsStale({ ...base, lineage_snapshot_json: "[[2,2],[1,1]]" }, branches)).toBe(true);
    expect(proposalLineageIsStale({ ...base, lineage_snapshot_json: "[[3,1]]" }, branches)).toBe(true);
    expect(proposalLineageIsStale({ ...base, lineage_snapshot_json: "malformed" }, branches)).toBe(true);
  });
  it("enforces lifecycle eligibility before writes", () => {
    expect(branchStatusWriteEligible(b(1, 0))).toBe(false);
    expect(branchStatusWriteEligible(b(2, 1))).toBe(true);
    const submitted = { id: 1, proposer: "0xabc", status: "SUBMITTED" } as Parameters<typeof proposalCancellationEligible>[0];
    expect(proposalCancellationEligible(submitted, "0xabc", "0xdef")).toBe(true);
    expect(proposalCancellationEligible(submitted, "0xdef", "0xdef")).toBe(true);
    expect(proposalCancellationEligible(submitted, "0x999", "0xdef")).toBe(false);
    expect(proposalCancellationEligible({ ...submitted, status: "CANCELLED" }, "0xabc", "0xdef")).toBe(false);
  });
});
