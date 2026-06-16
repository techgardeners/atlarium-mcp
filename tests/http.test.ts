import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { describe, expect, it } from "vitest";

import { getRuntimeConfig } from "../src/config.js";
import { createHttpApp } from "../src/http.js";

describe("HTTP app", () => {
  it("serves a public healthcheck", async () => {
    const app = createHttpApp(
      getRuntimeConfig({
        NODE_ENV: "test",
        MCP_RATE_LIMIT_ENABLED: "false",
      }),
    );
    const server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address() as AddressInfo;

    try {
      const response = await fetch(`http://127.0.0.1:${address.port}/health`);

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        service: "atlarium-mcp",
        status: "ok",
        version: "1.0.0",
      });
    } finally {
      server.close();
    }
  });
});
