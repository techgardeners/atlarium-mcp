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
    expect(html).toContain("reasonParts");
    expect(html).toContain("recommended_actions");
    expect(html).toContain("ui/notifications/tool-result");
    expect(html).toContain("tools/call");
    expect(html).toContain("suggest_species_for_tank");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<svg");
    expect(html).not.toContain("data-brand-mark");
    expect(html).not.toMatch(/https?:\/\//);
  });

  it("declares standard and ChatGPT-compatible widget CSP metadata", () => {
    expect(habitatExplorerResourceMeta._meta.ui.csp).toEqual({
      connectDomains: [],
      frameDomains: [],
      resourceDomains: [],
    });
    expect(habitatExplorerResourceMeta._meta["openai/widgetCSP"]).toEqual({
      connect_domains: [],
      frame_domains: [],
      resource_domains: [],
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

        expect(resources.resources).toEqual([
          expect.objectContaining({
            mimeType: habitatExplorerMimeType,
            name: "atlarium-habitat-explorer",
            title: "Atlarium Habitat Explorer",
            uri: habitatExplorerResourceUri,
          }),
        ]);

        const widget = await client.readResource({ uri: habitatExplorerResourceUri });
        expect(widget.contents).toEqual([
          expect.objectContaining({
            mimeType: habitatExplorerMimeType,
            text: expect.stringContaining("Atlarium Habitat Explorer"),
            uri: habitatExplorerResourceUri,
          }),
        ]);
      } finally {
        await client.close();
      }
    });
  });
});
