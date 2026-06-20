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
    ]);
    expect(toolDefinitions.every((tool) => tool.readOnly)).toBe(true);
    expect(toolDefinitions.every((tool) => tool.outputSchema === appToolOutputSchema)).toBe(true);
    expect(
      toolDefinitions.every(
        (tool) =>
          tool.appMeta?.["openai/outputTemplate"] ===
            "ui://widget/habitat-explorer.v2.html" &&
          (tool.appMeta?.ui as { resourceUri?: string } | undefined)?.resourceUri ===
            "ui://widget/habitat-explorer.v2.html",
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
