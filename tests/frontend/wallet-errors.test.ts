import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({ createClient: vi.fn((options: unknown) => ({ options })) }));
vi.mock("genlayer-js", () => ({ createClient }));

import { createInjectedClient } from "../../lib/genlayer/client";
import { formatError, formatWriteError } from "../../lib/error-format";

describe("mobile injected-provider compatibility", () => {
  beforeEach(() => {
    createClient.mockClear();
    Object.defineProperty(globalThis, "window", { configurable: true, value: { ethereum: { request: vi.fn() } } });
  });

  it("creates a provider-backed client without connecting or requesting Snaps", () => {
    const client = createInjectedClient("0xabc");
    expect(client).toBeDefined();
    expect(createClient).toHaveBeenCalledOnce();
    expect((client as { connect?: unknown }).connect).toBeUndefined();
    expect((window.ethereum?.request as ReturnType<typeof vi.fn>)).not.toHaveBeenCalled();
  });

  it("formats object-shaped RPC errors without [object Object]", () => {
    expect(formatError({ code: 4001, message: "User rejected the request" })).toBe("User rejected the request");
    expect(formatError({ error: { message: "Mobile wallet unavailable" } })).toBe("Mobile wallet unavailable");
    expect(formatError({ code: -32603 })).toBe("RPC error -32603.");
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(formatError(circular)).toBe("The wallet or RPC rejected the request before submission.");
    expect(formatWriteError({ data: { message: "Rejected by wallet" } })).toContain("before transaction submission: Rejected by wallet");
    expect(formatWriteError({ message: "Consensus failed" }, "0xhash")).toBe("Consensus failed");
  });
});
