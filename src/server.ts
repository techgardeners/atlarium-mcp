import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  habitatExplorerHtml,
  habitatExplorerResourceMeta,
  habitatExplorerResourceUri,
} from "./apps/habitat-explorer.js";
import { AtlariumApiClient } from "./atlarium-api.js";
import type { RuntimeConfig } from "./config.js";
import { promptDefinitions } from "./prompts.js";
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
        resources: {},
        prompts: {},
        logging: {},
      },
    },
  );

  server.registerResource(
    "atlarium-habitat-explorer",
    habitatExplorerResourceUri,
    habitatExplorerResourceMeta,
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: habitatExplorerResourceMeta.mimeType,
          text: habitatExplorerHtml(),
          _meta: habitatExplorerResourceMeta._meta,
        },
      ],
    }),
  );

  for (const tool of toolDefinitions) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.schema.shape,
        outputSchema: tool.outputSchema,
        annotations: {
          readOnlyHint: true,
          openWorldHint: false,
          destructiveHint: false,
          idempotentHint: true,
        },
        _meta: tool.appMeta,
      },
      async (input: Record<string, unknown>) =>
        runTool(tool.name, () => tool.handler(api, input)),
    );
  }

  for (const prompt of promptDefinitions) {
    server.registerPrompt(
      prompt.name,
      {
        title: prompt.title,
        description: prompt.description,
        argsSchema: prompt.argsSchema,
      },
      (args) => prompt.handler(args),
    );
  }

  return server;
}
