import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("production security headers", () => {
  it("sets safe non-CSP headers without restricting wallet/RPC scripts", async () => {
    const [rule] = await nextConfig.headers!();
    const headers = new Map(rule.headers.map((header) => [header.key, header.value]));
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
  });
});
