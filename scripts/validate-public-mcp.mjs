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
  "search_algae",
  "get_algae_profile",
  "search_diseases",
  "get_disease_profile",
  "search_plant_problems",
  "get_plant_problem_profile",
  "search_medicines",
  "get_medicine_profile",
  "match_diagnostic_profiles",
  "list_product_categories",
  "list_product_brands",
  "search_equipment",
  "get_equipment_profile",
  "search_fertilizers",
  "get_fertilizer_profile",
  "search_fertilization_regimes",
  "get_fertilization_regime",
  "calculate_fertilizer_dose",
  "calculate_nutrient_gaps",
  "calculate_weekly_dose_totals",
  "generate_fertilization_plan",
  "calculate_tank_volume",
  "calculate_tank_weight",
  "calculate_water_change",
  "calculate_water_chemistry",
  "convert_units",
  "calculate_equipment_requirements",
  "suggest_habitat_for_tank",
];

const toolCalls = [
  ["search_fish", { query: "acara", language: "en", limit: 1 }],
  ["search_algae", { query: "green", language: "en", limit: 1 }],
  ["list_product_categories", { language: "en" }],
  ["search_equipment", { query: "filter", language: "en", limit: 1 }],
  ["search_fertilization_regimes", { language: "en", limit: 1 }],
  ["calculate_tank_volume", { shape: "rect", length_cm: 60, width_cm: 30, height_cm: 36 }],
  ["calculate_water_change", { volume_liters: 120, change_percent: 30, changes_per_week: 1 }],
  ["generate_fertilization_plan", { language: "en", volume_liters: 90, regime: "SEACHEM" }],
  ["suggest_habitat_for_tank", { language: "en", tank_liters: 120, planted_tank: true, limit: 3 }],
  ["search_guides", { query: "temperature", language: "en", limit: 1 }],
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

  const promptsResult = await client.listPrompts();
  const promptNames = promptsResult.prompts.map((prompt) => prompt.name);
  for (const prompt of ["atlarium_species_search", "atlarium_habitat_plan", "atlarium_tank_calculations"]) {
    if (!promptNames.includes(prompt)) {
      throw new Error(`missing prompt ${prompt}`);
    }
  }
  console.log(`prompts/list ok: ${promptNames.length} guided prompts`);

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
