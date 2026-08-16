import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("Official Registry publication workflow", () => {
  it("fails before authentication when the authoritative DNS key is missing", () => {
    const missingKey = `/tmp/atlarium-registry-key-${process.pid}-missing.pem`;
    const result = spawnSync("sh", ["scripts/publish-official-registry.sh"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        MCP_REGISTRY_KEY_FILE: missingKey,
      },
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Official Registry DNS key is missing");
    expect(result.stderr).toContain("matching the public MCPv1 TXT record");
    expect(result.stdout).not.toContain("Logging in");
  });
});
