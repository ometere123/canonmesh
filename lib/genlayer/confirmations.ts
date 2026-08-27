import type { Branch, CanonEntry, Proposal, World } from "../types";
import { normalizeBounded, normalizeDigest, normalizeEntityKeys, normalizeMultiline, normalizeProposalMode } from "./normalization";

const same = (left: string, right: string) => normalizeBounded(left) === normalizeBounded(right);
const ids = <T extends { id: number }>(before: T[], after: T[]) => after.filter((item) => !before.some((old) => old.id === item.id));
const parseIds = (raw: string) => { try { const value = JSON.parse(raw) as unknown; return Array.isArray(value) && value.every((id) => typeof id === "number" && Number.isSafeInteger(id) && id > 0) ? value as number[] : undefined; } catch { return undefined; } };

export function confirmWorldCreated(before: World[], after: World[], expected: Pick<World, "name" | "charter_text" | "charter_url" | "charter_digest"> & Partial<Pick<World, "steward">>) {
  const matches = ids(before, after).filter((world) => same(world.name, expected.name) && normalizeMultiline(world.charter_text) === normalizeMultiline(expected.charter_text) && normalizeBounded(world.charter_url) === normalizeBounded(expected.charter_url) && normalizeDigest(world.charter_digest) === normalizeDigest(expected.charter_digest) && (expected.steward === undefined || world.steward.toLowerCase() === expected.steward.toLowerCase()));
  return matches.length === 1 ? matches[0] : undefined;
}

export function confirmBranchCreated(before: Branch[], after: Branch[], expected: Pick<Branch, "world_id" | "parent_branch_id" | "name">) {
  const matches = ids(before, after).filter((branch) => branch.world_id === expected.world_id && branch.parent_branch_id === expected.parent_branch_id && same(branch.name, expected.name) && branch.active);
  return matches.length === 1 ? matches[0] : undefined;
}

export function findSubmittedProposal(before: Proposal[], after: Proposal[], expected: Pick<Proposal, "proposer" | "world_id" | "branch_id" | "mode" | "title" | "statement" | "artifact_url" | "artifact_digest" | "entity_keys_json">) {
  const matches = ids(before, after).filter((proposal) => proposal.proposer.toLowerCase() === expected.proposer.toLowerCase() && proposal.world_id === expected.world_id && proposal.branch_id === expected.branch_id && proposal.mode === normalizeProposalMode(expected.mode) && same(proposal.title, expected.title) && normalizeMultiline(proposal.statement) === normalizeMultiline(expected.statement) && normalizeBounded(proposal.artifact_url) === normalizeBounded(expected.artifact_url) && normalizeDigest(proposal.artifact_digest) === normalizeDigest(expected.artifact_digest) && normalizeEntityKeys(proposal.entity_keys_json) === normalizeEntityKeys(expected.entity_keys_json) && proposal.status === "SUBMITTED");
  return matches.length === 1 ? matches[0] : undefined;
}

export function confirmReviewedProposal(proposal: Proposal, expectedMode: Proposal["mode"], resultingEntry?: CanonEntry, supersededEntries: CanonEntry[] = [], overrideEntries: CanonEntry[] = []) {
  if (proposal.status === "SUBMITTED" || !proposal.decision || proposal.mode !== expectedMode) return false;
  const accepted = proposal.decision === "COMPATIBLE" || proposal.decision === "RETCON_VALID" || proposal.decision === "BRANCH_ONLY";
  if (!accepted) return proposal.resulting_entry_id === 0;
  if (proposal.resulting_entry_id <= 0 || !resultingEntry || resultingEntry.id !== proposal.resulting_entry_id) return false;
  if (proposal.decision === "RETCON_VALID") return supersededEntries.length > 0 && supersededEntries.every((entry) => entry.superseded_by === proposal.resulting_entry_id);
  if (proposal.decision === "BRANCH_ONLY") { const proposalOverrides = parseIds(proposal.branch_overrides_json); const entryOverrides = parseIds(resultingEntry.overrides_json); return Boolean(proposalOverrides?.length && entryOverrides && JSON.stringify(proposalOverrides) === JSON.stringify(entryOverrides) && overrideEntries.length === proposalOverrides.length && overrideEntries.every((entry) => entry.superseded_by === 0)); }
  return proposal.supersedes_json === "[]" && proposal.branch_overrides_json === "[]";
}

export function confirmEditorState(actual: boolean, expected: boolean) { return actual === expected; }
export function confirmBranchStatus(before: Branch, after: Branch, expected: boolean) {
  return after.id === before.id && after.active === expected && (expected === before.active || after.version === before.version + 1);
}
export function confirmCancelledProposal(proposal: Proposal) {
  return proposal.status === "CANCELLED" && proposal.decision === "CANCELLED" && proposal.resulting_entry_id === 0 && Boolean(proposal.reviewed_at);
}
export function confirmStaleProposal(proposal: Proposal) {
  return proposal.status === "STALE" && proposal.decision === "STALE" && proposal.resulting_entry_id === 0 && Boolean(proposal.reviewed_at);
}
