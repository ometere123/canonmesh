import type { Branch, Proposal, World } from "@/lib/types";

export function confirmWorldCreated(worlds: World[], expected: Pick<World, "name" | "charter_text" | "charter_url" | "charter_digest">) {
  return worlds.some((world) => world.name === expected.name && world.charter_text === expected.charter_text && world.charter_url === expected.charter_url && world.charter_digest === expected.charter_digest);
}

export function confirmBranchCreated(branches: Branch[], expected: Pick<Branch, "world_id" | "parent_branch_id" | "name">) {
  return branches.some((branch) => branch.world_id === expected.world_id && branch.parent_branch_id === expected.parent_branch_id && branch.name === expected.name);
}

export function findSubmittedProposal(proposals: Proposal[], expected: Pick<Proposal, "proposer" | "world_id" | "branch_id" | "mode" | "title" | "statement">) {
  const matches = proposals.filter((proposal) => proposal.proposer.toLowerCase() === expected.proposer.toLowerCase() && proposal.world_id === expected.world_id && proposal.branch_id === expected.branch_id && proposal.mode === expected.mode && proposal.title === expected.title && proposal.statement === expected.statement);
  return matches.length === 1 ? matches[0] : undefined;
}

export function confirmReviewedProposal(proposal: Proposal, expectedMode: Proposal["mode"]) {
  if (proposal.status === "SUBMITTED" || !proposal.decision || proposal.mode !== expectedMode) return false;
  if (proposal.decision === "COMPATIBLE" || proposal.decision === "RETCON_VALID" || proposal.decision === "BRANCH_ONLY") return proposal.resulting_entry_id > 0;
  return proposal.resulting_entry_id === 0;
}
