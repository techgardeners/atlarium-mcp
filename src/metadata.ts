import { z } from "zod";

import type { RuntimeConfig } from "./config.js";
import { toolDefinitions } from "./tools.js";

export const mcpRegistrySchema =
  "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json";
export const mcpRegistryName = "bio.atlarium/habitat-database";
export const mcpRegistryFallbackName =
  "io.github.techgardeners/atlarium-habitat-database";
export const mcpDisplayName = "Atlarium Habitat Database MCP";
export const mcpTitle = "Atlarium Habitat Database MCP";
export const mcpShortDescription =
  "Structured aquarium, marine, terrarium and paludarium data for AI agents.";
export const mcpLongDescription =
  "Atlarium MCP is a public read-only MCP server that gives AI agents structured access to data for aquariums, marine tanks, coldwater systems, terrariums, paludariums and vivariums. It includes animals, plants, products, care requirements, environmental parameters, compatibility information, guides and habitat planning tools.";
export const mcpHomepageUrl = "https://atlarium.bio";
export const mcpDocumentationUrl = "https://atlarium.bio/mcp";
export const mcpRepositoryUrl = "https://github.com/techgardeners/atlarium-mcp";

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
      resources: false,
      prompts: false,
    },
    categories: [
      "aquariums",
      "marine",
      "terrariums",
      "animals",
      "plants",
      "habitat-planning",
    ],
    readOnly: true,
    tools: toolDefinitions.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      readOnly: tool.readOnly,
      inputSchema: z.toJSONSchema(tool.schema),
    })),
    privacy: {
      exposesUserData: false,
      exposesWorkspaceData: false,
      hasWriteTools: false,
      hasAdminTools: false,
    },
  };
}
