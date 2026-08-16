import { createServer } from "node:http";
import express, { type ErrorRequestHandler } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import type { RuntimeConfig } from "./config.js";
import { operationalErrorCode, type OperationalErrorCode } from "./errors.js";
import { log } from "./logger.js";
import { createGlamaConnectorClaim, createServerCard } from "./metadata.js";
import {
  createMcpRequestContext,
  runWithMcpRequestContext,
} from "./request-context.js";
import { createAtlariumMcpServer } from "./server.js";
import { toolDefinitions } from "./tools.js";

const HTTP_REQUEST_TIMEOUT_MS = 30_000;
const HTTP_HEADERS_TIMEOUT_MS = 66_000;
const HTTP_KEEP_ALIVE_TIMEOUT_MS = 65_000;
const MCP_BODY_LIMIT = "128kb";
const PUBLIC_TOOL_NAMES = new Set(toolDefinitions.map((tool) => tool.name));
const PUBLIC_TOOL_SCHEMAS = new Map(
  toolDefinitions.map((tool) => [tool.name, tool.schema] as const),
);

type Closable = {
  close: () => Promise<void> | void;
};

export type HttpAppDependencies = {
  createMcpServer?: typeof createAtlariumMcpServer;
  createTransport?: () => StreamableHTTPServerTransport;
};

export function createHttpApp(
  config: RuntimeConfig,
  dependencies: HttpAppDependencies = {},
) {
  const app = createMcpExpressApp({
    host: config.host,
    allowedHosts: config.allowedHosts,
  });

  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      hsts: false,
    }),
  );

  if (config.MCP_RATE_LIMIT_ENABLED) {
    app.use(
      rateLimit({
        windowMs: config.MCP_RATE_LIMIT_WINDOW_MS,
        limit: config.MCP_RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req, res) => {
          log("warn", "mcp_rate_limit", {
            result: "error",
            error_code: "validation_error",
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

  app.get("/.well-known/mcp/server-card.json", (_req, res) => {
    res.json(createServerCard(config));
  });

  app.get("/.well-known/glama.json", (_req, res) => {
    res.json(createGlamaConnectorClaim());
  });

  app.get("/.well-known/openai-apps-challenge", (_req, res) => {
    res
      .type("text/plain")
      .set("cache-control", "no-store")
      .send(config.OPENAI_APPS_CHALLENGE_TOKEN);
  });

  app.post("/mcp", express.json({ limit: MCP_BODY_LIMIT }), async (req, res) => {
    const startedAt = Date.now();
    const requestContext = createMcpRequestContext(
      req.body,
      req.headers["x-atlarium-probe"],
      PUBLIC_TOOL_NAMES,
    );
    const validationErrorCode = requestValidationErrorCode(req.body);
    const mcpServer =
      dependencies.createMcpServer?.(config) ?? createAtlariumMcpServer(config);
    const transport =
      dependencies.createTransport?.() ??
      new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
    const cleanup = createCleanup(mcpServer, transport);

    res.once("finish", () => {
      void cleanup();
    });
    res.once("close", () => {
      void cleanup();
    });

    await runWithMcpRequestContext(requestContext, async () => {
      try {
        await mcpServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
        log(validationErrorCode ? "warn" : "info", "mcp_request", {
          ...requestContext,
          duration_ms: Date.now() - startedAt,
          result: validationErrorCode ? "error" : "ok",
          ...(validationErrorCode ? { error_code: validationErrorCode } : {}),
        });
      } catch {
        await cleanup();
        log("error", "mcp_request", {
          ...requestContext,
          duration_ms: Date.now() - startedAt,
          result: "error",
          error_code: "internal_error",
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
      }
    });
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

  app.use((_req, res) => {
    res.status(404).json({
      error: "not_found",
      message: "Not found.",
    });
  });

  app.use(errorHandler);

  return app;
}

function requestValidationErrorCode(
  body: unknown,
): OperationalErrorCode | undefined {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return undefined;
  }

  const request = body as Record<string, unknown>;
  if (request.method !== "tools/call") {
    return undefined;
  }

  const params =
    request.params &&
    typeof request.params === "object" &&
    !Array.isArray(request.params)
      ? (request.params as Record<string, unknown>)
      : undefined;
  const schema =
    typeof params?.name === "string"
      ? PUBLIC_TOOL_SCHEMAS.get(params.name)
      : undefined;
  if (!schema) {
    return undefined;
  }

  const parsed = schema.safeParse(params?.arguments ?? {});
  return parsed.success ? undefined : operationalErrorCode(parsed.error);
}

export function listen(config: RuntimeConfig) {
  const server = createHttpServer(config);

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

export function createHttpServer(config: RuntimeConfig) {
  const app = createHttpApp(config);
  const server = createServer(app);

  server.requestTimeout = HTTP_REQUEST_TIMEOUT_MS;
  server.headersTimeout = HTTP_HEADERS_TIMEOUT_MS;
  server.keepAliveTimeout = HTTP_KEEP_ALIVE_TIMEOUT_MS;
  server.timeout = 0;

  server.on("clientError", (error, socket) => {
    void error;
    log("warn", "http_client_error", { error_code: "validation_error" });
    if (!socket.writableEnded) {
      socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
    }
  });

  return server;
}

function createCleanup(mcpServer: Closable, transport: Closable) {
  let cleanupPromise: Promise<void> | undefined;

  return () => {
    cleanupPromise ??= Promise.allSettled([
      closeQuietly("mcp_transport", transport),
      closeQuietly("mcp_server", mcpServer),
    ]).then(() => undefined);

    return cleanupPromise;
  };
}

async function closeQuietly(name: string, target: Closable) {
  try {
    await target.close();
  } catch {
    log("warn", "mcp_cleanup_error", {
      target: name,
      error_code: "internal_error",
    });
  }
}

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = httpStatus(error);
  log(status >= 500 ? "error" : "warn", "http_error", {
    method: req.method,
    path: req.path,
    status,
    error_code: status >= 500 ? "internal_error" : "validation_error",
  });

  if (status === 413) {
    res.status(413).json({
      error: "request_too_large",
      message: "Request body is too large.",
    });
    return;
  }

  if (status === 400) {
    res.status(400).json({
      error: "invalid_json",
      message: "Invalid JSON request body.",
    });
    return;
  }

  res.status(500).json({
    error: "internal_server_error",
    message: "Internal server error.",
  });
};

function httpStatus(error: unknown) {
  if (!error || typeof error !== "object") {
    return 500;
  }

  const maybeStatus = "status" in error ? error.status : undefined;
  if (typeof maybeStatus === "number" && maybeStatus >= 400 && maybeStatus < 500) {
    return maybeStatus;
  }

  const maybeStatusCode = "statusCode" in error ? error.statusCode : undefined;
  if (
    typeof maybeStatusCode === "number" &&
    maybeStatusCode >= 400 &&
    maybeStatusCode < 500
  ) {
    return maybeStatusCode;
  }

  return 500;
}
