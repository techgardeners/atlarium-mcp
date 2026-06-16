import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { AtlariumApiClient } from "./atlarium-api.js";
import type { RuntimeConfig } from "./config.js";
import { runTool, toolDefinitions } from "./tools.js";

export function createAtlariumMcpServer(
  config: RuntimeConfig,
  api = new AtlariumApiClient(config),
) {
  const server = new McpServer(
    {
      name: config.MCP_SERVICE_NAME,
      version: config.MCP_VERSION,
    },
    {
      capabilities: {
        tools: {},
        logging: {},
      },
    },
  );

  for (const tool of toolDefinitions) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.schema.shape,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
        },
      },
      async (input: Record<string, unknown>) =>
        runTool(tool.name, () => tool.handler(api, input)),
    );
  }

  return server;
}
