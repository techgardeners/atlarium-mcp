import { describe, expect, it } from "vitest";

import { getRuntimeConfig } from "../src/config.js";
import { mcpDisplayName } from "../src/metadata.js";

describe("runtime config", () => {
  it("uses public Atlarium defaults and normalizes allowed hosts", () => {
    const config = getRuntimeConfig({
      NODE_ENV: "test",
      MCP_ALLOWED_HOSTS: "MCP.Atlarium.BIO:443,mcp.atlarium.bio,localhost:43118",
    });

    expect(config.MCP_SERVICE_NAME).toBe(mcpDisplayName);
    expect(config.MCP_VERSION).toBe("2.0.0");
    expect(config.MCP_DEFAULT_LANGUAGE).toBe("en");
    expect(config.atlariumApiBaseUrl.href).toBe("https://atlarium.bio/api/public/mcp/v1");
    expect(config.trustProxy).toBe(1);
    expect(config.ATLARIUM_API_TIMEOUT_MS).toBe(5_000);
    expect(config.ATLARIUM_API_RESPONSE_MAX_BYTES).toBe(1_048_576);
    expect(config.OPENAI_APPS_CHALLENGE_TOKEN).toBe(
      "tW6HmNIvGw-oL1mq-d0brGwZl-quGv5UFBw66EqtS4g",
    );
    expect(config.allowedHosts).toEqual(["mcp.atlarium.bio", "localhost"]);
  });

  it("parses explicit proxy trust settings", () => {
    const trustedProxy = getRuntimeConfig({
      NODE_ENV: "test",
      MCP_TRUST_PROXY: "loopback",
    });
    const direct = getRuntimeConfig({
      NODE_ENV: "test",
      MCP_TRUST_PROXY: "false",
    });

    expect(trustedProxy.trustProxy).toBe("loopback");
    expect(direct.trustProxy).toBe(false);
  });

  it("rejects ports outside the TCP range", () => {
    expect(() =>
      getRuntimeConfig({
        NODE_ENV: "test",
        MCP_PORT: "70000",
      }),
    ).toThrow();
  });

  it("requires https URLs in production", () => {
    expect(() =>
      getRuntimeConfig({
        NODE_ENV: "production",
        ATLARIUM_API_BASE_URL: "http://localhost:43117/api/public/mcp/v1",
      }),
    ).toThrow(/https/);
  });
});
