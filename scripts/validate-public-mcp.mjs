#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const endpoint = process.env.MCP_VALIDATE_PUBLIC_URL ?? "https://mcp.atlarium.bio/mcp";

const expectedTools = [
  "search_fish",
  "get_fish_profile",
  "search_plants",
  "get_plant_profile",
  "search_products",
  "get_product_profile",
  "check_species_compatibility",
  "get_water_parameters",
  "suggest_species_for_tank",
  "search_guides",
  "get_guide",
];

const toolCalls = [
  ["search_fish", { query: "acara", language: "en", limit: 1 }],
  ["get_fish_profile", { slug: "aequidens-pulcher", language: "en" }],
  ["search_plants", { query: "anubias", language: "en", limit: 1 }],
  ["get_plant_profile", { slug: "anubias-barteri", language: "en" }],
  ["search_products", { query: "filter", language: "en", limit: 1 }],
  [
    "get_product_profile",
    { slug: "equipment/filter/amtra/filpo-click-200", language: "en" },
  ],
  [
    "check_species_compatibility",
    {
      species: ["aequidens-pulcher", "paracheirodon-innesi"],
      language: "en",
      tank_liters: 200,
      ph: 7,
      gh: 8,
      kh: 4,
      temperature: 25,
    },
  ],
  ["get_water_parameters", { type: "fish", slug: "aequidens-pulcher", language: "en" }],
  [
    "suggest_species_for_tank",
    {
      tank_liters: 120,
      language: "en",
      ph: 7,
      gh: 8,
      kh: 4,
      temperature: 25,
      beginner_friendly: true,
      planted_tank: true,
      limit: 3,
    },
  ],
  ["search_guides", { query: "temperature", language: "en", limit: 1 }],
  ["get_guide", { slug: "water-parameters/temperature", language: "en" }],
];

function previewToolText(result) {
  return (
    result.content
      ?.find((item) => item.type === "text")
      ?.text?.replace(/\s+/g, " ")
      .slice(0, 120) ?? ""
  );
}

function assertToolSurface(names) {
  const missing = expectedTools.filter((name) => !names.includes(name));
  const extra = names.filter((name) => !expectedTools.includes(name));
  const forbidden = names.filter((name) =>
    /(workspace|auth|admin|user|write|delete|create|update|secret|token)/i.test(name),
  );

  if (missing.length || extra.length || forbidden.length) {
    throw new Error(
      [
        `missing=${missing.join(",") || "-"}`,
        `extra=${extra.join(",") || "-"}`,
        `forbidden=${forbidden.join(",") || "-"}`,
      ].join(" "),
    );
  }
}

const client = new Client({
  name: "atlarium-public-validation",
  version: "1.0.0",
});
const transport = new StreamableHTTPClientTransport(new URL(endpoint));

try {
  await client.connect(transport);
  const toolsResult = await client.listTools();
  const toolNames = toolsResult.tools.map((tool) => tool.name);
  assertToolSurface(toolNames);
  console.log(`tools/list ok: ${toolNames.length} read-only tools`);

  for (const [name, args] of toolCalls) {
    const result = await client.callTool(
      { name, arguments: args },
      undefined,
      { timeout: 30_000 },
    );
    if (result.isError) {
      throw new Error(`${name} returned isError: ${previewToolText(result)}`);
    }
    console.log(`${name} ok: ${previewToolText(result)}`);
  }
} finally {
  await client.close();
}
