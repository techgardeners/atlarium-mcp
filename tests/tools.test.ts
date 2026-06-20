import { describe, expect, it } from "vitest";

import {
  appToolOutputSchema,
  runTool,
  toolDefinitions,
} from "../src/tools.js";

describe("tool registry", () => {
  it("registers the required public read-only tools", () => {
    expect(toolDefinitions.map((tool) => tool.name)).toEqual([
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
    ]);
    expect(toolDefinitions.every((tool) => tool.readOnly)).toBe(true);
    expect(toolDefinitions.every((tool) => tool.outputSchema === appToolOutputSchema)).toBe(true);
    expect(
      toolDefinitions.every(
        (tool) =>
          tool.appMeta?.["openai/outputTemplate"] ===
            "ui://widget/habitat-explorer.v3.html" &&
          (tool.appMeta?.ui as { resourceUri?: string } | undefined)?.resourceUri ===
            "ui://widget/habitat-explorer.v3.html",
      ),
    ).toBe(true);
    expect(toolDefinitions.some((tool) => tool.name.startsWith("create_"))).toBe(false);
  });

  it("keeps text content and adds structured content for ChatGPT Apps", async () => {
    const result = await runTool("search_fish", async () => ({
      results: [{ common_name: "Blue Acara", slug: "aequidens-pulcher" }],
    }));

    expect(result).toMatchObject({
      structuredContent: {
        data: {
          results: [{ common_name: "Blue Acara", slug: "aequidens-pulcher" }],
        },
        tool: "search_fish",
      },
    });
    expect(result.content[0]?.text).toContain("Blue Acara");
  });
});
