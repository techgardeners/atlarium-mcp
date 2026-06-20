import { once } from "node:events";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { describe, expect, it } from "vitest";

import {
  habitatExplorerHtml,
  habitatExplorerMimeType,
  habitatExplorerResourceMeta,
  habitatExplorerResourceUri,
  habitatExplorerResourceUris,
} from "../src/apps/habitat-explorer.js";
import { getRuntimeConfig } from "../src/config.js";
import { createHttpApp } from "../src/http.js";

function testConfig() {
  return getRuntimeConfig({
    NODE_ENV: "test",
    MCP_RATE_LIMIT_ENABLED: "false",
    MCP_TRUST_PROXY: "false",
  });
}

async function withServer<T>(
  callback: (baseUrl: string, server: Server) => Promise<T>,
) {
  const server = createHttpApp(testConfig()).listen(0, "127.0.0.1");
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

describe("ChatGPT App widget", () => {
  it("ships a self-contained Habitat Explorer HTML resource", () => {
    const html = habitatExplorerHtml();

    expect(html).toContain("Atlarium Habitat Explorer");
    expect(html).toContain("--deep-blue");
    expect(html).toContain("--azure");
    expect(html).toContain("data-brand-logo");
    expect(html).toContain("data:image/jpeg;base64");
    expect(html).toContain("brand-logo light");
    expect(html).toContain("brand-logo dark");
    expect(html).toContain("mix-blend-mode: multiply");
    expect(html).toContain("uiCopy");
    expect(html).toContain("Ricerca pesci");
    expect(html).toContain("Acara blu");
    expect(html).toContain("Rasbora arlecchino");
    expect(html).toContain("language: state.language");
    expect(html).toContain("toolLabel(state.tool)");
    expect(html).toContain("reasonParts");
    expect(html).toContain("recommended_actions");
    expect(html).toContain('class="rail"');
    expect(html).toContain('class="rail-button"');
    expect(html).toContain('class="metric-panel"');
    expect(html).toContain("detail-main");
    expect(html).toContain("<svg");
    expect(html).toContain("atlariumImageHosts");
    expect(html).toContain("safeImageUrl");
    expect(html).toContain("imageFor");
    expect(html).toContain("thumb-frame");
    expect(html).toContain("detail-media");
    expect(html).toContain("profile-mini");
    expect(html).toContain("image_url");
    expect(html).toContain("--water-bg");
    expect(html).toContain("--plant-bg");
    expect(html).toContain("--warn-bg");
    expect(html).toContain(".mini-card.warning");
    expect(html).toContain("ui/notifications/tool-result");
    expect(html).toContain("openai:set_globals");
    expect(html).toContain("toolResponseMetadata");
    expect(html).toContain("mcp_tool_result");
    expect(html).toContain("tools/call");
    expect(html).toContain("suggest_species_for_tank");
    expect(html).toContain("isChatGptHost");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<symbol");
    expect(html).not.toContain("<use");
    expect(html).not.toContain("data-brand-mark");
    expect(html).not.toContain("Showing \" +");
    expect(html).not.toContain("Requested \" + name");
    expect(html).not.toMatch(/https?:\/\//);
  });

  it("declares standard and ChatGPT-compatible widget CSP metadata", () => {
    expect(habitatExplorerResourceMeta._meta.ui.domain).toBe("https://mcp.atlarium.bio");
    expect(habitatExplorerResourceMeta._meta["openai/widgetDomain"]).toBe(
      "https://mcp.atlarium.bio",
    );
    expect(habitatExplorerResourceMeta._meta.ui.csp).toEqual({
      connectDomains: [],
      frameDomains: [],
      resourceDomains: ["https://atlarium.bio", "https://mcp.atlarium.bio"],
    });
    expect(habitatExplorerResourceMeta._meta["openai/widgetCSP"]).toEqual({
      connect_domains: [],
      frame_domains: [],
      resource_domains: ["https://atlarium.bio", "https://mcp.atlarium.bio"],
    });
  });

  it("advertises and serves the widget resource through MCP", async () => {
    await withServer(async (baseUrl) => {
      const client = new Client({
        name: "atlarium-widget-test",
        version: "1.0.0",
      });
      const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`));

      try {
        await client.connect(transport);
        const resources = await client.listResources();

        expect(resources.resources).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              mimeType: habitatExplorerMimeType,
              name: "atlarium-habitat-explorer",
              title: "Atlarium Habitat Explorer",
              uri: habitatExplorerResourceUri,
            }),
          ]),
        );
        expect(resources.resources.map((resource) => resource.uri)).toEqual(
          expect.arrayContaining([...habitatExplorerResourceUris]),
        );

        const widget = await client.readResource({ uri: habitatExplorerResourceUri });
        expect(widget.contents).toEqual([
          expect.objectContaining({
            _meta: expect.objectContaining({
              "openai/widgetDomain": "https://mcp.atlarium.bio",
              ui: expect.objectContaining({
                domain: "https://mcp.atlarium.bio",
              }),
            }),
            mimeType: habitatExplorerMimeType,
            text: expect.stringContaining("Atlarium Habitat Explorer"),
            uri: habitatExplorerResourceUri,
          }),
        ]);

        for (const uri of habitatExplorerResourceUris.filter(
          (resourceUri) => resourceUri !== habitatExplorerResourceUri,
        )) {
          const legacyWidget = await client.readResource({ uri });
          expect(legacyWidget.contents).toEqual([
            expect.objectContaining({
              mimeType: habitatExplorerMimeType,
              text: expect.stringContaining("Atlarium Habitat Explorer"),
              uri,
            }),
          ]);
        }
      } finally {
        await client.close();
      }
    });
  });

  it("advertises guided public prompts through MCP", async () => {
    await withServer(async (baseUrl) => {
      const client = new Client({
        name: "atlarium-prompts-test",
        version: "1.0.0",
      });
      const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`));

      try {
        await client.connect(transport);
        const prompts = await client.listPrompts();

        expect(prompts.prompts.map((prompt) => prompt.name)).toEqual(
          expect.arrayContaining([
            "atlarium_species_search",
            "atlarium_habitat_plan",
            "atlarium_tank_calculations",
          ]),
        );

        const prompt = await client.getPrompt({
          name: "atlarium_tank_calculations",
          arguments: { task: "volume for a 60x30x36 cm tank" },
        });
        expect(prompt.messages[0]?.content).toMatchObject({
          type: "text",
          text: expect.stringContaining("calculate_tank_volume"),
        });
      } finally {
        await client.close();
      }
    });
  });
});
