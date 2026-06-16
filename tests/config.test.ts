import { describe, expect, it } from "vitest";

import { getRuntimeConfig } from "../src/config.js";

describe("runtime config", () => {
  it("uses public Atlarium defaults and normalizes allowed hosts", () => {
    const config = getRuntimeConfig({
      NODE_ENV: "test",
      MCP_ALLOWED_HOSTS: "mcp.atlarium.bio:443,localhost:43118",
    });

    expect(config.MCP_SERVICE_NAME).toBe("atlarium-mcp");
    expect(config.MCP_VERSION).toBe("1.0.0");
    expect(config.MCP_DEFAULT_LANGUAGE).toBe("en");
    expect(config.atlariumApiBaseUrl.href).toBe("https://atlarium.bio/api/public/mcp/v1");
    expect(config.allowedHosts).toEqual(["mcp.atlarium.bio", "localhost"]);
  });
});
