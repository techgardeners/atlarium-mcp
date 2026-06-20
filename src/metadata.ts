import { z } from "zod";

import {
  habitatExplorerMimeType,
  habitatExplorerResourceUri,
} from "./apps/habitat-explorer.js";
import type { RuntimeConfig } from "./config.js";
import { promptDefinitions } from "./prompts.js";
import { toolDefinitions } from "./tools.js";

export const mcpRegistrySchema =
  "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json";
export const mcpRegistryName = "bio.atlarium/habitat-database";
export const mcpRegistryFallbackName =
  "io.github.techgardeners/atlarium-habitat-database";
export const mcpDisplayName = "Atlarium Habitat Database MCP";
export const mcpTitle = "Atlarium Habitat Database MCP";
export const mcpShortDescription =
  "Structured aquarium, marine, terrarium and paludarium data and public advisory functions for AI agents.";
export const mcpLongDescription =
  "Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data and advisory functions for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, guides, algae, diseases, plant problems, medicines, compatibility, fertilization, habitat planning and public aquarium calculators.";
export const mcpHomepageUrl = "https://atlarium.bio";
export const mcpDocumentationUrl = "https://atlarium.bio/mcp";
export const mcpRepositoryUrl = "https://github.com/techgardeners/atlarium-mcp";
export const mcpMaintainerEmail = "info@techgardeners.com";

export function createGlamaConnectorClaim() {
  return {
    $schema: "https://glama.ai/mcp/schemas/connector.json",
    maintainers: [
      {
        email: mcpMaintainerEmail,
      },
    ],
  };
}

export function createServerCard(config: RuntimeConfig) {
  const endpoint = new URL("/mcp", config.publicBaseUrl).href;

  return {
    name: mcpDisplayName,
    title: mcpTitle,
    slug: "atlarium-habitat-database",
    description: mcpLongDescription,
    shortDescription: mcpShortDescription,
    version: config.MCP_VERSION,
    homepage: mcpHomepageUrl,
    documentationUrl: mcpDocumentationUrl,
    repository: {
      source: "github",
      url: mcpRepositoryUrl,
    },
    transport: {
      type: "streamable-http",
      url: endpoint,
    },
    endpoint,
    auth: {
      type: "none",
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
    categories: [
      "aquariums",
      "marine",
      "terrariums",
      "animals",
      "plants",
      "products",
      "diagnostics",
      "fertilization",
      "calculators",
      "habitat-planning",
    ],
    readOnly: true,
    tools: toolDefinitions.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      readOnly: tool.readOnly,
      inputSchema: z.toJSONSchema(tool.schema),
      outputSchema: tool.outputSchema ? z.toJSONSchema(tool.outputSchema) : undefined,
      _meta: tool.appMeta,
    })),
    resources: [
      {
        name: "atlarium-habitat-explorer",
        title: "Atlarium Habitat Explorer",
        uri: habitatExplorerResourceUri,
        mimeType: habitatExplorerMimeType,
        description:
          "Interactive read-only ChatGPT App widget for public habitat results, profiles, diagnostics, products, calculators, fertilization and tank planning.",
      },
    ],
    prompts: promptDefinitions.map((prompt) => ({
      name: prompt.name,
      title: prompt.title,
      description: prompt.description,
      arguments: Object.keys(prompt.argsSchema),
    })),
    privacy: {
      exposesUserData: false,
      exposesWorkspaceData: false,
      hasWriteTools: false,
      hasAdminTools: false,
    },
  };
}
