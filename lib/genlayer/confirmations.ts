import type { Branch, CanonEntry, Proposal, World } from "../types";

const same = (left: string, right: string) => left.trim() === right.trim();
const ids = <T extends { id: number }>(before: T[], after: T[]) => after.filter((item) => !before.some((old) => old.id === item.id));

export function confirmWorldCreated(before: World[], after: World[], expected: Pick<World, "name" | "charter_text" | "charter_url" | "charter_digest"> & Partial<Pick<World, "steward">>) {
  const matches = ids(before, after).filter((world) => same(world.name, expected.name) && world.charter_text === expected.charter_text && world.charter_url === expected.charter_url && world.charter_digest === expected.charter_digest && (expected.steward === undefined || world.steward.toLowerCase() === expected.steward.toLowerCase()));
  return matches.length === 1 ? matches[0] : undefined;
}

export function confirmBranchCreated(before: Branch[], after: Branch[], expected: Pick<Branch, "world_id" | "parent_branch_id" | "name">) {
  const matches = ids(before, after).filter((branch) => branch.world_id === expected.world_id && branch.parent_branch_id === expected.parent_branch_id && same(branch.name, expected.name) && branch.active);
  return matches.length === 1 ? matches[0] : undefined;
}

export function findSubmittedProposal(before: Proposal[], after: Proposal[], expected: Pick<Proposal, "proposer" | "world_id" | "branch_id" | "mode" | "title" | "statement" | "artifact_url" | "artifact_digest" | "entity_keys_json">) {
  const matches = ids(before, after).filter((proposal) => proposal.proposer.toLowerCase() === expected.proposer.toLowerCase() && proposal.world_id === expected.world_id && proposal.branch_id === expected.branch_id && proposal.mode === expected.mode && proposal.title === expected.title && proposal.statement === expected.statement && proposal.artifact_url === expected.artifact_url && proposal.artifact_digest === expected.artifact_digest && proposal.entity_keys_json === expected.entity_keys_json && proposal.status === "SUBMITTED");
  return matches.length === 1 ? matches[0] : undefined;
}

export function confirmReviewedProposal(proposal: Proposal, expectedMode: Proposal["mode"], resultingEntry?: CanonEntry, supersededEntries: CanonEntry[] = []) {
  if (proposal.status === "SUBMITTED" || !proposal.decision || proposal.mode !== expectedMode) return false;
  const accepted = proposal.decision === "COMPATIBLE" || proposal.decision === "RETCON_VALID" || proposal.decision === "BRANCH_ONLY";
  if (!accepted) return proposal.resulting_entry_id === 0;
  if (proposal.resulting_entry_id <= 0 || !resultingEntry || resultingEntry.id !== proposal.resulting_entry_id) return false;
  if (proposal.decision === "RETCON_VALID") return supersededEntries.length > 0 && supersededEntries.every((entry) => entry.superseded_by === proposal.resulting_entry_id);
  if (proposal.decision === "BRANCH_ONLY") return proposal.branch_overrides_json !== "[]" && resultingEntry.overrides_json !== "[]";
  return proposal.supersedes_json === "[]" && proposal.branch_overrides_json === "[]";
}
