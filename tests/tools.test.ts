import { describe, expect, it } from "vitest";

import { toolDefinitions } from "../src/tools.js";

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
    ]);
    expect(toolDefinitions.every((tool) => tool.readOnly)).toBe(true);
    expect(toolDefinitions.some((tool) => tool.name.startsWith("create_"))).toBe(false);
  });
});
