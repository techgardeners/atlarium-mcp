import { createServer } from "node:http";
import express from "express";
import rateLimit from "express-rate-limit";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import type { RuntimeConfig } from "./config.js";
import { log } from "./logger.js";
import { createAtlariumMcpServer } from "./server.js";

export function createHttpApp(config: RuntimeConfig) {
  const app = createMcpExpressApp({
    host: config.host,
    allowedHosts: config.allowedHosts,
  });

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "128kb" }));

  if (config.MCP_RATE_LIMIT_ENABLED) {
    app.use(
      rateLimit({
        windowMs: config.MCP_RATE_LIMIT_WINDOW_MS,
        limit: config.MCP_RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
          log("warn", "mcp_rate_limit", {
            ip: req.ip,
            path: req.path,
          });
          res.status(429).json({
            error: "rate_limit_exceeded",
            message: "Too many requests. Please try again later.",
          });
        },
      }),
    );
  }

  app.get(["/health", "/healthz"], (_req, res) => {
    res.json({
      status: "ok",
      service: config.MCP_SERVICE_NAME,
      version: config.MCP_VERSION,
    });
  });

  app.post("/mcp", async (req, res) => {
    const startedAt = Date.now();
    const server = createAtlariumMcpServer(config);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      log("info", "mcp_request", {
        duration_ms: Date.now() - startedAt,
        method: req.method,
        path: req.path,
        status: "ok",
      });
      res.on("close", () => {
        void transport.close();
        void server.close();
      });
    } catch (error) {
      await transport.close();
      await server.close();
      log("error", "mcp_request", {
        duration_ms: Date.now() - startedAt,
        method: req.method,
        path: req.path,
        status: "error",
      });
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        });
      }
      if (error instanceof Error) {
        log("error", "mcp_internal_error", { message: error.message });
      }
    }
  });

  app.all("/mcp", (_req, res) => {
    res.status(405).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    });
  });

  return app;
}

export function listen(config: RuntimeConfig) {
  const app = createHttpApp(config);
  const server = createServer(app);

  server.listen(config.MCP_PORT, config.host, () => {
    log("info", "mcp_started", {
      host: config.host,
      port: config.MCP_PORT,
      public_base_url: config.publicBaseUrl.href,
      atlarium_api_base_url: config.atlariumApiBaseUrl.href,
    });
  });

  return server;
}
