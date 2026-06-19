import { once } from "node:events";
import { request } from "node:http";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { describe, expect, it, vi } from "vitest";

import { getRuntimeConfig } from "../src/config.js";
import { createHttpApp } from "../src/http.js";
import { mcpDisplayName } from "../src/metadata.js";
import { toolDefinitions } from "../src/tools.js";

function testConfig(env: NodeJS.ProcessEnv = {}) {
  return getRuntimeConfig({
    NODE_ENV: "test",
    MCP_RATE_LIMIT_ENABLED: "false",
    MCP_TRUST_PROXY: "false",
    ...env,
  });
}

async function withServer<T>(
  app: ReturnType<typeof createHttpApp>,
  callback: (baseUrl: string, server: Server) => Promise<T>,
) {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as AddressInfo;

  try {
    return await callback(`http://127.0.0.1:${address.port}`, server);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

async function waitForAssertion(assertion: () => void) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      assertion();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  throw lastError;
}

async function rawHttpRequest(
  port: number,
  headers: Record<string, string>,
) {
  return new Promise<{ body: string; statusCode: number | undefined }>(
    (resolve, reject) => {
      const req = request(
        {
          headers,
          hostname: "127.0.0.1",
          method: "GET",
          path: "/health",
          port,
        },
        (res) => {
          let body = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            resolve({ body, statusCode: res.statusCode });
          });
        },
      );
      req.on("error", reject);
      req.end();
    },
  );
}

describe("HTTP app", () => {
  it("serves a public healthcheck", async () => {
    const app = createHttpApp(testConfig());

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/health`);
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        service: mcpDisplayName,
        status: "ok",
        version: "1.0.0",
      });
    });
  });

  it("serves a public MCP server card", async () => {
    const app = createHttpApp(testConfig());

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/.well-known/mcp/server-card.json`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/json");
      expect(body).toMatchObject({
        auth: {
          type: "none",
        },
        capabilities: {
          prompts: false,
          resources: true,
          tools: true,
        },
        endpoint: "https://mcp.atlarium.bio/mcp",
        name: mcpDisplayName,
        readOnly: true,
        transport: {
          type: "streamable-http",
          url: "https://mcp.atlarium.bio/mcp",
        },
      });
      expect(body.tools).toHaveLength(toolDefinitions.length);
      expect(body.resources).toEqual([
        expect.objectContaining({
          mimeType: "text/html;profile=mcp-app",
          name: "atlarium-habitat-explorer",
          title: "Atlarium Habitat Explorer",
          uri: "ui://widget/habitat-explorer.v1.html",
        }),
      ]);
      expect(body.tools.map((tool: { name: string }) => tool.name)).toEqual(
        toolDefinitions.map((tool) => tool.name),
      );
      expect(
        body.tools.every(
          (tool: {
            _meta?: { ui?: { resourceUri?: string }; "openai/outputTemplate"?: string };
            inputSchema?: { additionalProperties?: boolean };
            outputSchema?: unknown;
          }) =>
            tool.inputSchema?.additionalProperties === false &&
            tool.outputSchema &&
            tool._meta?.ui?.resourceUri === "ui://widget/habitat-explorer.v1.html" &&
            tool._meta?.["openai/outputTemplate"] ===
              "ui://widget/habitat-explorer.v1.html",
        ),
      ).toBe(true);
    });
  });

  it("sets security headers without leaking Express fingerprinting", async () => {
    const app = createHttpApp(testConfig());

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/health`);

      expect(response.headers.get("x-powered-by")).toBeNull();
      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
      expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
      expect(response.headers.get("content-security-policy")).toBeNull();
      expect(response.headers.get("strict-transport-security")).toBeNull();
    });
  });

  it("returns JSON for missing routes", async () => {
    const app = createHttpApp(testConfig());

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/missing`);

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({
        error: "not_found",
        message: "Not found.",
      });
    });
  });

  it("returns JSON-RPC method not allowed for non-POST MCP requests", async () => {
    const app = createHttpApp(testConfig());

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/mcp`);

      expect(response.status).toBe(405);
      await expect(response.json()).resolves.toMatchObject({
        error: {
          code: -32000,
          message: "Method not allowed.",
        },
        id: null,
        jsonrpc: "2.0",
      });
    });
  });

  it("returns sanitized JSON for malformed MCP JSON bodies", async () => {
    const app = createHttpApp(testConfig());

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/mcp`, {
        body: "{",
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "invalid_json",
        message: "Invalid JSON request body.",
      });
    });
  });

  it("rate limits requests when enabled", async () => {
    const app = createHttpApp(
      testConfig({
        MCP_RATE_LIMIT_ENABLED: "true",
        MCP_RATE_LIMIT_MAX: "1",
      }),
    );

    await withServer(app, async (baseUrl) => {
      const first = await fetch(`${baseUrl}/health`);
      const second = await fetch(`${baseUrl}/health`);

      expect(first.status).toBe(200);
      expect(second.status).toBe(429);
      await expect(second.json()).resolves.toEqual({
        error: "rate_limit_exceeded",
        message: "Too many requests. Please try again later.",
      });
    });
  });

  it("rejects requests whose host is not allowlisted", async () => {
    const app = createHttpApp(
      testConfig({
        MCP_ALLOWED_HOSTS: "mcp.atlarium.bio",
      }),
    );

    await withServer(app, async (_baseUrl, server) => {
      const address = server.address() as AddressInfo;
      const response = await rawHttpRequest(address.port, { host: "evil.test" });

      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body)).toMatchObject({
        error: {
          code: -32000,
          message: "Invalid Host: evil.test",
        },
        id: null,
        jsonrpc: "2.0",
      });
    });
  });

  it("cleans up MCP transport and server after a successful request", async () => {
    const connect = vi.fn().mockResolvedValue(undefined);
    const serverClose = vi.fn().mockResolvedValue(undefined);
    const transportClose = vi.fn().mockResolvedValue(undefined);
    const handleRequest = vi.fn(async (_req, res) => {
      res.status(200).json({ ok: true });
    });
    const app = createHttpApp(testConfig(), {
      createMcpServer: () =>
        ({
          close: serverClose,
          connect,
        }) as never,
      createTransport: () =>
        ({
          close: transportClose,
          handleRequest,
        }) as never,
    });

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/mcp`, {
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ ok: true });
      expect(connect).toHaveBeenCalledTimes(1);
      expect(handleRequest).toHaveBeenCalledTimes(1);
      await waitForAssertion(() => {
        expect(serverClose).toHaveBeenCalledTimes(1);
        expect(transportClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  it("cleans up MCP transport and server after handler errors", async () => {
    const serverClose = vi.fn().mockResolvedValue(undefined);
    const transportClose = vi.fn().mockResolvedValue(undefined);
    const app = createHttpApp(testConfig(), {
      createMcpServer: () =>
        ({
          close: serverClose,
          connect: vi.fn().mockResolvedValue(undefined),
        }) as never,
      createTransport: () =>
        ({
          close: transportClose,
          handleRequest: vi.fn().mockRejectedValue(new Error("boom")),
        }) as never,
    });

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/mcp`, {
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toMatchObject({
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
        jsonrpc: "2.0",
      });
      expect(serverClose).toHaveBeenCalledTimes(1);
      expect(transportClose).toHaveBeenCalledTimes(1);
    });
  });
});
