/** Client mirrors of the contract's deterministic storage normalization. */
export const normalizeBounded = (value: string) => value.trim().split(/\s+/).filter(Boolean).join(" ");
export const normalizeMultiline = (value: string) => value.trim();
export const normalizeDigest = (value: string) => {
  const digest = value.trim().toLowerCase();
  return digest ? `sha256:${digest.startsWith("sha256:") ? digest.slice(7) : digest}` : "";
};
export const normalizeEntityKeys = (keys: string[] | string) => {
  const values = typeof keys === "string" ? JSON.parse(keys) as unknown : keys;
  if (!Array.isArray(values)) return "[]";
  return JSON.stringify([...new Set(values.map((key) => normalizeBounded(String(key)).toLowerCase()).filter(Boolean))].sort());
};
export const normalizeProposalMode = (value: string) => normalizeBounded(value).toUpperCase();
export const normalizeWorldInput = (input: { name: string; charter_text: string; charter_url: string; charter_digest: string }) => ({
  ...input,
  name: normalizeBounded(input.name),
  charter_text: normalizeMultiline(input.charter_text),
  charter_url: normalizeBounded(input.charter_url),
  charter_digest: normalizeDigest(input.charter_digest),
});
