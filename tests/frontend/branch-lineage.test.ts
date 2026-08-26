import { describe, expect, it } from "vitest";
import { effectiveBranchActivity, inactiveAncestorLabel } from "../../lib/branch-lineage";
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
});
