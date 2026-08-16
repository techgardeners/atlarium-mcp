import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const habitatExplorerResourceUri = "ui://widget/habitat-explorer.v4.html";
export const habitatExplorerLegacyResourceUris = [
  "ui://widget/habitat-explorer.v3.html",
  "ui://widget/habitat-explorer.v2.html",
  "ui://widget/habitat-explorer.v1.html",
] as const;
export const habitatExplorerResourceUris = [
  habitatExplorerResourceUri,
  ...habitatExplorerLegacyResourceUris,
] as const;
export const habitatExplorerMimeType = "text/html;profile=mcp-app";
export const habitatExplorerWidgetDomain = "https://mcp.atlarium.bio";
export const habitatExplorerArtifactPath = "dist/widget/habitat-explorer.v4.html";

const habitatExplorerResourceDomains = [
  "https://atlarium.bio",
  "https://mcp.atlarium.bio",
] as const;

export const habitatExplorerToolMeta = {
  ui: {
    resourceUri: habitatExplorerResourceUri,
  },
  "openai/outputTemplate": habitatExplorerResourceUri,
} satisfies Record<string, unknown>;

export const habitatExplorerResourceMeta = {
  title: "Atlarium Habitat Explorer",
  description:
    "Native read-only habitat views for species, compatibility, diagnostics, products, calculations, fertilization and tank planning.",
  mimeType: habitatExplorerMimeType,
  _meta: {
    ui: {
      domain: habitatExplorerWidgetDomain,
      csp: {
        connectDomains: [],
        resourceDomains: [...habitatExplorerResourceDomains],
        frameDomains: [],
      },
      widgetDescription:
        "Display the current Atlarium result as a focused species card, carousel, compatibility review, diagnostic, calculation or habitat plan.",
    },
    "openai/widgetDescription":
      "Display the current Atlarium public result as a focused species card, visual carousel, compatibility review, diagnostic, calculation, fertilization result or habitat plan.",
    "openai/widgetDomain": habitatExplorerWidgetDomain,
    "openai/widgetPrefersBorder": true,
    "openai/widgetCSP": {
      connect_domains: [],
      resource_domains: [...habitatExplorerResourceDomains],
      frame_domains: [],
    },
  },
};

let cachedHtml: string | undefined;

export function habitatExplorerHtml() {
  cachedHtml ??= readWidgetArtifact();
  return cachedHtml;
}

function readWidgetArtifact() {
  const artifactPath = resolve(process.cwd(), habitatExplorerArtifactPath);
  try {
    const html = readFileSync(artifactPath, "utf8");
    if (!html.includes("Atlarium Habitat Explorer") || !html.includes("openai:set_globals")) {
      throw new Error("generated HTML is missing the Habitat Explorer runtime markers");
    }
    return html;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    throw new Error(
      `Habitat Explorer v4 artifact is unavailable at ${artifactPath}: ${reason}. Run \"pnpm widget:build\" before tests, build or startup.`,
    );
  }
}
