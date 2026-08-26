import { describe, expect, it } from "vitest";
import { effectiveBranchActivity, inactiveAncestorLabel } from "../../lib/branch-lineage";
import { hydrateWalletState, MANUAL_DISCONNECT_KEY, nextWalletState } from "../../lib/wallet-session";
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
});
