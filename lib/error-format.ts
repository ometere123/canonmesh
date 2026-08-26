export function formatError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  if (!error || typeof error !== "object") return "The wallet or RPC rejected the request before submission.";
  const value = error as Record<string, unknown>;
  const candidates = [value.shortMessage, value.message, (value.error as Record<string, unknown> | undefined)?.message, (value.data as Record<string, unknown> | undefined)?.message, value.details, (value.cause as Record<string, unknown> | undefined)?.message];
  const message = candidates.find((item): item is string => typeof item === "string" && item.trim().length > 0);
  if (message) return message;
  if (typeof value.code === "string" || typeof value.code === "number") return `RPC error ${String(value.code)}.`;
  try {
    const serialized = JSON.stringify(error);
    if (serialized && serialized !== "{}") return serialized.slice(0, 500);
  } catch { /* circular provider errors are handled by the generic fallback */ }
  return "The wallet or RPC rejected the request before submission.";
}

export function formatWriteError(error: unknown, hash?: string): string {
  const message = formatError(error);
  return hash ? message : `Wallet/RPC request failed before transaction submission: ${message}`;
}
