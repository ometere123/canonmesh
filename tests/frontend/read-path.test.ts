import { beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => { process.env.NEXT_PUBLIC_CANONMESH_CONTRACT = "0xCb4E8279Eff17c734c3eA2e32657691610b3467A"; return undefined; });
const readContract = vi.hoisted(() => vi.fn());
const createClient = vi.hoisted(() => vi.fn(() => ({ readContract })));
const createAccount = vi.hoisted(() => vi.fn(() => { throw new Error("public reads must not create accounts"); }));
vi.mock("genlayer-js", () => ({ createClient, createAccount }));

import { TransactionHashVariant } from "genlayer-js/types";
import { createReadClient } from "../../lib/genlayer/read-client";
import { getStats, getWorld, listWorlds } from "../../lib/genlayer/contract";

const world = { id: 1, version: 1, branch_count: 1, entry_count: 0, proposal_count: 0, steward: "0xabc", name: "Ember", charter_text: "Charter", charter_url: "", charter_digest: "", created_at: "now" };
const stats = { world_count: 1, branch_count: 1, entry_count: 0, proposal_count: 0, embedding_model: "all-MiniLM-L6-v2", vector_dimensions: 384, max_related: 8, max_page: 50, max_branch_depth: 8 };

describe("canonical finalized read path", () => {
  beforeEach(() => readContract.mockReset());

  it("uses LATEST_FINAL and creates no wallet account", async () => {
    expect(createReadClient()).toEqual({ readContract });
    expect(createAccount).not.toHaveBeenCalled();
    readContract.mockResolvedValue(stats);
    await getStats();
    expect(readContract.mock.calls[0][0].transactionHashVariant).toBe(TransactionHashVariant.LATEST_FINAL);
    expect(readContract.mock.calls[0][0].account).toBeUndefined();
  });

  it("classifies only exact method-specific domain absence as NOT_FOUND", async () => {
    readContract.mockRejectedValueOnce(new Error("EXPECTED: unknown world"));
    expect(await getWorld(99)).toEqual({ kind: "NOT_FOUND" });
    readContract.mockClear();
    readContract.mockRejectedValueOnce(new Error("contract not found at address")).mockRejectedValueOnce(new Error("contract not found at address")).mockRejectedValueOnce(new Error("contract not found at address"));
    const result = await getStats();
    expect(result.kind).toBe("UNAVAILABLE");
    expect(readContract).toHaveBeenCalledTimes(3);
  });

  it("does not classify transport wording as domain absence", async () => {
    readContract.mockRejectedValueOnce(new Error("transport: not found from gateway")).mockRejectedValueOnce(new Error("transport: not found from gateway")).mockRejectedValueOnce(new Error("transport: not found from gateway"));
    const result = await getWorld(1);
    expect(result.kind).toBe("UNAVAILABLE");
    expect(readContract).toHaveBeenCalledTimes(3);
  });

  it("retries transient failures and then returns finalized data", async () => {
    readContract.mockRejectedValueOnce(new Error("gateway timeout")).mockRejectedValueOnce(new Error("temporary RPC error")).mockResolvedValueOnce(world);
    expect(await getWorld(1)).toEqual({ kind: "AVAILABLE", value: world });
    expect(readContract).toHaveBeenCalledTimes(3);
  });

  it("turns an ID-list snapshot inconsistency into UNAVAILABLE", async () => {
    readContract.mockResolvedValueOnce([1, 2]).mockResolvedValueOnce(world).mockRejectedValueOnce(new Error("EXPECTED: unknown world"));
    const result = await listWorlds();
    expect(result).toEqual({ kind: "UNAVAILABLE", reason: "Canonical ID list referenced world 2, but its finalized record could not be read." });
  });
});
