import { ZodError, type z } from "zod";

import { AtlariumApiClient } from "./atlarium-api.js";
import { errorMessage } from "./errors.js";
import { log } from "./logger.js";
import { jsonText } from "./serialization.js";
import {
  compatibilitySchema,
  getProfileSchema,
  getPathProfileSchema,
  searchFishSchema,
  searchGuidesSchema,
  searchPlantsSchema,
  searchProductsSchema,
  suggestionsSchema,
  waterParametersSchema,
} from "./schemas.js";

type ToolSchema = z.ZodObject<z.ZodRawShape>;
type ToolInput = Record<string, unknown>;

export type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  schema: ToolSchema;
  readOnly: true;
  handler: (api: AtlariumApiClient, input: ToolInput) => Promise<unknown>;
};

export const toolDefinitions = [
  {
    name: "search_fish",
    title: "Search fish",
    description:
      "Search fish and aquatic animal profiles in the Atlarium habitat database.",
    schema: searchFishSchema,
    readOnly: true,
    handler: (api, input) => api.searchFish(searchFishSchema.parse(input)),
  },
  {
    name: "get_fish_profile",
    title: "Get fish profile",
    description:
      "Get a structured fish or aquatic animal profile from the Atlarium habitat database.",
    schema: getProfileSchema,
    readOnly: true,
    handler: (api, input) => api.getFishProfile(getProfileSchema.parse(input)),
  },
  {
    name: "search_plants",
    title: "Search plants",
    description: "Search aquatic plants in the Atlarium database.",
    schema: searchPlantsSchema,
    readOnly: true,
    handler: (api, input) => api.searchPlants(searchPlantsSchema.parse(input)),
  },
  {
    name: "get_plant_profile",
    title: "Get plant profile",
    description: "Get a structured aquatic plant profile.",
    schema: getProfileSchema,
    readOnly: true,
    handler: (api, input) => api.getPlantProfile(getProfileSchema.parse(input)),
  },
  {
    name: "search_products",
    title: "Search products",
    description:
      "Search habitat products for aquariums, terrariums and related systems in the Atlarium database.",
    schema: searchProductsSchema,
    readOnly: true,
    handler: (api, input) => api.searchProducts(searchProductsSchema.parse(input)),
  },
  {
    name: "get_product_profile",
    title: "Get product profile",
    description: "Get a structured habitat product profile.",
    schema: getPathProfileSchema,
    readOnly: true,
    handler: (api, input) => api.getProductProfile(getPathProfileSchema.parse(input)),
  },
  {
    name: "check_species_compatibility",
    title: "Check species compatibility",
    description:
      "Check basic compatibility information between habitat species using Atlarium data.",
    schema: compatibilitySchema,
    readOnly: true,
    handler: (api, input) =>
      api.checkSpeciesCompatibility(compatibilitySchema.parse(input)),
  },
  {
    name: "get_water_parameters",
    title: "Get water parameters",
    description:
      "Get recommended water parameters for an aquatic species or plant.",
    schema: waterParametersSchema,
    readOnly: true,
    handler: (api, input) =>
      api.getWaterParameters(waterParametersSchema.parse(input)),
  },
  {
    name: "suggest_species_for_tank",
    title: "Suggest species for tank",
    description:
      "Suggest compatible aquatic species based on tank size and water parameters.",
    schema: suggestionsSchema,
    readOnly: true,
    handler: (api, input) =>
      api.suggestSpeciesForTank(suggestionsSchema.parse(input)),
  },
  {
    name: "search_guides",
    title: "Search guides",
    description: "Search Atlarium habitat guides and educational content.",
    schema: searchGuidesSchema,
    readOnly: true,
    handler: (api, input) => api.searchGuides(searchGuidesSchema.parse(input)),
  },
  {
    name: "get_guide",
    title: "Get guide",
    description: "Get a structured guide from Atlarium.",
    schema: getPathProfileSchema,
    readOnly: true,
    handler: (api, input) => api.getGuide(getPathProfileSchema.parse(input)),
  },
] satisfies ToolDefinition[];

export function toolJson(value: unknown) {
  return {
    content: [{ type: "text" as const, text: jsonText(value) }],
  };
}

export function toolError(error: unknown) {
  const message =
    error instanceof ZodError
      ? error.issues.map((issue) => issue.message).join("; ")
      : errorMessage(error);

  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
  };
}

export async function runTool(
  name: string,
  handler: () => Promise<unknown>,
) {
  const startedAt = Date.now();
  try {
    const value = await handler();
    log("info", "mcp_tool_call", {
      tool: name,
      duration_ms: Date.now() - startedAt,
      status: "ok",
    });
    return toolJson(value);
  } catch (error) {
    log("warn", "mcp_tool_call", {
      tool: name,
      duration_ms: Date.now() - startedAt,
      status: "error",
      error: errorMessage(error),
    });
    return toolError(error);
  }
}
