import type { Branch } from "./types";
import type { Proposal } from "./types";

/** A branch is eligible only when every known ancestor is active. */
export function effectiveBranchActivity(branchId: number, branches: Branch[]): boolean {
  const byId = new Map(branches.map((branch) => [branch.id, branch]));
  const seen = new Set<number>();
  let current = byId.get(branchId);
  while (current) {
    if (!current.active || seen.has(current.id)) return false;
    seen.add(current.id);
    if (current.parent_branch_id === 0) return true;
    current = byId.get(current.parent_branch_id);
  }
  return false;
}

export function inactiveAncestorLabel(branchId: number, branches: Branch[]): string | undefined {
  const byId = new Map(branches.map((branch) => [branch.id, branch]));
  const seen = new Set<number>();
  let current = byId.get(branchId);
  while (current) {
    if (!current.active) return "Blocked by inactive ancestor";
    if (seen.has(current.id)) return "Blocked by invalid branch lineage";
    seen.add(current.id);
    current = current.parent_branch_id === 0 ? undefined : byId.get(current.parent_branch_id);
  }
  return "Blocked by invalid branch lineage";
}

export function proposalLineageIsStale(proposal: Proposal, branches: Branch[]): boolean {
  try {
    const snapshot = JSON.parse(proposal.lineage_snapshot_json) as unknown;
    if (!Array.isArray(snapshot)) return true;
    const byId = new Map(branches.map((branch) => [branch.id, branch]));
    return snapshot.some((row) => Array.isArray(row) && row.length === 2 && (!byId.has(Number(row[0])) || byId.get(Number(row[0]))!.version !== Number(row[1])));
  } catch { return true; }
}

export function branchStatusWriteEligible(branch: Branch): boolean {
  return branch.parent_branch_id !== 0;
}

export function proposalCancellationEligible(proposal: Proposal, walletAddress: string | undefined, steward: string | undefined): boolean {
  if (proposal.status !== "SUBMITTED" || !walletAddress) return false;
  const address = walletAddress.toLowerCase();
  return address === proposal.proposer.toLowerCase() || address === steward?.toLowerCase();
}
