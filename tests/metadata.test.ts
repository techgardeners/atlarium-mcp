import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  mcpDisplayName,
  mcpRegistryName,
  mcpRegistrySchema,
  mcpRepositoryUrl,
  mcpShortDescription,
  mcpTitle,
} from "../src/metadata.js";

function readJson(path: string) {
  return JSON.parse(readFileSync(join(process.cwd(), path), "utf8")) as Record<
    string,
    unknown
  >;
}

describe("publication metadata", () => {
  it("keeps the root registry server.json aligned with the public MCP endpoint", () => {
    const serverJson = readJson("server.json");

    expect(serverJson).toMatchObject({
      $schema: mcpRegistrySchema,
      description: mcpShortDescription,
      name: mcpRegistryName,
      repository: {
        source: "github",
        url: mcpRepositoryUrl,
      },
      title: mcpTitle,
      version: "1.0.0",
    });
    expect(serverJson.remotes).toEqual([
      {
        type: "streamable-http",
        url: "https://mcp.atlarium.bio/mcp",
      },
    ]);
  });

  it("keeps the server card example aligned with the public identity", () => {
    const card = readJson("docs/mcp/server-card.json.example");

    expect(card).toMatchObject({
      auth: {
        type: "none",
      },
      endpoint: "https://mcp.atlarium.bio/mcp",
      name: mcpDisplayName,
      readOnly: true,
      title: mcpTitle,
      transport: {
        type: "streamable-http",
        url: "https://mcp.atlarium.bio/mcp",
      },
    });
  });
});
